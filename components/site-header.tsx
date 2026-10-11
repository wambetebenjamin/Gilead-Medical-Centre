"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Cross, Menu, X } from "@/components/icons";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Departments", href: "/departments" },
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Insurance", href: "/insurance" },
  { label: "Contact", href: "/contact" },
];

export function GileadMark({ light = false }: { light?: boolean }) {
  return (
    <span className={`gilead-mark${light ? " gilead-mark--light" : ""}`} aria-hidden="true">
      <span className="gilead-mark__crest"><Cross size={18} strokeWidth={2.5} /></span>
      <span className="gilead-mark__spark" />
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.body.classList.add("menu-is-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-is-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <div className="emergency-bar">
        <div className="site-container emergency-bar__inner">
          <div className="emergency-bar__message"><span className="emergency-bar__pulse" aria-hidden="true" />
            <strong>Emergency</strong><a href="tel:+254112272061">+254 112 272 061</a><span className="emergency-bar__divider">·</span><span>Open 24 hours</span>
          </div>
          <a className="emergency-bar__ambulance" href="tel:+254112272061"><span>Ambulance</span><strong>+254 112 272 061</strong></a>
        </div>
      </div>
      <header className={`site-header${scrolled ? " site-header--scrolled" : ""}`}>
        <div className="site-container site-header__inner">
          <Link href="/" className="brand" aria-label="Gilead Medical Centre homepage">
            <GileadMark />
            <span className="brand__text"><strong>Gilead</strong><span>Medical Centre</span></span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={pathname === item.href ? "is-active" : ""}>{item.label}</Link>
            ))}
          </nav>
          <div className="site-header__actions">
            <Link href="/portal/login" className="portal-link">Patient portal</Link>
            <Link href="/book" className="button button--primary button--small">Book appointment<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={23} />}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu" id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Site navigation">
            <div className="mobile-menu__top">
              <Link href="/" className="brand" onClick={() => setMenuOpen(false)}><GileadMark /><span className="brand__text"><strong>Gilead</strong><span>Medical Centre</span></span></Link>
              <button className="icon-button" type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)}><X size={22} /></button>
            </div>
            <nav aria-label="Mobile navigation">
              {navigation.map((item, index) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} aria-current={pathname === item.href ? "page" : undefined}>
                  <span className="mobile-menu__index">0{index + 1}</span>{item.label}<ArrowRight size={18} aria-hidden="true" />
                </Link>
              ))}
            </nav>
            <div className="mobile-menu__actions">
              <Link className="button button--primary" href="/book" onClick={() => setMenuOpen(false)}>Book an appointment<ArrowRight size={16} /></Link>
              <Link className="button button--secondary" href="/portal/login" onClick={() => setMenuOpen(false)}>Patient portal</Link>
            </div>
            <a className="mobile-menu__emergency" href="tel:+254112272061">Emergency line · +254 112 272 061</a>
          </div>
        )}
      </header>
    </>
  );
}
