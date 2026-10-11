import { randomUUID } from "node:crypto";
import { departments } from "@/lib/data";
import { verifyCaptcha } from "@/lib/captcha";
import { encryptJson } from "@/lib/crypto";
import { captchaErrorResponse } from "@/lib/captcha";
import { cleanText, errorResponse } from "@/lib/http";
import { getJson, setJson } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("Invalid feedback request.");
  }
  const captcha = await verifyCaptcha(
    typeof form.get("captchaToken") === "string" ? String(form.get("captchaToken")) : undefined,
    "patient_feedback",
    form.get("captchaVersion") === "v2" ? "v2" : "v3",
  );
  if (!captcha.ok) return captchaErrorResponse(captcha);

  const rating = Number(form.get("rating"));
  const department = cleanText(form.get("department"), 80);
  const visitDate = cleanText(form.get("visitDate"), 10);
  const comments = cleanText(form.get("comments"), 1000);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !department || !visitDate || !comments) {
    return errorResponse("Please complete the rating, department, visit date and comments.");
  }
  if (department !== "Other" && !departments.some((entry) => entry.slug === department)) return errorResponse("Choose a valid department.");
  const id = randomUUID();
  try {
    await setJson(`feedback:${id}`, encryptJson({ rating, department, visitDate, comments, submittedAt: new Date().toISOString() }));
    const index = (await getJson<string[]>("feedback:index")) ?? [];
    await setJson("feedback:index", [...index, id]);
    return Response.json({ ok: true, message: "Thank you. Your feedback has been received anonymously." }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Feedback is temporarily unavailable. Please try again later.", 503);
  }
}
