"use client";

import "./globals.css";
import { ArrowRight, Phone } from "@/components/icons";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-KE"><body><main className="error-page"><div className="site-container error-page__inner"><span className="error-page__code">500 · TEMPORARY ERROR</span><h1>Our system is temporarily unavailable.</h1><p>For urgent medical matters please call our emergency line. You can try loading this page again.</p><a className="error-page__emergency" href="tel:+254112272061"><Phone size={19} />+254 112 272 061</a><div className="button-row"><button type="button" className="button button--primary" onClick={() => reset()}>Try Again<ArrowRight size={16} /></button></div></div></main></body></html>
  );
}
