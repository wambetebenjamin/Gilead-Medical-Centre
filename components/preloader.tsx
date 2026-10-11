"use client";

import { useEffect, useState } from "react";
import { GileadMark } from "@/components/site-header";

export function Preloader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 1650);
    return () => window.clearTimeout(timeout);
  }, []);
  if (!visible) return null;
  return (
    <div className="preloader" role="status" aria-live="polite" aria-label="Loading Gilead Medical Centre">
      <div className="preloader__content">
        <svg className="preloader__ecg" viewBox="0 0 440 72" aria-hidden="true">
          <path className="preloader__track" d="M8 38h95l16-1 13-17 15 34 18-47 21 59 20-30 13 2h54" />
          <path className="preloader__line" d="M8 38h95l16-1 13-17 15 34 18-47 21 59 20-30 13 2h54" />
          <path className="preloader__tail" d="M285 38h64" />
        </svg>
        <div className="preloader__wordmark"><GileadMark /><span><strong>Gilead</strong><small>Medical Centre</small></span></div>
        <span className="preloader__percent">100%</span>
      </div>
      <button className="preloader__skip" type="button" onClick={() => setVisible(false)}>Skip loading</button>
    </div>
  );
}
