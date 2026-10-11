"use client";

import { useState } from "react";
import { Clock3, Mail, MapPin, Phone } from "@/components/icons";
import { branches } from "@/lib/data";
import { MapFrame } from "@/components/map-frame";

type BranchId = keyof typeof branches;

export function BranchContact() {
  const [active, setActive] = useState<BranchId>("nairobi");
  const branch = branches[active];
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(branch.mapQuery)}&output=embed`;
  return (
    <div className="branch-contact">
      <div className="branch-tabs" role="group" aria-label="Choose a hospital branch">{(Object.keys(branches) as BranchId[]).map((id) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}>{branches[id].name}</button>)}</div>
      <div className="contact-layout branch-contact__content">
        <div className="branch-details"><p className="eyebrow">Visit us</p><h2>{branch.name} branch</h2><p>Gilead Medical Centre · {branch.name}</p><div className="branch-details__list"><div className="branch-details__item"><MapPin size={18} /><div><strong>Address</strong><span>{branch.address} · exact street address to be confirmed</span></div></div><div className="branch-details__item"><Phone size={18} /><div><strong>Phone & WhatsApp</strong><a href="tel:+254112272061">{branch.phone}</a></div></div><div className="branch-details__item"><Mail size={18} /><div><strong>Email</strong><a href={`mailto:${branch.email}`}>{branch.email}</a></div></div><div className="branch-details__item"><Clock3 size={18} /><div><strong>Hours</strong><span>{branch.hours}</span></div></div></div><p className="branch-contact__note">Branch details shown here should be verified by Gilead Medical Centre before launch.</p></div>
        <MapFrame title={`Map showing Gilead Medical Centre ${branch.name} branch`} embedUrl={mapUrl} externalUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.mapQuery)}`} />
      </div>
    </div>
  );
}
