import Link from "next/link";
import type { ReactNode } from "react";

const legalLinks = [
  { href: "/legal/privacy-policy", label: "Privacy policy" },
  { href: "/legal/terms", label: "Terms of use" },
  { href: "/legal/cookie-policy", label: "Cookie policy" },
];

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <section className="page-hero page-hero--compact"><div className="site-container"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Legal</span><span>/</span><span>{title}</span></div><p className="eyebrow">Your rights and our responsibilities</p><h1>{title}</h1><p>Clear information about how we support patients and protect their information.</p></div></section>
      <section className="section"><div className="site-container legal-layout"><nav className="legal-nav" aria-label="Legal pages">{legalLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><article className="legal-content"><p className="legal-updated">Last reviewed: 11 October 2026 · Draft for Gilead Medical Centre review</p>{children}<p className="legal-review-note">This website content is a starting point for review and does not replace legal advice. Gilead Medical Centre should confirm its registered controller details, retention periods, processor contracts and Data Protection Officer contact before publication.</p></article></div></section>
    </>
  );
}
