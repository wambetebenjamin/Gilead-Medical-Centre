import Link from "next/link";
import { Activity, ArrowUpRight, HeartPulse, Phone } from "@/components/icons";
import { departments } from "@/lib/data";
import { GileadMark } from "@/components/site-header";
import { NewsletterForm } from "@/components/forms";
import { CookieSettingsButton } from "@/components/cookie-consent";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <section className="footer-callout">
        <div className="site-container footer-callout__inner">
          <div className="footer-callout__mark"><HeartPulse size={24} aria-hidden="true" /></div>
          <div>
            <p className="eyebrow eyebrow--light">Here when you need us</p>
            <h2>Care that’s close, day and night.</h2>
          </div>
          <a className="button button--light" href="tel:+254112272061"><Phone size={16} aria-hidden="true" /> Emergency line · +254 112 272 061</a>
        </div>
      </section>
      <div className="site-container site-footer__main">
        <div className="site-footer__intro">
          <Link href="/" className="brand brand--footer"><GileadMark light /><span className="brand__text"><strong>Gilead</strong><span>Medical Centre</span></span></Link>
          <p>World-class care. Kenyan heart. Supporting patients and families in Nairobi and Mombasa.</p>
          <a href="https://wa.me/254112272061?text=Hello!%20I%20would%20like%20to%20book%20an%20appointment%20at%20Gilead%20Medical%20Centre." target="_blank" rel="noreferrer" className="footer-whatsapp">Message us on WhatsApp<ArrowUpRight size={15} /></a>
        </div>
        <div className="site-footer__column">
          <h3>Departments</h3>
          {departments.slice(0, 6).map((department) => <Link key={department.slug} href={`/departments/${department.slug}`}>{department.shortName}</Link>)}
          <Link className="footer-all-link" href="/departments">All departments <ArrowUpRight size={14} /></Link>
        </div>
        <div className="site-footer__column">
          <h3>Patient services</h3>
          <Link href="/book">Book an appointment</Link>
          <Link href="/doctors">Find a doctor</Link>
          <Link href="/telemedicine">Telemedicine</Link>
          <Link href="/insurance">Insurance & pre-authorisation</Link>
          <Link href="/health-packages">Health packages</Link>
          <Link href="/portal/login">Patient portal</Link>
        </div>
        <div className="site-footer__column site-footer__newsletter">
          <h3>Health notes, thoughtfully shared.</h3>
          <p>Occasional health updates and centre news. Unsubscribe at any time.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="site-container site-footer__bottom">
        <p>© {new Date().getFullYear()} Gilead Medical Centre. All rights reserved.</p>
        <nav aria-label="Legal links">
          <Link href="/legal/privacy-policy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/cookie-policy">Cookies</Link>
          <CookieSettingsButton />
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="footer-socials" aria-label="Social media">
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><span>f</span></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Activity size={15} /></a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><span>in</span></a>
        </div>
      </div>
      <p className="site-footer__privacy">Your health information is treated with care. We never use patient health data for marketing without your explicit consent.</p>
    </footer>
  );
}
