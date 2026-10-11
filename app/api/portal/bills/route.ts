import { decryptJson, hashPatientIdentifier, type EncryptedPayload } from "@/lib/crypto";
import { errorResponse } from "@/lib/http";
import { getJson } from "@/lib/kv";
import { requirePatient } from "@/lib/portal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const auth = await requirePatient();
  if ("error" in auth) return auth.error;
  const { patientId } = auth;
  try {
    const record = await getJson<EncryptedPayload>(`patient-bills:${hashPatientIdentifier(patientId)}`);
    return Response.json({ bills: record ? decryptJson<unknown[]>(record) : [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Billing information is temporarily unavailable.", 503);
  }
}
