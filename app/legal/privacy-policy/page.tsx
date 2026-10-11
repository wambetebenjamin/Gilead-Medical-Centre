import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Gilead Medical Centre handles patient health, medical record and insurance information." };

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Gilead Medical Centre respects your privacy and handles patient information with care. This policy describes how information may be collected and used when you visit our facilities, use our website or contact our teams. It is intended to reflect the Kenya Data Protection Act, 2019 and applicable regulations. It is not a statement that the hospital is certified under HIPAA; HIPAA-inspired confidentiality practices do not replace Kenyan law.</p>
      <h2 id="health-data">Patient health data</h2>
      <p>We may collect information needed to provide care or respond to a request, such as your name, date of birth, contact details, patient or passport identifier, appointment details, health information you choose to provide, insurance details and relevant documents. We ask that you share only what is necessary for the service you are requesting.</p>
      <p>We use patient information to arrange appointments, provide and coordinate care, support diagnostics and pharmacy services, process insurance requests, manage billing, meet legal obligations and keep our services safe. We do not use patient health information for marketing without your explicit consent.</p>
      <h2 id="medical-records">Medical records confidentiality</h2>
      <p>Medical records are confidential and are available only to authorised healthcare professionals and staff who need the information for your care or an authorised operational purpose. We use access controls, secure systems and appropriate organisational safeguards. No internet transmission or storage system can be guaranteed completely secure, but we take reasonable steps to protect information against unauthorised access, loss or disclosure.</p>
      <p>The patient portal is intended for your personal use. Keep your password private, sign out on shared devices and contact us if you believe your account has been accessed without permission.</p>
      <h2 id="insurance">Insurance data sharing</h2>
      <p>If you request pre-authorisation or use insurance, we may share relevant information with your insurer, medical aid provider, referral clinician or service partner to assess cover, obtain approval, coordinate treatment or process a claim. Supporting documents are shared for that purpose only. We do not send clinical information in general marketing messages.</p>
      <h2 id="analytics">Cookies and analytics</h2>
      <p>Necessary storage supports security and essential site functions. Optional functional or analytics cookies should only be used according to your recorded preferences. The current website build does not activate an analytics tracking product. Open Sans is requested from Google Fonts on page load regardless of cookie preferences, so Google may receive technical connection information such as your IP address, browser and device details. Google reCAPTCHA and Google Maps may also process technical information when those features load. See our <Link href="/legal/cookie-policy">Cookie Policy</Link> for details.</p>
      <h2 id="sharing">Sharing and service providers</h2>
      <p>We may use service providers for secure hosting, appointment communications, file storage, payment processing, CAPTCHA security and telemedicine. Providers must be given only the information needed for their service and must protect it under appropriate arrangements. Information may be processed outside Kenya where a service provider operates; applicable safeguards and transfer requirements should be reviewed before launch.</p>
      <h2 id="retention">Retention</h2>
      <p>We keep information for as long as needed to provide care, maintain medical records, resolve requests and meet legal or regulatory obligations. Clinical and billing records may have different retention periods. The hospital’s approved retention schedule and deletion process should be confirmed by the Data Protection Officer.</p>
      <h2 id="rights">Your rights</h2>
      <p>Subject to applicable law, you may ask to access your personal data, correct inaccurate information, withdraw consent where processing relies on consent, object to or restrict certain processing, request deletion where permitted, or raise a concern with the Office of the Data Protection Commissioner in Kenya. We may need to verify your identity before responding and may retain records where the law or patient safety requires it.</p>
      <h2 id="children">Children and family representatives</h2>
      <p>Where information concerns a child or a person who needs a representative, we may verify the authority of a parent, guardian or other representative before sharing information or acting on a request.</p>
      <h2 id="dpo">Data Protection Officer contact</h2>
      <p>To ask a privacy question or contact the Data Protection Officer, use our <Link href="/contact">contact page</Link> and select the appropriate branch, or call <a href="tel:+254112272061">+254 112 272 061</a> and ask for the Data Protection Officer. Please do not send medical records through the general enquiry form.</p>
    </LegalLayout>
  );
}
