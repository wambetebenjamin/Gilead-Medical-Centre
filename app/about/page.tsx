import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { Check, HeartPulse, ShieldCheck, UsersRound } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Gilead Medical Centre",
  description: "Learn about Gilead Medical Centre’s patient-first approach across Nairobi and Mombasa.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container page-hero__inner"><div><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>About</span></div><p className="eyebrow">Our purpose</p><h1>Care that feels closer.</h1><p>Gilead Medical Centre serves patients and families in Nairobi and Mombasa with compassion, clear communication and coordinated care.</p></div><ButtonLink href="/book">Plan your visit</ButtonLink></div></section>
      <section className="section"><div className="site-container split-section"><div className="split-section__visual"><img src="/images/uganda-ward-care.jpg" alt="A family receiving care in a hospital ward" loading="lazy" /><div className="split-section__badge"><HeartPulse size={20} /><span><strong>People at the centre</strong><small>Care with dignity and respect</small></span></div></div><div className="split-section__copy"><p className="eyebrow"><span className="eyebrow__rule" />Our approach</p><h2>Your health. Our highest calling.</h2><p>Health is personal. Our goal is to make care easier to access, easier to understand and easier to continue—whether you are visiting for a check-up, a specialist consultation or urgent support.</p><ul className="check-list"><li><Check size={17} />Listen carefully and explain the next step</li><li><Check size={17} />Connect outpatient, inpatient and diagnostic teams</li><li><Check size={17} />Support patients and families across two Kenyan cities</li></ul><p className="meta-text" style={{ color: "#7c899a" }}>Photography shown is illustrative. Please replace with Gilead-approved East African staff and facility photography before launch.</p></div></div></section>
      <section className="section section--wash"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">What guides us</p><h2>Good care is built on trust.</h2><p className="section-heading__copy">We believe each person deserves respectful, private and thoughtful care.</p></div></div><div className="service-grid"><article className="service-card"><span className="service-card__icon"><HeartPulse size={22} /></span><h3>Care with compassion</h3><p>We see the person, not just the appointment, and make room for questions and family support.</p></article><article className="service-card"><span className="service-card__icon"><ShieldCheck size={22} /></span><h3>Privacy and dignity</h3><p>Patient health information is handled confidentially and used only for care and related services.</p></article><article className="service-card"><span className="service-card__icon"><UsersRound size={22} /></span><h3>Connected teams</h3><p>Our departments work together so patients can move through care with greater clarity.</p></article></div></div></section>
      <section className="section"><div className="site-container insurance-band"><div><p className="eyebrow">Care across Kenya</p><h2>Nairobi & Mombasa.</h2><p>Choose a branch to find directions, contact details and opening information.</p><div style={{ marginTop: 20 }}><ButtonLink href="/contact" variant="secondary">Contact our branches</ButtonLink></div></div><div className="branch-mini-grid"><div><span>Nairobi</span><strong>Open 24 hours</strong></div><div><span>Mombasa</span><strong>Open 24 hours</strong></div></div></div></section>
    </>
  );
}
