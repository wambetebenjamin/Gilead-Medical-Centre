import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = { title: "Terms of Use", description: "Terms for website use and appointment requests at Gilead Medical Centre." };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use">
      <p>These terms apply to this website and to online appointment, enquiry, feedback and insurance request forms. They do not replace the consent, clinical documentation or service terms provided to you at the hospital. If you do not agree, please do not use the online forms.</p>
      <h2 id="appointments">Appointment terms</h2>
      <p>An online appointment is a request, not a confirmed booking. A member of the Gilead Medical Centre team will contact you to confirm the clinician, location, date and time. Service availability, fees and clinician schedules may change. Please arrive on time and bring any documents requested by the care team.</p>
      <h2 id="cancellation">Cancellation and rescheduling</h2>
      <p>Where possible, give at least 24 hours’ notice to cancel or reschedule an appointment. The patient portal enforces this notice period for self-service changes. If your appointment is within 24 hours, call the centre for assistance. Separate clinical, theatre or package terms may apply and will be explained to you directly.</p>
      <h2 id="medical-disclaimer">Medical disclaimer</h2>
      <p>Website content is general information and is not a diagnosis, treatment plan or substitute for advice from a qualified healthcare professional. Do not delay urgent care because of information on this website or a telemedicine appointment. For an emergency, call <a href="tel:+254112272061">+254 112 272 061</a> or go to the nearest emergency department.</p>
      <h2 id="telemedicine">Telemedicine</h2>
      <p>Telemedicine is suitable only where a clinician determines that remote care is appropriate. You may be asked to attend in person or seek urgent care. Keep your joining link private and use a private location where possible. Video consultation links are sent only after the booking is confirmed and the telemedicine service is configured.</p>
      <h2 id="insurance">Insurance terms</h2>
      <p>Insurance acceptance and benefits depend on your specific policy, provider, service and any required authorisation. Submitting a pre-authorisation request does not guarantee approval or payment. You remain responsible for confirming your cover, obtaining required approvals and paying any amount not covered by your insurer.</p>
      <h2 id="prices">Packages and prices</h2>
      <p>Health package descriptions and prices displayed on this prototype are indicative and must be confirmed with Gilead Medical Centre before booking. The final inclusions, price and suitability will be explained by the hospital team.</p>
      <h2 id="website-use">Website use</h2>
      <p>Do not use this website to submit false information, interfere with its security or attempt to access another person’s account. We may temporarily suspend online services for maintenance, safety or operational reasons. Links to third-party services are provided for convenience and are governed by their own terms.</p>
      <h2 id="governing-law">Governing law</h2>
      <p>These website terms are governed by the laws of Kenya. Any question or dispute should first be raised with Gilead Medical Centre so we can try to resolve it promptly, without limiting any rights you have under Kenyan law.</p>
      <h2 id="contact">Questions</h2>
      <p>For questions about these terms, use the <Link href="/contact">contact page</Link> or call <a href="tel:+254112272061">+254 112 272 061</a>.</p>
    </LegalLayout>
  );
}
