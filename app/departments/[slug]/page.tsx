import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { departments, doctors } from "@/lib/data";
import { ArrowRight, Check, DepartmentIcon, MapPin, ShieldCheck } from "@/components/icons";
import { DoctorCard } from "@/components/doctor-card";
import { ButtonLink } from "@/components/ui";

export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() { return departments.map((department) => ({ slug: department.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const department = departments.find((item) => item.slug === slug);
  if (!department) return { title: "Department not found" };
  return {
    title: department.name,
    description: department.description,
    openGraph: { title: `${department.name} | Gilead Medical Centre`, description: department.description, images: department.image ? [department.image] : ["/images/uganda-child-care.jpg"] },
  };
}

export default async function DepartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const department = departments.find((item) => item.slug === slug);
  if (!department) notFound();
  const departmentDoctors = doctors.filter((doctor) => doctor.departmentSlug === department.slug);
  const schema = { "@context": "https://schema.org", "@type": "MedicalClinic", name: `${department.name} at Gilead Medical Centre`, description: department.description, medicalSpecialty: department.name, telephone: "+254112272061" };
  return (
    <>
      <section className="department-detail-hero"><div className="site-container department-detail-hero__grid"><div className="department-detail-hero__copy"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/departments">Departments</Link><span>/</span><span>{department.shortName}</span></div><p className="eyebrow"><span className="eyebrow__rule" />Department</p><div className="department-detail-hero__icon"><DepartmentIcon name={department.icon} size={26} /></div><h1>{department.name}</h1><p>{department.description}</p><ButtonLink href={`/book?department=${department.slug}`}>Book in this department</ButtonLink><div className="department-detail-hero__hod"><span className="department-detail-hero__hod-icon"><ShieldCheck size={18} /></span><span><small>Head of department</small><strong>{department.head}</strong><small className="profile-note">Illustrative roster · verify clinician details</small></span></div></div><div className="department-detail-hero__photo"><img src={department.image ?? "/images/clinical-team.jpg"} alt={`Patient care in ${department.name}`} /><span><MapPin size={15} />Nairobi & Mombasa</span></div></div></section>
      <section className="section"><div className="site-container department-detail-columns"><div><p className="eyebrow">Care we provide</p><h2>Services within {department.shortName}.</h2><ul className="detail-list">{department.services.map((service) => <li key={service}><Check size={17} />{service}</li>)}</ul></div><div><p className="eyebrow">Our facilities</p><h2>Support at every step.</h2><ul className="detail-list">{department.facilities.map((facility) => <li key={facility}><Check size={17} />{facility}</li>)}</ul></div></div></section>
      {departmentDoctors.length > 0 && <section className="section section--wash"><div className="site-container"><div className="section-heading"><div><p className="eyebrow">Meet your care team</p><h2>Clinicians in {department.shortName}.</h2><p className="section-heading__copy">Profiles and qualifications shown are illustrative until verified by Gilead Medical Centre.</p></div><Link className="text-link" href="/doctors">All doctors<ArrowRight size={16} /></Link></div><div className="doctor-grid">{departmentDoctors.map((doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />)}</div></div></section>}
      <section className="section"><div className="site-container department-book-cta"><div><p className="eyebrow">A clear next step</p><h2>Book an appointment in {department.shortName}.</h2><p>Our booking team will contact you to confirm the request and answer questions about your visit.</p></div><ButtonLink href={`/book?department=${department.slug}`}>Book an appointment</ButtonLink></div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </>
  );
}
