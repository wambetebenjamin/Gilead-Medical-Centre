"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CalendarDays, Video } from "@/components/icons";
import type { Doctor } from "@/lib/data";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [touchOpen, setTouchOpen] = useState(false);
  return (
    <article className={`doctor-card${touchOpen ? " doctor-card--open" : ""}`}>
      <div className="doctor-card__photo"><img src={doctor.image} alt={`Illustrative profile portrait for ${doctor.name}`} loading="lazy" /><span className="doctor-card__availability"><span />{doctor.availability}</span></div>
      <div className="doctor-card__body">
        <p className="doctor-card__department">{doctor.department}</p>
        <h3><Link href={`/doctors/${doctor.slug}`}>{doctor.name}</Link></h3>
        <p className="doctor-card__title">{doctor.title}</p>
        <div className="doctor-card__meta"><span><CalendarDays size={14} />This week</span>{doctor.telemedicine && <span><Video size={14} />Online</span>}</div>
        <div className="doctor-card__reveal">
          <p>{doctor.specialty}</p>
          <span>Languages: {doctor.languages.join(" · ")}</span>
          <Link href={`/book?doctor=${doctor.slug}&department=${doctor.departmentSlug}`} className="button button--primary button--small">Book with this doctor<ArrowRight size={14} /></Link>
        </div>
      </div>
      <button className="doctor-card__tap" type="button" aria-expanded={touchOpen} onClick={() => setTouchOpen((open) => !open)} aria-label={touchOpen ? `Hide booking details for ${doctor.name}` : `Show booking details for ${doctor.name}`}><span>{touchOpen ? "Hide details" : "More details"}</span><ArrowRight size={15} /></button>
    </article>
  );
}
