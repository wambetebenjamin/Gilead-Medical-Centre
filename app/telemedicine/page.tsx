import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { ArrowRight, CalendarDays, ShieldCheck, Video } from "@/components/icons";

export const metadata: Metadata = { title: "Telemedicine", description: "See a doctor from anywhere in Kenya with Gilead Medical Centre telemedicine." };

const specialties = ["General Medicine", "Paediatrics", "Cardiology", "Maternity & Women’s Health", "Follow-up consultations", "Medicine reviews"];

export default function TelemedicinePage() {
  return (
    <>
      <section className="page-hero"><div className="site-container page-hero__inner"><div><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Telemedicine</span></div><p className="eyebrow">Care, wherever you are</p><h1>See a doctor from anywhere in Kenya.</h1><p>Talk with a clinician remotely, get guidance on your next step and arrange in-person care when needed.</p></div><ButtonLink href="/book?appointmentType=Telemedicine">Book a telemedicine session</ButtonLink></div></section>
      <section className="section"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">Simple from the start</p><h2>How telemedicine works.</h2><p className="section-heading__copy">Our booking team will confirm your session and explain how to join securely.</p></div></div><div className="steps-grid"><article className="step-card"><span>01</span><CalendarDays size={23} /><h3>Request a session</h3><p>Choose telemedicine while booking and share your contact details.</p></article><article className="step-card"><span>02</span><ShieldCheck size={23} /><h3>We confirm your visit</h3><p>Our team checks availability and sends the appointment details by email.</p></article><article className="step-card"><span>03</span><Video size={23} /><h3>Join your consultation</h3><p>Use the secure video link sent after your booking has been confirmed.</p></article></div></div></section>
      <section className="section section--wash"><div className="site-container telemedicine-layout"><div><p className="eyebrow">Available online</p><h2>Specialities for a remote conversation.</h2><p className="section-intro">Whether a remote visit is right for you depends on your concern. Our booking team can guide you toward an in-person visit if an examination or urgent care is needed.</p><div className="specialty-tags">{specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}</div></div><div className="telemedicine-note"><Video size={25} /><h3>Telemedicine is not for emergencies.</h3><p>If you have severe symptoms or need urgent medical attention, call our emergency line or go to the nearest emergency department.</p><a href="tel:+254112272061">Emergency · +254 112 272 061<ArrowRight size={15} /></a></div></div></section>
      <section className="section section--tight"><div className="site-container center-cta"><p className="eyebrow">Your next step</p><h2>Book a telemedicine session.</h2><p>We’ll confirm availability and send the secure joining instructions after confirmation.</p><ButtonLink href="/book?appointmentType=Telemedicine">Book a telemedicine session</ButtonLink></div></section>
    </>
  );
}
