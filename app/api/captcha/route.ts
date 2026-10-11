import { verifyCaptcha, type CaptchaVersion } from "@/lib/captcha";
import { errorResponse, readJson } from "@/lib/http";

export const dynamic = "force-dynamic";
const actions = new Set([
  "appointment_booking",
  "preauth_request",
  "patient_feedback",
  "general_contact",
  "newsletter_signup",
  "staff_portal_login",
]);

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return errorResponse("Invalid request body.");
  const action = typeof body.action === "string" ? body.action : "";
  if (!actions.has(action)) return errorResponse("Unknown verification action.");
  const result = await verifyCaptcha(
    typeof body.token === "string" ? body.token : undefined,
    action,
    (body.version === "v2" ? "v2" : "v3") as CaptchaVersion,
  );
  if (!result.ok) {
    if (result.fallbackRequired) {
      return Response.json({ ok: false, captchaFallback: true }, { status: 428, headers: { "Cache-Control": "no-store" } });
    }
    return Response.json({ ok: false, error: result.reason ?? "rejected" }, { status: result.reason === "missing-config" ? 503 : 403, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
