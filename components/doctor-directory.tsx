"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "@/components/icons";
import { doctors } from "@/lib/data";
import { DoctorCard } from "@/components/doctor-card";

function DoctorSkeleton() {
  return <div className="doctor-skeleton" aria-hidden="true"><span className="skeleton doctor-skeleton__image" /><span className="skeleton doctor-skeleton__line doctor-skeleton__line--short" /><span className="skeleton doctor-skeleton__line" /><span className="skeleton doctor-skeleton__line doctor-skeleton__line--small" /><span className="skeleton doctor-skeleton__button" /></div>;
}

export function DoctorDirectory() {
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [language, setLanguage] = useState("all");
  const [gender, setGender] = useState("all");
  useEffect(() => {
    const timeout = window.setTimeout(() => setLoaded(true), 420);
    return () => window.clearTimeout(timeout);
  }, []);

  const filtered = useMemo(() => doctors.filter((doctor) => {
    const matchQuery = `${doctor.name} ${doctor.title} ${doctor.specialty}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchQuery && (department === "all" || doctor.departmentSlug === department) && (availability === "all" || doctor.availability === availability) && (language === "all" || doctor.languages.includes(language)) && (gender === "all" || doctor.gender === gender);
  }), [query, department, availability, language, gender]);

  return (
    <div className="doctor-directory">
      <div className="doctor-filters" aria-label="Filter doctors">
        <label className="doctor-search"><Search size={18} aria-hidden="true" /><span className="visually-hidden">Search by doctor name or speciality</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or speciality" /></label>
        <label><span className="visually-hidden">Department</span><select value={department} onChange={(event) => setDepartment(event.target.value)}><option value="all">All departments</option>{Array.from(new Map(doctors.map((doctor) => [doctor.departmentSlug, doctor.department])).entries()).map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}</select></label>
        <label><span className="visually-hidden">Availability</span><select value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="all">Any availability</option><option>Today</option><option>This week</option><option>Limited</option></select></label>
        <label><span className="visually-hidden">Language</span><select value={language} onChange={(event) => setLanguage(event.target.value)}><option value="all">Any language</option><option>English</option><option>Kiswahili</option><option>Luo</option></select></label>
        <label><span className="visually-hidden">Gender preference</span><select value={gender} onChange={(event) => setGender(event.target.value)}><option value="all">Any gender</option><option>Female</option><option>Male</option></select></label>
      </div>
      <div className="doctor-directory__count"><span><SlidersHorizontal size={15} aria-hidden="true" />{loaded ? `${filtered.length} clinicians` : "Loading clinicians"}</span><span className="doctor-directory__notice">Illustrative directory · confirm credentials and availability with the centre</span></div>
      <div className="doctor-grid" aria-busy={!loaded} aria-label="Doctor profiles">
        {!loaded ? Array.from({ length: 6 }, (_, index) => <DoctorSkeleton key={index} />) : filtered.length ? filtered.map((doctor) => <DoctorCard doctor={doctor} key={doctor.slug} />) : <div className="empty-state"><Search size={22} /><h3>No matching clinicians</h3><p>Try changing a filter or search term.</p></div>}
      </div>
    </div>
  );
}
