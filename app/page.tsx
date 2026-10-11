import Link from "next/link";
import { Hero } from "@/components/hero";
import { DepartmentRail } from "@/components/department-rail";
import { DoctorCard } from "@/components/doctor-card";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { Activity, Ambulance, ArrowRight, CalendarDays, Check, Clock3, FlaskConical, HeartPulse, Hospital, Pill, Search, Video } from "@/components/icons";
import { doctors, healthPackages, insuranceProviders } from "@/lib/data";
import { getNewsArticles } from "@/lib/news";

export const revalidate = 3600;

export default async function HomePage() {
  const articles = (await getNewsArticles()).slice(0, 3);
  return (
    <>
      <Hero />
      <section className="quick-access" aria-label="Quick access">
        <div className="site-container quick-access__grid">
          <a className="quick-tile" href="tel:+254112272061"><span className="quick-tile__icon"><Ambulance size={22} /></span><span><strong>Emergency</strong><small>Call our 24-hour line</small></span></a>
          <Link className="quick-tile" href="/book"><span className="quick-tile__icon"><CalendarDays size={22} /></span><span><strong>Book appointment</strong><small>Choose a time that works</small></span></Link>
          <Link className="quick-tile" href="/doctors"><span className="quick-tile__icon"><Search size={22} /></span><span><strong>Find a doctor</strong><small>Meet our care team</small></span></Link>
          <Link className="quick-tile" href="/departments"><span className="quick-tile__icon"><Hospital size={22} /></span><span><strong>Our departments</strong><small>Explore our services</small></span></Link>
        </div>
      </section>

      <section className="section" id="departments">
        <div className="site-container">
          <SectionHeading eyebrow="Care, all in one place" title="Specialist support for every stage of life." description="From urgent care to everyday check-ups, find the right team and the next step for your health." link={{ href: "/departments", label: "Explore all departments" }} />
          <DepartmentRail />
        </div>
      </section>

      <section className="section section--wash">
        <div className="site-container split-section">
          <div className="split-section__visual"><img src="/images/uganda-ward-care.jpg" alt="A nurse caring for a child with a family member in a hospital ward" loading="lazy" /><div className="split-section__badge"><HeartPulse size={20} /><span><strong>Care with a human touch</strong><small>For you and your family</small></span></div></div>
          <div className="split-section__copy"><p className="eyebrow"><span className="eyebrow__rule" />Kenyan heart, world-class care</p><h2>Care should feel personal.</h2><p>At Gilead Medical Centre, every visit begins with listening. Our teams work across outpatient and inpatient care, diagnostics, pharmacy, maternity and surgery to support the whole person.</p><ul className="check-list"><li><Check size={17} />Care across Nairobi and Mombasa</li><li><Check size={17} />Support from first appointment through follow-up</li><li><Check size={17} />Clear next steps for patients and families</li></ul><ButtonLink href="/about" variant="secondary">Get to know Gilead</ButtonLink><div className="stat-strip"><div><strong>24/7</strong><span>Emergency support</span></div><div><strong>2</strong><span>Kenyan locations</span></div><div><strong>12</strong><span>Care departments</span></div></div></div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <SectionHeading eyebrow="People who care" title="Find a clinician who understands you." description="Explore our illustrative clinician directory and request an appointment. Confirm provider credentials and current availability with the booking team." link={{ href: "/doctors", label: "Meet our doctors" }} />
          <div className="doctor-grid home-doctor-grid">{doctors.slice(0, 3).map((doctor) => <DoctorCard key={doctor.slug} doctor={doctor} />)}</div>
        </div>
      </section>

      <section className="section section--wash">
        <div className="site-container">
          <SectionHeading eyebrow="More ways to care" title="Services that meet you where you are." description="Explore care options designed around your needs, your family and your time." link={{ href: "/services", label: "View all services" }} />
          <div className="service-grid">
            <article className="service-card"><span className="service-card__icon"><Video size={22} /></span><h3>Telemedicine</h3><p>See a doctor from anywhere in Kenya, with a clear plan for your next step.</p><Link href="/telemedicine">Explore telemedicine<ArrowRight size={15} /></Link></article>
            <article className="service-card"><span className="service-card__icon"><FlaskConical size={22} /></span><h3>Diagnostics</h3><p>Coordinate laboratory testing and imaging with your clinical care team.</p><Link href="/departments/laboratory">Explore diagnostics<ArrowRight size={15} /></Link></article>
            <article className="service-card"><span className="service-card__icon"><Pill size={22} /></span><h3>Pharmacy</h3><p>Get medicine guidance and make refill requests with our pharmacy team.</p><Link href="/departments/pharmacy">Explore pharmacy<ArrowRight size={15} /></Link></article>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="site-container insurance-band">
          <div><p className="eyebrow">Making care easier</p><h2>Insurance support, made simpler.</h2><p>See accepted providers and start a pre-authorisation request with our team.</p><div style={{ marginTop: 20 }}><ButtonLink href="/insurance">Insurance & pre-authorisation</ButtonLink></div></div>
          <div className="insurance-logos" aria-label="Accepted insurance providers">{insuranceProviders.map((provider) => <span className="insurance-logo" key={provider}>{provider}</span>)}</div>
        </div>
      </section>

      <section className="section section--wash">
        <div className="site-container">
          <SectionHeading eyebrow="Prevention matters" title="A health check that starts with you." description="Choose a starting point for a conversation with our care team. Package pricing below is indicative and should be confirmed before booking." link={{ href: "/health-packages", label: "Compare all packages" }} />
          <div className="package-grid">{healthPackages.map((item, index) => <article key={item.slug} className={`package-card${index === 1 ? " package-card--featured" : ""}`}>{index === 1 && <span className="package-card__label">Popular</span>}<h3>{item.name}</h3><p className="package-card__price"><span>KES</span><strong>{item.price.toLocaleString("en-KE")}</strong></p><small className="package-card__note">{item.note}</small><ul>{item.includes.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul><ButtonLink href={`/book?package=${item.slug}`} variant={index === 1 ? "primary" : "secondary"}>Book this package</ButtonLink></article>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="site-container">
          <SectionHeading eyebrow="From Gilead" title="Health notes and centre news." description="Practical information and updates for patients and families." link={{ href: "/news", label: "All news & updates" }} />
          <div className="news-grid">{articles.map((article) => <article className="news-card" key={article.slug}><div className="news-card__meta"><span className="news-card__category">{article.category}</span><span>·</span><time dateTime={article.date}>{new Date(`${article.date}T12:00:00Z`).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</time></div><h3>{article.title}</h3><p>{article.excerpt}</p><Link href={`/news/${article.slug}`}>Read article<ArrowRight size={15} /></Link></article>)}</div>
        </div>
      </section>

      <section className="section section--wash section--tight">
        <div className="site-container split-section split-section--reverse">
          <div className="split-section__visual split-section__visual--portrait"><img src="/images/doctor-wanjiku.jpg" alt="Illustrative portrait of a Black woman clinician" loading="lazy" /><div className="split-section__badge"><Clock3 size={19} /><span><strong>Care on your schedule</strong><small>In-person or online</small></span></div></div>
          <div className="split-section__copy"><p className="eyebrow"><span className="eyebrow__rule" />Your next step, made simple</p><h2>Not sure where to start?</h2><p>Tell us what you need and our booking team can help you find the right department, clinician or service.</p><div className="button-row"><ButtonLink href="/book">Book an appointment</ButtonLink><ButtonLink href="/feedback" variant="secondary">Share your feedback</ButtonLink></div><p className="meta-text" style={{ marginTop: 18, color: "#7c899a" }}>Illustrative imagery and profiles are placeholders pending approval of Gilead’s verified media and clinical roster.</p></div>
        </div>
      </section>

      <section className="emergency-cta"><div className="site-container emergency-cta__inner"><div><p>Urgent medical assistance · Open 24 hours</p><h2>When every moment matters, we’re here.</h2></div><a className="emergency-cta__button" href="tel:+254112272061"><HeartPulse size={18} />Call +254 112 272 061</a></div></section>
    </>
  );
}
