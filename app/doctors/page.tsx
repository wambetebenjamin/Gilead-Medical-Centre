import type { Metadata } from "next";
import Link from "next/link";
import { DoctorDirectory } from "@/components/doctor-directory";

export const metadata: Metadata = {
  title: "Find a Doctor",
  description: "Search clinicians by name, department, availability, language and gender preference at Gilead Medical Centre.",
};
export const revalidate = 3600;

export default function DoctorsPage() {
  return (
    <>
      <section className="page-hero"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Doctors</span></div><p className="eyebrow">Meet your care team</p><h1>Find the right doctor for you.</h1><p>Search by name, speciality, availability, language or gender preference. Our booking team can help if you are not sure who to see.</p></div></section>
      <section className="section"><div className="site-container"><DoctorDirectory /></div></section>
    </>
  );
}
