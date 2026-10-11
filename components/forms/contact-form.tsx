"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "@/components/icons";
import { branches } from "@/lib/data";
import { CaptchaFallback, useCaptcha } from "@/components/captcha";
import { FormField } from "@/components/ui";

export function ContactForm() {
  const captcha = useCaptcha("general_contact");
  const [values, setValues] = useState({ name: "", email: "", phone: "", branch: "nairobi", subject: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setSuccess("");
    const proof = await captcha.getProof();
    if (!proof) { setError("Please complete the security check before sending."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, ...proof }) });
      const result = await response.json();
      captcha.handleFailure(result);
      if (!response.ok) throw new Error(result.message ?? "We could not send your enquiry.");
      setSuccess(result.message);
      setValues({ name: "", email: "", phone: "", branch: "nairobi", subject: "", message: "" });
      captcha.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not send your enquiry.");
    } finally { setBusy(false); }
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <div className="form-card__heading"><p className="eyebrow">We’re here to help</p><h2>Send an enquiry</h2><p>For urgent medical care, please call our 24-hour emergency line.</p></div>
      <div className="form-grid form-grid--two">
        <FormField id="contact-name" label="Full name"><input id="contact-name" name="name" autoComplete="name" value={values.name} onChange={(event) => set("name", event.target.value)} required aria-invalid={Boolean(error && !values.name)} /></FormField>
        <FormField id="contact-email" label="Email address"><input id="contact-email" name="email" type="email" autoComplete="email" value={values.email} onChange={(event) => set("email", event.target.value)} required aria-invalid={Boolean(error && !values.email)} /></FormField>
        <FormField id="contact-phone" label="Phone number"><input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(event) => set("phone", event.target.value)} /></FormField>
        <FormField id="contact-branch" label="Branch"><select id="contact-branch" value={values.branch} onChange={(event) => set("branch", event.target.value)}><option value="nairobi">Nairobi</option><option value="mombasa">Mombasa</option></select></FormField>
      </div>
      <FormField id="contact-subject" label="Subject"><input id="contact-subject" name="subject" value={values.subject} onChange={(event) => set("subject", event.target.value)} required /></FormField>
      <FormField id="contact-message" label="How can we help?" hint="Please do not include sensitive medical details in this general enquiry form."><textarea id="contact-message" name="message" rows={4} value={values.message} onChange={(event) => set("message", event.target.value)} required /></FormField>
      <CaptchaFallback required={captcha.fallbackRequired} onToken={captcha.setV2Token} />
      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}</p>}
      <button className="button button--primary form-submit" type="submit" disabled={busy}>{busy ? "Sending…" : "Send enquiry"}<ArrowRight size={16} /></button>
      <p className="form-footnote">By submitting, you agree that we may use your details to respond to this enquiry. See our <a href="/legal/privacy-policy">Privacy Policy</a>.</p>
    </form>
  );
}
