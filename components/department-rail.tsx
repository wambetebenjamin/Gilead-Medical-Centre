"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, DepartmentIcon } from "@/components/icons";
import { departments } from "@/lib/data";

function DepartmentSkeleton() {
  return <div className="department-skeleton" aria-hidden="true"><span className="skeleton department-skeleton__icon" /><span className="skeleton department-skeleton__title" /><span className="skeleton department-skeleton__line" /><span className="skeleton department-skeleton__line department-skeleton__line--short" /><span className="skeleton department-skeleton__link" /></div>;
}

export function DepartmentRail() {
  const [loaded, setLoaded] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timeout = window.setTimeout(() => setLoaded(true), 360);
    return () => window.clearTimeout(timeout);
  }, []);

  function move(direction: -1 | 1) {
    railRef.current?.scrollBy({ left: direction * 360, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  }

  return (
    <div className="department-rail-wrap">
      <div className="department-rail-controls"><span className="department-rail-count">{departments.length} departments</span><div><button type="button" aria-label="Scroll departments left" onClick={() => move(-1)}><ChevronLeft size={18} /></button><button type="button" aria-label="Scroll departments right" onClick={() => move(1)}><ChevronRight size={18} /></button></div></div>
      <div className="department-rail" role="list" aria-label={`Departments, ${departments.length} items`} aria-busy={!loaded} tabIndex={0} ref={railRef} onKeyDown={onKeyDown}>
        {!loaded ? Array.from({ length: departments.length }, (_, index) => <DepartmentSkeleton key={index} />) : departments.map((department, index) => (
          <article className="department-card" role="listitem" key={department.slug}>
            <div className="department-card__top"><span className="department-card__index">{String(index + 1).padStart(2, "0")}</span><span className="department-card__icon"><DepartmentIcon name={department.icon} size={23} /></span></div>
            <h3>{department.name}</h3>
            <p className="department-card__head">Head of department · {department.head}</p>
            <p className="department-card__description">{department.description}</p>
            <Link className="department-card__link" href={`/departments/${department.slug}`}>View department<ArrowRight size={15} /></Link>
          </article>
        ))}
      </div>
    </div>
  );
}
