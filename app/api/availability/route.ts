import { departments, doctors } from "@/lib/data";
import { clinicHours, isFutureNairobiSlot, isRealDate, nairobiToday } from "@/lib/availability";
import { getJson } from "@/lib/kv";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? "";
  const departmentSlug = url.searchParams.get("department") ?? "";
  const doctorSlug = url.searchParams.get("doctor") ?? "next-available";
  const department = departments.find((entry) => entry.slug === departmentSlug);
  const doctor = doctors.find((entry) => entry.slug === doctorSlug);

  if (!isRealDate(date) || date < nairobiToday()) {
    return Response.json({ error: "Choose a valid future appointment date." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  if (!department || (doctorSlug !== "next-available" && (!doctor || doctor.departmentSlug !== departmentSlug))) {
    return Response.json({ error: "Choose a valid department and clinician." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  try {
    const slots = await Promise.all(clinicHours.filter((time) => isFutureNairobiSlot(date, time)).map(async (time) => {
      const id = `${date}:${time}:${departmentSlug}:${doctorSlug}`;
      const reserved = await getJson<string>(`slot:${id}`);
      return { id, time, available: !reserved };
    }));
    return Response.json({ date, slots: slots.filter((slot) => slot.available) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return Response.json({ error: "Appointment availability is temporarily unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
