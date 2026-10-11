import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Preloader } from "@/components/preloader";
import { CookieConsent } from "@/components/cookie-consent";
import { RouteAnnouncer } from "@/components/route-announcer";
import { RouteTransition } from "@/components/route-transition";
import { WhatsAppButton } from "@/components/whatsapp-button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gileadmedicalcentre.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gilead Medical Centre | Nairobi & Mombasa",
    template: "%s | Gilead Medical Centre",
  },
  description: "Patient-first outpatient and inpatient care, diagnostics, maternity, surgery and pharmacy services in Nairobi and Mombasa, Kenya.",
  applicationName: "Gilead Medical Centre",
  keywords: ["hospital Nairobi", "hospital Mombasa", "medical centre Kenya", "doctor appointment Nairobi", "telemedicine Kenya"],
  icons: { icon: "/images/gilead-mark.svg" },
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Gilead Medical Centre",
    title: "Gilead Medical Centre | Nairobi & Mombasa",
    description: "World-class care. Kenyan heart.",
  },
  twitter: { card: "summary_large_image", title: "Gilead Medical Centre", description: "World-class care. Kenyan heart." },
  robots: { index: true, follow: true },
};

const clinicSchema = [
  {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Gilead Medical Centre",
    url: siteUrl,
    telephone: "+254112272061",
    areaServed: [{ "@type": "City", name: "Nairobi" }, { "@type": "City", name: "Mombasa" }],
    address: { "@type": "PostalAddress", addressCountry: "KE", addressLocality: "Nairobi" },
    openingHours: "Mo-Su 00:00-23:59",
    medicalSpecialty: ["Emergency", "Maternity", "Paediatrics", "Cardiology", "Surgery", "Radiology", "Pharmacy"],
  },
  {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: "Gilead Medical Centre",
    url: siteUrl,
    telephone: "+254112272061",
    address: { "@type": "PostalAddress", addressCountry: "KE", addressLocality: "Nairobi" },
    availableService: ["Outpatient care", "Inpatient care", "Emergency care", "Diagnostics", "Maternity", "Surgery", "Pharmacy"],
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <link rel="stylesheet" href="/assets/vendor/nucleo/css/nucleo.css" />
        <link rel="stylesheet" href="/assets/vendor/font-awesome/css/font-awesome.min.css" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Preloader />
        <SiteHeader />
        <main id="main-content" className="main-content">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <SiteFooter />
        <WhatsAppButton />
        <CookieConsent />
        <RouteAnnouncer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
