import type { Metadata } from "next";
import Link from "next/link";
import { BranchContact } from "@/components/branch-contact";
import { ContactForm } from "@/components/forms/contact-form";
import { Phone } from "@/components/icons";

export const metadata: Metadata = { title: "Contact Gilead Medical Centre", description: "Find Gilead Medical Centre in Nairobi or Mombasa and contact our team." };

export default function ContactPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Contact</span></div><p className="eyebrow">We’re here to help</p><h1>Find us in Nairobi and Mombasa.</h1><p>Choose a branch for directions and contact details. For urgent medical assistance, call our 24-hour line.</p><a className="book-help-link" href="tel:+254112272061"><Phone size={15} />Emergency line · +254 112 272 061</a></div></section>
      <section className="section"><div className="site-container"><BranchContact /></div></section>
      <section className="section section--wash"><div className="site-container contact-form-wrap"><div className="contact-aside"><p className="eyebrow">General enquiries</p><h2>How can we help?</h2><p>Send a general enquiry and the right team will get back to you. Please do not include sensitive medical information here.</p><p className="contact-aside__line"><Phone size={18} /><span>Emergency and general phone<br />+254 112 272 061</span></p><p className="contact-aside__line"><Link className="text-link" href="/insurance">Insurance pre-authorisation support</Link></p></div><ContactForm /></div></section>
    </>
  );
}
