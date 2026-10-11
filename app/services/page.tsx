import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { Activity, ArrowRight, FlaskConical, HeartPulse, Pill, Stethoscope, Video } from "@/components/icons";

export const metadata: Metadata = { title: "Patient Services", description: "Outpatient, inpatient, diagnostic, pharmacy and telemedicine services at Gilead Medical Centre." };

const services = [
  { title: "Outpatient care", description: "Consultations, follow-up visits and coordinated care planning.", href: "/departments", icon: Stethoscope },
  { title: "Inpatient care", description: "Support and monitoring when you need hospital-based care.", href: "/departments/icu", icon: HeartPulse },
  { title: "Diagnostics", description: "Laboratory and imaging services coordinated with your care team.", href: "/departments/radiology-imaging", icon: FlaskConical },
  { title: "Pharmacy", description: "Medicine dispensing, counselling and refill request support.", href: "/departments/pharmacy", icon: Pill },
  { title: "Telemedicine", description: "Connect with a clinician remotely from anywhere in Kenya.", href: "/telemedicine", icon: Video },
  { title: "Wellness checks", description: "Explore health packages and ask our team what is right for you.", href: "/health-packages", icon: Activity },
];

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container page-hero__inner"><div><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Services</span></div><p className="eyebrow">Patient services</p><h1>Care that works together.</h1><p>From the first appointment to follow-up, access services designed to support your health and your family.</p></div><ButtonLink href="/book">Book an appointment</ButtonLink></div></section>
      <section className="section"><div className="site-container"><div className="service-grid service-grid--page">{services.map(({ title, description, href, icon: Icon }) => <article className="service-card" key={title}><span className="service-card__icon"><Icon size={22} /></span><h3>{title}</h3><p>{description}</p><Link href={href}>Explore service<ArrowRight size={15} /></Link></article>)}</div></div></section>
      <section className="emergency-cta"><div className="site-container emergency-cta__inner"><div><p>Our team is ready to help.</p><h2>Let’s find the right next step for you.</h2></div><a className="emergency-cta__button" href="tel:+254112272061">Contact the care team<ArrowRight size={16} /></a></div></section>
    </>
  );
}
