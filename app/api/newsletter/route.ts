import { captchaErrorResponse } from "@/lib/captcha";
import { encryptJson, hashPatientIdentifier } from "@/lib/crypto";
import { checkCaptchaBody, cleanText, errorResponse, isEmail, readJson } from "@/lib/http";
import { getJson, setJson } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return errorResponse("Invalid request body.");
  const captcha = await checkCaptchaBody(body, "newsletter_signup");
  if (!captcha.ok) return captchaErrorResponse(captcha);
  const email = cleanText(body.email, 254).toLowerCase();
  if (!isEmail(email)) return errorResponse("Enter a valid email address.");
  if (body.consent !== true) return errorResponse("Please confirm you would like to receive health updates.");
  try {
    const hash = hashPatientIdentifier(email);
    const exists = await getJson<boolean>(`newsletter:${hash}`);
    if (!exists) await setJson(`newsletter:${hash}`, encryptJson({ email, subscribedAt: new Date().toISOString(), consent: true }));
    return Response.json({ ok: true, message: "You are subscribed to Gilead health updates." }, { status: exists ? 200 : 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Newsletter sign-up is temporarily unavailable.", 503);
  }
}
