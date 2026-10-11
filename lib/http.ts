import { verifyCaptcha, type CaptchaVersion } from "@/lib/captcha";

export async function checkCaptchaBody(body: Record<string, unknown>, action: string) {
  return verifyCaptcha(
    typeof body.captchaToken === "string" ? body.captchaToken : undefined,
    action,
    (body.captchaVersion === "v2" ? "v2" : "v3") as CaptchaVersion,
  );
}

export function cleanText(value: unknown, maxLength = 500) {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u001f\u007f]/g, "").slice(0, maxLength) : "";
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function isPhone(value: string) {
  return /^\+?[\d\s().-]{7,20}$/.test(value);
}

export function errorResponse(message = "We could not process your request.", status = 400) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function readJson(request: Request) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
