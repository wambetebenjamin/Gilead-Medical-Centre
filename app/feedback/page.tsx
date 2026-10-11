import type { Metadata } from "next";
import Link from "next/link";
import { FeedbackForm } from "@/components/forms/feedback-form";

export const metadata: Metadata = { title: "Patient Feedback", description: "Share anonymous feedback about your visit to Gilead Medical Centre." };

export default function FeedbackPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Patient feedback</span></div><p className="eyebrow">Your experience matters</p><h1>Help us make care better.</h1><p>Share a few details about your visit. This form is anonymous—please do not include names or other identifying information.</p></div></section>
      <section className="section section--wash"><div className="site-container feedback-layout"><div className="feedback-aside"><p className="eyebrow">We’re listening</p><h2>Every experience can help us improve.</h2><p>We review feedback to improve our patient services. If your message needs a personal response, please use our <Link href="/contact">contact form</Link> instead.</p><p className="feedback-aside__note">For urgent medical care, call <a href="tel:+254112272061">+254 112 272 061</a>.</p></div><FeedbackForm /></div></section>
    </>
  );
}
