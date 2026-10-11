"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "@/components/icons";
import { CaptchaFallback, useCaptcha } from "@/components/captcha";

export function NewsletterForm() {
  const captcha = useCaptcha("newsletter_signup");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!consent) { setError("Please confirm you would like to receive health updates."); return; }
    const proof = await captcha.getProof();
    if (!proof) { setError("Please complete the security check before subscribing."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, ...proof }),
      });
      const result = await response.json();
      captcha.handleFailure(result);
      if (!response.ok) throw new Error(result.message ?? "We could not subscribe you right now.");
      setMessage(result.message);
      setEmail("");
      setConsent(false);
      captcha.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not subscribe you right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit} noValidate>
      <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
      <div className="newsletter-form__input">
        <input id="newsletter-email" type="email" autoComplete="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required aria-invalid={Boolean(error)} aria-describedby={error ? "newsletter-error" : undefined} />
        <button type="submit" aria-label="Subscribe to health updates" disabled={busy}>{busy ? "…" : <ArrowRight size={18} aria-hidden="true" />}</button>
      </div>
      <label className="newsletter-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> <span>I agree to receive occasional health updates.</span></label>
      {error && <small className="field-error" id="newsletter-error" role="alert">{error}</small>}
      {message && <small className="form-success" role="status">{message}</small>}
      <CaptchaFallback required={captcha.fallbackRequired} onToken={captcha.setV2Token} />
    </form>
  );
}
