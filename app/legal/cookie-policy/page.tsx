import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = { title: "Cookie Policy", description: "How Gilead Medical Centre uses necessary, functional, analytics and security storage." };

export default function CookiePolicyPage() {
  return (
    <LegalLayout title="Cookie Policy">
      <p>This policy explains the browser storage and third-party technologies used by the Gilead Medical Centre website. We use optional cookies only with your choice where required. Health information is not shared for marketing without your explicit consent.</p>
      <h2 id="what-are-cookies">What are cookies and local storage?</h2>
      <p>Cookies are small files stored by a website or its service providers. Local storage is browser storage that remains on your device until it is cleared. Both can support essential site functions, remember choices or help protect forms.</p>
      <h2 id="necessary">Necessary storage — always on</h2>
      <ul>
        <li><strong>Cookie preference:</strong> the <code>gilead-cookie-consent</code> local-storage entry remembers whether you accepted or customised cookie preferences, so the banner does not reappear on every visit.</li>
        <li><strong>Patient portal session:</strong> after sign-in, a secure, HTTP-only session cookie is used to keep the patient portal authenticated. It is removed when the session expires or you sign out.</li>
        <li><strong>Security checks:</strong> Google reCAPTCHA may use cookies or similar signals when you submit a protected form to help detect automated abuse.</li>
      </ul>
      <h2 id="functional">Functional cookies</h2>
      <p>Functional storage may remember preferences such as a selected branch or form state. The current website may not use every functional feature. If you disable this category, essential parts of the site and the patient portal may still operate, but optional preferences may not be remembered.</p>
      <h2 id="analytics">Analytics cookies</h2>
      <p>Analytics technologies, if enabled in a future release, would measure aggregated use of the website to help improve patient services. The current application build does not activate an analytics tracking product. If analytics is added, it should only run when you have enabled Analytics in Cookie Preferences.</p>
      <h2 id="third-parties">Third-party services</h2>
      <p>The site requests the Open Sans stylesheet from Google Fonts and font files from Google servers when a page loads. This font request happens even when Functional cookies are turned off; the current consent controls do not block it, and the site does not intentionally use Google Fonts to set an advertising or analytics cookie. Google may receive your IP address, browser and device information, and other request metadata; see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s Privacy Policy</a>. We retain this remote font service to match the supplied design; a self-hosted font deployment would avoid that connection.</p>
      <p>Google reCAPTCHA is loaded only when you submit a protected appointment, insurance, contact, newsletter, feedback or patient portal sign-in form. The interactive Google Map on the Contact page remains off until you enable Functional cookies or select “Load interactive map.” These providers may receive technical information such as your IP address, device and browser details when their content loads. Their processing is subject to their own privacy notices and terms. You can use the external directions link without loading the embedded map.</p>
      <h2 id="manage">How to change your preferences</h2>
      <p>Choose <strong>Manage preferences</strong> on the cookie banner to switch Functional and Analytics preferences on or off. Necessary storage remains locked because it is required for security and basic website functions. You may also clear browser storage or cookies in your browser settings; the banner will appear again when the saved choice is removed.</p>
      <p>You can revisit Cookie Preferences at any time using <strong>Cookie settings</strong> in the website footer. To reset your choice after saving it, clear the <code>gilead-cookie-consent</code> item from your browser’s local storage for this site.</p>
      <h2 id="health-data">Health data and marketing</h2>
      <p>Cookie choices are separate from your clinical record. Gilead Medical Centre does not share patient health data for marketing without your explicit consent. Necessary security technologies do not authorise the use of your medical information for advertising.</p>
      <h2 id="contact">Contact</h2>
      <p>For privacy questions, contact the Data Protection Officer through our <Link href="/contact">contact page</Link> or call <a href="tel:+254112272061">+254 112 272 061</a>. See also our <Link href="/legal/privacy-policy">Privacy Policy</Link>.</p>
    </LegalLayout>
  );
}
