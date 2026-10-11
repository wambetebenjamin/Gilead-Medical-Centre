import { createHash } from "node:crypto";
import { decryptJson, encryptJson, hashPatientIdentifier, type EncryptedPayload } from "@/lib/crypto";
import { errorResponse, readJson } from "@/lib/http";
import { getJson, setJson } from "@/lib/kv";
import { requirePatient } from "@/lib/portal";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

type Bill = { id: string; amountDue: number; status?: string; reference?: string };

function darajaPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith("7")) return `254${digits}`;
  return null;
}

function darajaTimestamp() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "00";
  return `${part("year")}${part("month")}${part("day")}${part("hour")}${part("minute")}${part("second")}`;
}

async function getDarajaToken(baseUrl: string) {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("M-Pesa credentials are not configured.");
  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Could not authenticate with Daraja.");
  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Daraja did not return an access token.");
  return data.access_token;
}

export async function POST(request: Request) {
  const auth = await requirePatient();
  if ("error" in auth) return auth.error;
  const { patientId } = auth;
  const body = await readJson(request);
  if (!body) return errorResponse("Invalid payment request.");
  const billId = typeof body.billId === "string" ? body.billId.slice(0, 80) : "";
  const phone = typeof body.phone === "string" ? darajaPhone(body.phone) : null;
  if (!billId || !phone) return errorResponse("Enter a valid M-Pesa phone number and bill reference.");

  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;
  const callbackSecret = process.env.MPESA_CALLBACK_SECRET;
  if (!shortcode || !passkey || !callbackUrl || !callbackSecret) {
    return errorResponse("M-Pesa payments are not configured yet. Please contact the billing desk.", 503);
  }

  try {
    const hash = hashPatientIdentifier(patientId);
    const encrypted = await getJson<EncryptedPayload>(`patient-bills:${hash}`);
    const bills = encrypted ? decryptJson<Bill[]>(encrypted) : [];
    const bill = bills.find((entry) => entry.id === billId && entry.status !== "paid");
    if (!bill || !Number.isSafeInteger(bill.amountDue) || bill.amountDue < 1) return errorResponse("This bill could not be found or is already paid.", 404);

    const baseUrl = process.env.MPESA_ENV === "sandbox" ? "https://sandbox.safaricom.co.ke" : "https://api.safaricom.co.ke";
    const accessToken = await getDarajaToken(baseUrl);
    const timestamp = darajaTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    const callback = new URL(callbackUrl);
    callback.searchParams.set("token", callbackSecret);
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(bill.amountDue),
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: callback.toString(),
        AccountReference: bill.reference ?? bill.id,
        TransactionDesc: "Gilead Medical Centre bill payment",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const result = (await response.json()) as { ResponseCode?: string; CheckoutRequestID?: string; CustomerMessage?: string };
    if (!response.ok || result.ResponseCode !== "0" || !result.CheckoutRequestID) {
      return errorResponse("M-Pesa could not start the payment. Please try again or contact the billing desk.", 502);
    }
    const transactionHash = createHash("sha256").update(result.CheckoutRequestID).digest("hex");
    await setJson(`mpesa-payment:${transactionHash}`, encryptJson({ patientHash: hash, billId, amount: bill.amountDue, status: "pending", createdAt: new Date().toISOString() }));
    return Response.json(
      { ok: true, message: result.CustomerMessage ?? "Check your phone and enter your M-Pesa PIN to complete payment.", checkoutRequestId: result.CheckoutRequestID },
      { status: 202, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return errorResponse("M-Pesa is temporarily unavailable. No payment was taken.", 503);
  }
}
