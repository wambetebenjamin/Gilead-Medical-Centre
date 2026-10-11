import { createHash, timingSafeEqual } from "node:crypto";
import { decryptJson, encryptJson, type EncryptedPayload } from "@/lib/crypto";
import { getJson, setJson } from "@/lib/kv";

type DarajaCallback = {
  Body?: {
    stkCallback?: {
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: { Item?: Array<{ Name?: string; Value?: string | number }> };
    };
  };
};

type PendingPayment = { patientHash: string; billId: string; amount: number; status: string; createdAt: string };

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const provided = new URL(request.url).searchParams.get("token") ?? "";
  const expected = process.env.MPESA_CALLBACK_SECRET ?? "";
  if (!provided || !expected || provided.length !== expected.length || !timingSafeEqual(Buffer.from(provided), Buffer.from(expected))) {
    return new Response(null, { status: 401 });
  }
  try {
    const body = (await request.json()) as DarajaCallback;
    const callback = body.Body?.stkCallback;
    const checkoutId = callback?.CheckoutRequestID;
    if (!checkoutId || typeof callback.ResultCode !== "number") return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
    const key = createHash("sha256").update(checkoutId).digest("hex");
    const stored = await getJson<EncryptedPayload>(`mpesa-payment:${key}`);
    if (!stored) return Response.json({ ResultCode: 0, ResultDesc: "Accepted" });
    const payment = decryptJson<PendingPayment>(stored);
    const receipt = callback.CallbackMetadata?.Item?.find((item) => item.Name === "MpesaReceiptNumber")?.Value;
    payment.status = callback.ResultCode === 0 ? "paid" : "failed";
    await setJson(`mpesa-payment:${key}`, encryptJson({ ...payment, receipt: receipt ? String(receipt) : undefined, result: callback.ResultDesc ?? "" }));

    if (callback.ResultCode === 0) {
      const billsKey = `patient-bills:${payment.patientHash}`;
      const billsRecord = await getJson<EncryptedPayload>(billsKey);
      if (billsRecord) {
        const bills = decryptJson<Array<{ id: string; status?: string; amountDue?: number; paidAt?: string; receipt?: string }>>(billsRecord);
        const updated = bills.map((bill) => bill.id === payment.billId ? { ...bill, status: "paid", amountDue: 0, paidAt: new Date().toISOString(), receipt: receipt ? String(receipt) : undefined } : bill);
        await setJson(billsKey, encryptJson(updated));
      }
    }
    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ResultCode: 0, ResultDesc: "Accepted" }, { headers: { "Cache-Control": "no-store" } });
  }
}
