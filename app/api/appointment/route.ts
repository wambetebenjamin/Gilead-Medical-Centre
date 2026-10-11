import { randomUUID } from "node:crypto";
import { departments, doctors, healthPackages } from "@/lib/data";
import { clinicHours, isFutureNairobiSlot, isRealDate, nairobiToday } from "@/lib/availability";
import { encryptJson, hashPatientIdentifier } from "@/lib/crypto";
import { checkCaptchaBody, cleanText, errorResponse, isEmail, isPhone, readJson } from "@/lib/http";
import { captchaErrorResponse } from "@/lib/captcha";
import { getJson, releaseSlot, reserveSlot, setJson } from "@/lib/kv";
import { sendAppointmentEmails, sendWhatsAppConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AppointmentRecord = {
  id: string;
  createdAt: string;
  patientName: string;
  dateOfBirth: string;
  patientIdentifier: string;
  phone: string;
  email: string;
  insuranceProvider: string;
  insuranceNumber: string;
  department: string;
  departmentSlug: string;
  doctor: string;
  doctorSlug: string;
  packageSlug?: string;
  packageName?: string;
  appointmentType: string;
  date: string;
  time: string;
  reason: string;
  status: "requested" | "confirmed" | "cancelled";
};

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return errorResponse("Invalid request body.");
  const captcha = await checkCaptchaBody(body, "appointment_booking");
  if (!captcha.ok) return captchaErrorResponse(captcha);

  const patientName = cleanText(body.patientName, 120);
  const dateOfBirth = cleanText(body.dateOfBirth, 10);
  const patientIdentifier = cleanText(body.patientIdentifier, 40);
  const phone = cleanText(body.phone, 24);
  const email = cleanText(body.email, 254).toLowerCase();
  const insuranceProvider = cleanText(body.insuranceProvider, 80);
  const insuranceNumber = cleanText(body.insuranceNumber, 50);
  const departmentSlug = cleanText(body.department, 80);
  const doctorSlug = cleanText(body.doctor, 80) || "next-available";
  const packageSlug = cleanText(body.packageSlug, 80);
  const appointmentType = cleanText(body.appointmentType, 32);
  const date = cleanText(body.date, 10);
  const time = cleanText(body.time, 5);
  const reason = cleanText(body.reason, 300);

  const department = departments.find((entry) => entry.slug === departmentSlug);
  const doctor = doctors.find((entry) => entry.slug === doctorSlug);
  const selectedPackage = packageSlug ? healthPackages.find((entry) => entry.slug === packageSlug) : undefined;
  if (packageSlug && !selectedPackage) return errorResponse("Choose a valid health package.");
  if (!patientName || !dateOfBirth || !patientIdentifier || !phone || !email || !department || !date || !time) {
    return errorResponse("Complete all required patient and appointment details.");
  }
  if (!isEmail(email) || !isPhone(phone)) return errorResponse("Enter a valid email address and phone number.");
  if (doctorSlug !== "next-available" && (!doctor || doctor.departmentSlug !== departmentSlug)) return errorResponse("Choose a valid clinician for this department.");
  if (appointmentType !== "In-Person" && appointmentType !== "Telemedicine") return errorResponse("Choose an appointment type.");
  if (!isRealDate(date) || !clinicHours.includes(time) || !isFutureNairobiSlot(date, time)) return errorResponse("Choose a valid future appointment date and time.");
  if (!isRealDate(dateOfBirth) || dateOfBirth > nairobiToday()) return errorResponse("Enter a valid date of birth.");

  const id = `GMC-${randomUUID().slice(0, 8).toUpperCase()}`;
  const slotKey = `${date}:${time}:${departmentSlug}:${doctorSlug}`;
  let slotReserved = false;
  try {
    const reserved = await reserveSlot(slotKey, id);
    if (!reserved) return errorResponse("That appointment time was just taken. Please choose another slot.", 409);
    slotReserved = true;

    const record: AppointmentRecord = {
      id,
      createdAt: new Date().toISOString(),
      patientName,
      dateOfBirth,
      patientIdentifier,
      phone,
      email,
      insuranceProvider,
      insuranceNumber,
      department: department.name,
      departmentSlug,
      doctor: doctor?.name ?? "Next available clinician",
      doctorSlug,
      packageSlug: selectedPackage?.slug,
      packageName: selectedPackage?.name,
      appointmentType,
      date,
      time,
      reason,
      status: "requested",
    };
    const patientKey = `patient-appointments:${hashPatientIdentifier(patientIdentifier)}`;
    const existingIds = (await getJson<string[]>(patientKey)) ?? [];
    await setJson(`appointment:${id}`, encryptJson(record));
    await setJson(patientKey, [...existingIds, id]);

    const notice = {
      patientName,
      email,
      phone,
      department: department.name,
      doctor: doctor?.name ?? "Next available clinician",
      date,
      time,
      type: appointmentType,
      packageName: selectedPackage?.name,
      id,
    };
    const [emails, whatsappSent] = await Promise.all([
      sendAppointmentEmails(notice).catch(() => ({ patientSent: false, coordinatorSent: false })),
      sendWhatsAppConfirmation(notice).catch(() => false),
    ]);
    slotReserved = false;
    return Response.json(
      {
        ok: true,
        reference: id,
        message: "Your appointment request has been received. The booking team will be in touch to confirm.",
        notifications: { email: emails.patientSent, coordinator: emails.coordinatorSent, whatsapp: whatsappSent },
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    if (slotReserved) await releaseSlot(slotKey).catch(() => undefined);
    return errorResponse("We could not save your request just now. Please call +254 112 272 061 or try again.", 503);
  }
}
