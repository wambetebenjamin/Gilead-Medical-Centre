import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { doctors } from "@/lib/data";
import { ArrowLeft, Check, Clock3, Languages, ShieldCheck, Video } from "@/components/icons";
import { ButtonLink } from "@/components/ui";
import { DoctorAvailability } from "@/components/doctor-availability";

export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() { return doctors.map((doctor) => ({ slug: doctor.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctors.find((item) => item.slug === slug);
  if (!doctor) return { title: "Doctor not found" };
  return {
    title: doctor.name,
    description: `${doctor.title} in ${doctor.department} at Gilead Medical Centre, Nairobi and Mombasa. Request an appointment.`,
    openGraph: { title: `${doctor.name} | Gilead Medical Centre`, description: doctor.bio, images: [doctor.image] },
  };
}

export default async function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = doctors.find((item) => item.slug === slug);
  if (!doctor) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    description: doctor.bio,
    image: doctor.image,
    medicalSpecialty: doctor.specialty,
    qualifications: doctor.qualifications.join(", "),
    availableLanguage: doctor.languages,
    worksFor: { "@type": "Hospital", name: "Gilead Medical Centre" },
  };
  return (
    <>
      <section className="page-hero page-hero--compact"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/doctors">Doctors</Link><span>/</span><span>{doctor.name}</span></div><Link className="text-link" href="/doctors"><ArrowLeft size={15} />Back to doctors</Link></div></section>
      <section className="section"><div className="site-container doctor-profile"><div><div className="doctor-profile__photo"><img src={doctor.image} alt={`Illustrative profile portrait for ${doctor.name}`} /><span className="doctor-card__availability"><span />{doctor.availability}</span></div><p className="doctor-profile__notice">Illustrative profile image and credentials · confirm the clinician roster with Gilead Medical Centre.</p></div><div className="doctor-profile__copy"><p className="eyebrow"><span className="eyebrow__rule" />{doctor.department}</p><h1>{doctor.name}</h1><p className="doctor-profile__title">{doctor.title}</p><p className="doctor-profile__summary">{doctor.bio}</p><div className="doctor-detail-grid"><div className="doctor-detail"><span>Qualifications</span><strong>{doctor.qualifications.join(" · ")}</strong></div><div className="doctor-detail"><span>Specialisation</span><strong>{doctor.specialty}</strong></div><div className="doctor-detail"><span>Languages</span><strong>{doctor.languages.join(" · ")}</strong></div><div className="doctor-detail"><span>Consultation fee</span><strong>KES {doctor.consultationFee.toLocaleString("en-KE")} · indicative</strong></div></div><div className="doctor-availability-details"><p><Check size={16} />In-person appointments at Nairobi and Mombasa (confirm branch availability)</p><p><Video size={16} />{doctor.telemedicine ? "Telemedicine consultations may be available" : "Telemedicine not currently listed"}</p><p><Clock3 size={16} />Availability is subject to confirmation by the booking team.</p><p><Languages size={16} />Languages: {doctor.languages.join(", ")}</p></div><div className="button-row" style={{ marginTop: 22 }}><ButtonLink href={`/book?doctor=${doctor.slug}&department=${doctor.departmentSlug}`}>Book an appointment</ButtonLink><ButtonLink href={`/departments/${doctor.departmentSlug}`} variant="secondary">View department</ButtonLink></div></div></div></section>
      <section className="section section--wash"><div className="site-container doctor-availability-layout"><div><p className="eyebrow">Plan your visit</p><h2>Find a time that works.</h2><p className="section-intro">Choose an available time to continue to the secure appointment request form. Your booking is confirmed by the care team.</p><p className="availability-privacy"><ShieldCheck size={16} />Your personal details are only requested in the booking flow.</p></div><DoctorAvailability doctor={doctor.slug} department={doctor.departmentSlug} /></div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    </>
  );
}
