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
    const record = await getJson<EncryptedPayload>(`patient-summary:${hashPatientIdentifier(patientId)}`);
    return Response.json({ summary: record ? decryptJson<Record<string, unknown>>(record) : null }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse("Your medical summary is temporarily unavailable.", 503);
  }
}
