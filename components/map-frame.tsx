"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin } from "@/components/icons";

const CONSENT_KEY = "gilead-cookie-consent";
const CONSENT_UPDATED_EVENT = "gilead:cookie-consent-updated";

function functionalConsent() {
  try {
    const saved = localStorage.getItem(CONSENT_KEY);
    return saved ? Boolean((JSON.parse(saved) as { functional?: unknown }).functional) : false;
  } catch {
    return false;
  }
}

export function MapFrame({ title, embedUrl, externalUrl }: { title: string; embedUrl: string; externalUrl: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const updateFromConsent = () => setEnabled(functionalConsent());
    updateFromConsent();
    window.addEventListener(CONSENT_UPDATED_EVENT, updateFromConsent);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, updateFromConsent);
  }, []);

  return (
    <div className="map-frame">
      {enabled ? (
        <iframe title={title} src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="map-frame__placeholder">
          <span className="map-frame__icon"><MapPin size={24} aria-hidden="true" /></span>
          <strong>Interactive map is off</strong>
          <p>Load Google Maps to see directions. Google may receive technical information from your browser.</p>
          <button type="button" className="button button--primary" onClick={() => setEnabled(true)}>Load interactive map</button>
          <a href={externalUrl} target="_blank" rel="noreferrer">Open in Google Maps<ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      )}
    </div>
  );
}
