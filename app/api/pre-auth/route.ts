import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";
import { encryptJson } from "@/lib/crypto";
import { captchaErrorResponse, verifyCaptcha } from "@/lib/captcha";
import { cleanText, errorResponse, isEmail, readJson } from "@/lib/http";
import { setJson } from "@/lib/kv";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_REQUEST_BYTES = 52 * 1024 * 1024;
const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

async function hasValidFileSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (file.type === "application/pdf") return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((value, index) => bytes[index] === value);
  return false;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) return errorResponse("The upload is too large. Send up to five files of 10 MB each.", 413);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse("Send this request as a multipart form.");
  }
  const captcha = await verifyCaptcha(
    typeof form.get("captchaToken") === "string" ? String(form.get("captchaToken")) : undefined,
    "preauth_request",
    form.get("captchaVersion") === "v2" ? "v2" : "v3",
  );
  if (!captcha.ok) return captchaErrorResponse(captcha);
  if (form.get("consent") !== "true") return errorResponse("Please consent to sharing these details with your insurer.");

  const patientName = cleanText(form.get("patientName"), 120);
  const email = cleanText(form.get("email"), 254).toLowerCase();
  const provider = cleanText(form.get("provider"), 80);
  const policyNumber = cleanText(form.get("policyNumber"), 80);
  const procedure = cleanText(form.get("procedure"), 240);
  const referringDoctor = cleanText(form.get("referringDoctor"), 120);
  if (!patientName || !email || !provider || !policyNumber || !procedure || !referringDoctor || !isEmail(email)) {
    return errorResponse("Complete all required fields with a valid email address.");
  }

  const id = `PA-${randomUUID().slice(0, 8).toUpperCase()}`;
  const uploaded: Array<{ pathname: string; contentType: string; size: number }> = [];
  const files = form.getAll("supportingDocuments").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length > 5) return errorResponse("Upload up to five supporting documents.");
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES || !allowedTypes.has(file.type)) {
      return errorResponse("Documents must be PDF, JPG or PNG files under 10 MB each.");
    }
    if (!(await hasValidFileSignature(file))) return errorResponse("A document did not match its declared file type. Please choose a valid PDF, JPG or PNG file.");
  }

  try {
    if (files.length && !process.env.BLOB_READ_WRITE_TOKEN) {
      return errorResponse("Secure document upload is not configured. Please submit the request without an attachment or contact the centre.", 503);
    }
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      for (const file of files) {
        const extension = file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
        const blob = await put(`pre-auth/${id}/${randomUUID()}.${extension}`, file, {
          access: "private",
          addRandomSuffix: false,
          contentType: file.type,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        uploaded.push({ pathname: blob.pathname, contentType: file.type, size: file.size });
      }
    }

    const record = {
      id,
      submittedAt: new Date().toISOString(),
      patientName,
      email,
      provider,
      policyNumber,
      procedure,
      referringDoctor,
      documents: uploaded,
      status: "received",
    };
    await setJson(`preauth:${id}`, encryptJson(record));
    const to = process.env.PREAUTH_NOTIFICATION_EMAIL;
    const emailSent = to
      ? await sendEmail({
          to,
          replyTo: email,
          subject: `New insurance pre-authorisation request · ${provider}`,
          text: `A secure pre-authorisation request was submitted.\nReference: ${id}\nProvider: ${provider}\nProcedure requested: ${procedure}\nReferring clinician: ${referringDoctor}\nPatient contact: ${email}\n\nPlease retrieve the request through the secure workflow. Do not reply with clinical details over unencrypted email.`,
        }).catch(() => false)
      : false;
    return Response.json(
      { ok: true, reference: id, message: "Your pre-authorisation request has been received securely.", notificationSent: emailSent },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    if (uploaded.length && process.env.BLOB_READ_WRITE_TOKEN) {
      await del(uploaded.map((item) => item.pathname), { token: process.env.BLOB_READ_WRITE_TOKEN }).catch(() => undefined);
    }
    return errorResponse("We could not process this request. Please try again or contact the centre.", 503);
  }
}
