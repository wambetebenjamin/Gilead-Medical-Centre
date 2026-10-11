import type { Metadata } from "next";
import Link from "next/link";
import { PreAuthForm } from "@/components/forms/preauth-form";
import { insuranceProviders } from "@/lib/data";
import { ArrowRight, ShieldCheck } from "@/components/icons";

export const metadata: Metadata = { title: "Insurance & Medical Aid", description: "Accepted insurance providers and secure pre-authorisation requests at Gilead Medical Centre." };

export default function InsurancePage() {
  return (
    <>
      <section className="page-hero"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Insurance</span></div><p className="eyebrow">Support with your cover</p><h1>Let’s make the next step clearer.</h1><p>See participating insurance providers and send a pre-authorisation request to our team.</p></div></section>
      <section className="section"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">Accepted providers</p><h2>Insurance and medical aid.</h2><p className="section-heading__copy">Provider participation and benefits can vary by service. Please confirm your cover before receiving care.</p></div></div><div className="insurance-logos insurance-logos--left" aria-label="Accepted insurance provider names">{insuranceProviders.map((provider) => <span key={provider} className="insurance-logo">{provider}</span>)}</div></div></section>
      <section className="section section--wash"><div className="site-container preauth-layout"><div className="preauth-aside"><span className="preauth-aside__icon"><ShieldCheck size={22} /></span><p className="eyebrow">Secure request</p><h2>Pre-authorisation, without the runaround.</h2><p>Share the details your insurer needs. Documents are stored in private file storage and your request is sent to the configured authorisation contact.</p><ul className="check-list"><li><ShieldCheck size={17} />Encrypted request details</li><li><ShieldCheck size={17} />Private document uploads</li><li><ShieldCheck size={17} />Reference number for follow-up</li></ul><Link href="/legal/privacy-policy" className="text-link">How insurance data is shared<ArrowRight size={15} /></Link></div><PreAuthForm /></div></section>
      <section className="section section--tight"><div className="site-container insurance-help"><div><h2>Need help with your cover?</h2><p>Contact our team before your visit to confirm the documents your provider requires.</p></div><a href="tel:+254112272061">Call +254 112 272 061<ArrowRight size={15} /></a></div></section>
    </>
  );
}
