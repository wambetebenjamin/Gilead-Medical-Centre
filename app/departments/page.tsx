import type { Metadata } from "next";
import Link from "next/link";
import { departments } from "@/lib/data";
import { ArrowRight, DepartmentIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Departments & Services",
  description: "Explore Gilead Medical Centre departments and specialist services in Nairobi and Mombasa.",
};

export default function DepartmentsPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container page-hero__inner"><div><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Departments</span></div><p className="eyebrow">Care under one roof</p><h1>Find the right care team.</h1><p>Explore our departments, services and facilities. If you are unsure where to begin, our team can help guide your next step.</p></div><ButtonLink href="/book">Book an appointment</ButtonLink></div></section>
      <section className="section"><div className="site-container"><div className="department-page-grid">{departments.map((department, index) => <article className="department-page-card" key={department.slug}><div className="department-page-card__top"><span className="department-page-card__index">{String(index + 1).padStart(2, "0")} / 12</span><span className="department-card__icon"><DepartmentIcon name={department.icon} /></span></div><h2>{department.name}</h2><p>{department.description}</p><p className="department-page-card__head">Head of department · {department.head}</p><Link href={`/departments/${department.slug}`}>View services and facilities<ArrowRight size={15} /></Link></article>)}</div></div></section>
      <section className="emergency-cta"><div className="site-container emergency-cta__inner"><div><p>Not sure where to go?</p><h2>We’ll help you find the right department.</h2></div><a className="emergency-cta__button" href="tel:+254112272061">Talk to our team<ArrowRight size={16} /></a></div></section>
    </>
  );
}
