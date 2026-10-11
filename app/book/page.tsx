import type { Metadata } from "next";
import Link from "next/link";
import { BookingWizard } from "@/components/forms/booking-wizard";
import { Phone } from "@/components/icons";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Request an outpatient appointment at Gilead Medical Centre in Nairobi or Mombasa.",
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Book an appointment</span></div><p className="eyebrow">A simple next step</p><h1>Book an appointment.</h1><p>Tell us what you need and our booking team will contact you to confirm. For urgent medical care, please call our emergency line.</p><a className="book-help-link" href="tel:+254112272061"><Phone size={15} />+254 112 272 061 · Open 24 hours</a></div></section>
      <section className="booking-section"><div className="site-container"><BookingWizard /></div></section>
    </>
  );
}
