import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PortalDashboard } from "@/components/portal-dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Patient Portal", robots: { index: false, follow: false } };

export default async function PortalPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/portal/login");
  return <section className="section portal-section"><div className="site-container"><div className="page-heading-inline"><div><p className="eyebrow">Private patient services</p><h1>Your health, in one place.</h1><p>Manage appointments, review your medical summary, bills and prescriptions.</p></div></div><PortalDashboard patientName={session.user.name ?? "Gilead patient"} /></div></section>;
}
