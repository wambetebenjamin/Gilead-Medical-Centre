"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "@/components/icons";

type Slot = { id: string; time: string; available: boolean };
export function DoctorAvailability({ doctor, department }: { doctor: string; department: string }) {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { setDate(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)); }, []);
  useEffect(() => {
    if (!date) return;
    let active = true;
    setLoading(true); setError(""); setSelected("");
    const params = new URLSearchParams({ date, department, doctor });
    fetch(`/api/availability?${params}`, { cache: "no-store" })
      .then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error ?? "Availability is unavailable."); return body as { slots: Slot[] }; })
      .then((body) => { if (active) setSlots(body.slots ?? []); })
      .catch((caught) => { if (active) setError(caught instanceof Error ? caught.message : "Availability is unavailable."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [date, doctor, department]);
  const bookingHref = `/book?${new URLSearchParams({ doctor, department, date, time: selected }).toString()}`;
  return (
    <div className="availability-card">
      <div className="availability-card__heading"><span className="availability-card__icon"><CalendarDays size={20} /></span><span><strong>Available appointment slots</strong><small>Times shown in East Africa Time (EAT)</small></span></div>
      <label className="availability-date">Choose a date<input type="date" min={new Date().toISOString().slice(0, 10)} value={date} onChange={(event) => setDate(event.target.value)} /></label>
      <div className="slot-section__head"><span><Clock3 size={16} />Available times</span></div>
      {loading ? <div className="slot-grid" aria-busy="true" aria-label="Loading available times">{Array.from({ length: 6 }, (_, index) => <span className="skeleton skeleton--slot" key={index} />)}</div> : error ? <p className="inline-error" role="status">{error}</p> : slots.length ? <div className="slot-grid" aria-label="Available appointment times">{slots.slice(0, 8).map((slot) => <button key={slot.id} className={`slot-button${selected === slot.time ? " is-selected" : ""}`} type="button" aria-pressed={selected === slot.time} onClick={() => setSelected(slot.time)}>{slot.time}</button>)}</div> : <p className="empty-note">No slots are available on this date. Try another day or request the next available time.</p>}
      <Link className={`button button--primary availability-card__book${!selected ? " is-disabled" : ""}`} aria-disabled={!selected} href={selected ? bookingHref : "#available-slots"} onClick={(event) => { if (!selected) event.preventDefault(); }}>Book this time<ArrowRight size={16} /></Link>
    </div>
  );
}
