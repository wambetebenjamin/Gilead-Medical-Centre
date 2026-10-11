import type { Metadata } from "next";
import Link from "next/link";
import { PortalLoginForm } from "@/components/forms/portal-login-form";
import { Check, HeartPulse } from "@/components/icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { title: "Patient Portal Sign In", robots: { index: false, follow: false } };

export default function PortalLoginPage() {
  return (
    <section className="section portal-section"><div className="site-container portal-login-wrap"><div className="portal-login-aside"><p className="eyebrow"><span className="eyebrow__rule" />Your care, in one place</p><h1>Welcome to your patient portal.</h1><p>View upcoming appointments, your medical summary, bills and active prescriptions in a secure space.</p><ul className="check-list"><li><Check size={17} />Keep track of appointments</li><li><Check size={17} />Review bills and payment history</li><li><Check size={17} />Request prescription refills</li></ul><p className="portal-login-aside__privacy"><HeartPulse size={16} />Your health data is treated with the highest confidentiality.</p><Link className="text-link" href="/contact">Need help? Contact our patient support team</Link></div><PortalLoginForm /></div></section>
  );
}
