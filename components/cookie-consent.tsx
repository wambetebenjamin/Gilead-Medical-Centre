"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, SlidersHorizontal, X } from "@/components/icons";

type Consent = { necessary: true; functional: boolean; analytics: boolean; savedAt: string };
const STORAGE_KEY = "gilead-cookie-consent";
const SETTINGS_EVENT = "gilead:open-cookie-settings";

export function CookieSettingsButton() {
  return <button className="footer-cookie-settings" type="button" onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}>Cookie settings</button>;
}

function saveConsent(consent: Omit<Consent, "savedAt">) {
  const value: Consent = { ...consent, savedAt: new Date().toISOString() };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* storage can be disabled by browser policy */ }
  window.dispatchEvent(new Event("gilead:cookie-consent-updated"));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
      else {
        const consent = JSON.parse(stored) as Consent;
        setFunctional(Boolean(consent.functional));
        setAnalytics(Boolean(consent.analytics));
      }
    } catch {
      setVisible(true);
    }
    const openSettings = () => { setVisible(true); setManageOpen(true); };
    window.addEventListener(SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (!manageOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.classList.add("dialog-is-open");
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setManageOpen(false);
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button, input, a[href]')].filter((item) => !item.hasAttribute("disabled"));
        if (!focusable.length) return;
        if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
        else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("dialog-is-open");
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [manageOpen]);

  if (!visible) return null;
  const acceptAll = () => {
    saveConsent({ necessary: true, functional: true, analytics: true });
    setFunctional(true);
    setAnalytics(true);
    setManageOpen(false);
    setVisible(false);
  };
  const savePreferences = () => {
    saveConsent({ necessary: true, functional, analytics });
    setManageOpen(false);
    setVisible(false);
  };

  return (
    <>
      <aside className="cookie-banner" aria-label="Cookie consent">
        <div className="cookie-banner__copy">
          <span className="cookie-banner__icon"><SlidersHorizontal size={18} aria-hidden="true" /></span>
          <div>
            <strong>Your privacy matters</strong>
            <p>Gilead Medical Centre uses cookies to personalise your experience and improve our patient services. <Link href="/legal/cookie-policy">See our Cookie Policy.</Link> Health data is not shared for marketing without explicit consent.</p>
          </div>
        </div>
        <div className="cookie-banner__actions">
          <button type="button" className="button button--text" onClick={() => setManageOpen(true)}>Manage preferences</button>
          <button type="button" className="button button--primary button--small" onClick={acceptAll}><Check size={15} aria-hidden="true" />Accept all</button>
        </div>
      </aside>
      {manageOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setManageOpen(false); }}>
          <div className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" ref={dialogRef}>
            <div className="cookie-modal__head">
              <div><p className="eyebrow">Your choices</p><h2 id="cookie-modal-title">Cookie preferences</h2></div>
              <button className="icon-button" type="button" aria-label="Close cookie preferences" onClick={() => setManageOpen(false)}><X size={20} /></button>
            </div>
            <p className="cookie-modal__intro">Choose which optional cookies we can use. Necessary cookies keep this site working and cannot be switched off.</p>
            <div className="cookie-choice cookie-choice--locked">
              <div><strong>Necessary</strong><p>Security, accessibility and essential site functions.</p></div>
              <span className="locked-pill"><Check size={13} />Always on</span>
            </div>
            <label className="cookie-choice">
              <span><strong>Functional</strong><p>Remembering preferences such as your selected branch.</p></span>
              <input type="checkbox" checked={functional} onChange={(event) => setFunctional(event.target.checked)} aria-label="Allow functional cookies" />
            </label>
            <label className="cookie-choice">
              <span><strong>Analytics</strong><p>Aggregated usage information to improve our services.</p></span>
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} aria-label="Allow analytics cookies" />
            </label>
            <p className="cookie-modal__privacy">We do not share health information for marketing without your explicit consent. Read our <Link href="/legal/privacy-policy">Privacy Policy</Link>.</p>
            <div className="cookie-modal__actions">
              <button type="button" className="button button--secondary" onClick={savePreferences}>Save my choices</button>
              <button type="button" className="button button--primary" onClick={acceptAll}>Accept all cookies</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
