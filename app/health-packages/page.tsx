import type { Metadata } from "next";
import Link from "next/link";
import { healthPackages } from "@/lib/data";
import { Check } from "@/components/icons";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "Health Packages & Wellness Checks", description: "Compare wellness check packages at Gilead Medical Centre in Kenya." };

export default function HealthPackagesPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Health packages</span></div><p className="eyebrow">Make time for your health</p><h1>Wellness checks, shaped around you.</h1><p>Explore the inclusions and ask our team which check may suit you. Screening recommendations should be discussed with a qualified clinician.</p></div></section>
      <section className="section"><div className="site-container"><div className="package-grid">{healthPackages.map((item, index) => <article key={item.slug} className={`package-card${index === 1 ? " package-card--featured" : ""}`}>{index === 1 && <span className="package-card__label">Popular</span>}<h2>{item.name}</h2><p className="package-card__price"><span>KES</span><strong>{item.price.toLocaleString("en-KE")}</strong></p><small className="package-card__note">{item.note}</small><ul>{item.includes.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul><ButtonLink href={`/book?package=${item.slug}`} variant={index === 1 ? "primary" : "secondary"}>Book this package</ButtonLink></article>)}</div><p className="pricing-disclaimer">Package names, contents and prices are illustrative for this website prototype and must be confirmed by Gilead Medical Centre before publishing.</p></div></section>
      <section className="section section--wash"><div className="site-container center-cta"><p className="eyebrow">Personal advice matters</p><h2>Have questions about a package?</h2><p>Our care team can explain what is included and whether a clinician recommends a different visit.</p><ButtonLink href="/contact" variant="secondary">Ask our team</ButtonLink></div></section>
    </>
  );
}
