import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { errorResponse } from "@/lib/http";

export type PatientGuard = { patientId: string } | { error: Response };

export async function requirePatient(): Promise<PatientGuard> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: errorResponse("Please sign in to continue.", 401) };
  return { patientId: session.user.id };
}
