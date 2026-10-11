import { captchaErrorResponse } from "@/lib/captcha";
import { checkCaptchaBody, cleanText, errorResponse, isEmail, isPhone, readJson } from "@/lib/http";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) return errorResponse("Invalid request body.");
  const captcha = await checkCaptchaBody(body, "general_contact");
  if (!captcha.ok) return captchaErrorResponse(captcha);
  const name = cleanText(body.name, 120);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 24);
  const branch = cleanText(body.branch, 40);
  const subject = cleanText(body.subject, 120);
  const message = cleanText(body.message, 1500);
  if (!name || !email || !subject || !message || !isEmail(email) || (phone && !isPhone(phone))) {
    return errorResponse("Complete the required fields with valid contact details.");
  }
  if (message.length < 12) return errorResponse("Please add a little more detail to your message.");
  try {
    const sent = await sendEmail({
      to: process.env.CONTACT_EMAIL ?? "",
      replyTo: email,
      subject: `Website enquiry · ${subject}`,
      text: `Branch: ${branch || "General"}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nSubject: ${subject}\n\n${message}`,
    });
    if (!sent) return errorResponse("The enquiry service is not configured yet. Please call +254 112 272 061.", 503);
    return Response.json({ ok: true, message: "Thank you. Your enquiry has been sent." }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("We could not send your enquiry just now. Please call +254 112 272 061.", 503);
  }
}
