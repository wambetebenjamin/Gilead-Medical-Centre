import { decryptJson, encryptJson, hashPatientIdentifier, type EncryptedPayload } from "@/lib/crypto";
import { errorResponse, readJson } from "@/lib/http";
import { getJson, releaseSlot, reserveSlot, setJson } from "@/lib/kv";
import { requirePatient } from "@/lib/portal";
import { clinicHours, isFutureNairobiSlot, isRealDate, nairobiToday } from "@/lib/availability";

type PortalAppointment = {
  id: string;
  date: string;
  time: string;
  department: string;
  departmentSlug: string;
  doctor: string;
  doctorSlug: string;
  packageSlug?: string;
  packageName?: string;
  appointmentType: string;
  status: "requested" | "confirmed" | "cancelled";
  createdAt: string;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth = await requirePatient();
  if ("error" in auth) return auth.error;
  const { patientId } = auth;
  try {
    const ids = (await getJson<string[]>(`patient-appointments:${hashPatientIdentifier(patientId)}`)) ?? [];
    const records = await Promise.all(ids.map((id) => getJson<EncryptedPayload>(`appointment:${id}`)));
    const appointments = records
      .filter((record): record is EncryptedPayload => Boolean(record))
      .map((record) => decryptJson<PortalAppointment>(record))
      .filter((appointment) => appointment.status !== "cancelled")
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    return Response.json({ appointments }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Your appointments are temporarily unavailable.", 503);
  }
}

export async function PATCH(request: Request) {
  const auth = await requirePatient();
  if ("error" in auth) return auth.error;
  const { patientId } = auth;
  const body = await readJson(request);
  if (!body) return errorResponse("Invalid request body.");
  const id = typeof body.id === "string" ? body.id : "";
  const operation = body.operation === "cancel" ? "cancel" : body.operation === "reschedule" ? "reschedule" : "";
  if (!id || !operation) return errorResponse("Choose a valid appointment action.");

  let pendingRescheduleSlot = "";
  let pendingRescheduleReserved = false;
  try {
    const patientKey = `patient-appointments:${hashPatientIdentifier(patientId)}`;
    const ids = (await getJson<string[]>(patientKey)) ?? [];
    if (!ids.includes(id)) return errorResponse("Appointment not found.", 404);
    const encrypted = await getJson<EncryptedPayload>(`appointment:${id}`);
    if (!encrypted) return errorResponse("Appointment not found.", 404);
    const current = decryptJson<PortalAppointment>(encrypted);
    if (current.status === "cancelled") return errorResponse("This appointment has already been cancelled.", 409);
    const appointmentAt = new Date(`${current.date}T${current.time}:00+03:00`).getTime();
    if (!Number.isFinite(appointmentAt) || appointmentAt - Date.now() < 24 * 60 * 60 * 1000) {
      return errorResponse("Appointments must be changed at least 24 hours before the scheduled time. Please call the centre for urgent assistance.", 409);
    }

    if (operation === "cancel") {
      current.status = "cancelled";
      await setJson(`appointment:${id}`, encryptJson(current));
      await releaseSlot(`${current.date}:${current.time}:${current.departmentSlug}:${current.doctorSlug}`).catch(() => undefined);
      return Response.json({ ok: true, message: "Your appointment has been cancelled." }, { headers: { "Cache-Control": "no-store" } });
    }

    const date = typeof body.date === "string" ? body.date : "";
    const time = typeof body.time === "string" ? body.time : "";
    if (!isRealDate(date) || date < nairobiToday() || !clinicHours.includes(time) || !isFutureNairobiSlot(date, time)) return errorResponse("Choose a valid clinic date and time.");
    const newTime = new Date(`${date}T${time}:00+03:00`).getTime();
    if (newTime - Date.now() < 24 * 60 * 60 * 1000) return errorResponse("Choose a time at least 24 hours from now.", 409);
    const oldSlot = `${current.date}:${current.time}:${current.departmentSlug}:${current.doctorSlug}`;
    const newSlot = `${date}:${time}:${current.departmentSlug}:${current.doctorSlug}`;
    if (newSlot === oldSlot) return Response.json({ ok: true, message: "Your appointment is already booked for that time.", appointment: { id, date, time } }, { headers: { "Cache-Control": "no-store" } });
    const reserved = await reserveSlot(newSlot, id);
    if (!reserved) return errorResponse("That slot is no longer available. Choose another time.", 409);
    pendingRescheduleSlot = newSlot;
    pendingRescheduleReserved = true;
    current.date = date;
    current.time = time;
    await setJson(`appointment:${id}`, encryptJson(current));
    pendingRescheduleReserved = false;
    await releaseSlot(oldSlot).catch(() => undefined);
    return Response.json({ ok: true, message: "Your appointment has been rescheduled.", appointment: { id, date, time } }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    if (pendingRescheduleReserved) await releaseSlot(pendingRescheduleSlot).catch(() => undefined);
    return errorResponse("We could not update this appointment. Please try again or call +254 112 272 061.", 503);
  }
}
