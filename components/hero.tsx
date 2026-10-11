"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, HeartPulse, ShieldCheck, Stethoscope } from "@/components/icons";

function AmbientHeartbeat() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const update = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return <svg className="hero-ambient" data-paused={paused} viewBox="0 0 1000 280" preserveAspectRatio="none" aria-hidden="true"><path d="M0 140h280l38-1 24-24 24 48 32-91 35 138 32-70 23 0h205l38-2 25-23 23 47 36-92 31 136 31-68 35 2h130" /></svg>;
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true" />
      <AmbientHeartbeat />
      <div className="site-container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow"><span className="eyebrow__rule" />Your care, our calling</p>
          <h1 id="hero-title" className="hero__title"><span>Your Health.</span><span>Our Highest</span><span className="hero__title-accent">Calling.</span></h1>
          <p className="hero__lead">Gilead Medical Centre. Nairobi and Mombasa.<br className="desktop-break" /> World-class care. Kenyan heart.</p>
          <div className="hero__actions">
            <Link className="button button--primary button--large" href="/book">Book an appointment<ArrowRight size={17} /></Link>
            <Link className="hero__secondary-link" href="/doctors">Find a doctor<ArrowRight size={16} /></Link>
          </div>
          <div className="hero__trust" aria-label="Hospital accreditations and services">
            <span><BadgeCheck size={17} />NHIF Accredited</span><span><ShieldCheck size={17} />ISO Certified</span><span><HeartPulse size={17} />24-hour emergency</span>
          </div>
        </div>
        <div className="hero__visual" aria-label="Patient-centred care">
          <div className="hero__photo-frame"><img src="/images/uganda-child-care.jpg" alt="A nurse attending to a young patient while a family member looks on in a hospital ward" fetchPriority="high" /></div>
          <div className="hero__photo-veil" aria-hidden="true" />
          <div className="hero__image-caption"><span className="hero__caption-icon"><Stethoscope size={18} /></span><span><strong>Here for every chapter</strong><small>Care for you and your family</small></span></div>
          <div className="hero__image-stamp"><span className="hero__stamp-line" /><span>NAIROBI<br />& MOMBASA</span></div>
        </div>
      </div>
      <div className="hero__bottom site-container"><span>Patient-first care, at every step.</span><span>Scroll to explore <span className="hero__scroll-line" /></span></div>
    </section>
  );
}
