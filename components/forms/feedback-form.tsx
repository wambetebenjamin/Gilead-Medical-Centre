"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Star } from "@/components/icons";
import { departments } from "@/lib/data";
import { CaptchaFallback, useCaptcha } from "@/components/captcha";
import { FormField } from "@/components/ui";

export function FeedbackForm() {
  const captcha = useCaptcha("patient_feedback");
  const [rating, setRating] = useState(0);
  const [department, setDepartment] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess("");
    if (!rating) { setError("Please select a rating from one to five."); return; }
    const proof = await captcha.getProof();
    if (!proof) { setError("Please complete the security check before sending."); return; }
    const form = new FormData();
    form.append("rating", String(rating)); form.append("department", department); form.append("visitDate", visitDate); form.append("comments", comments);
    form.append("captchaToken", proof.captchaToken); form.append("captchaVersion", proof.captchaVersion);
    setBusy(true);
    try {
      const response = await fetch("/api/feedback", { method: "POST", body: form });
      const result = await response.json();
      captcha.handleFailure(result);
      if (!response.ok) throw new Error(result.message ?? "We could not send your feedback.");
      setSuccess(result.message); setRating(0); setDepartment(""); setVisitDate(""); setComments(""); captcha.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not send your feedback.");
    } finally { setBusy(false); }
  }

  return (
    <form className="form-card feedback-form" onSubmit={submit} noValidate>
      <div className="form-card__heading"><p className="eyebrow">Your voice matters</p><h2>Share your experience</h2><p>Feedback is reviewed to help improve patient services. Responses are stored anonymously.</p></div>
      <fieldset className="rating-control">
        <legend>How would you rate your visit?</legend>
        <div role="group" aria-label="Rate your visit from one to five stars" className="rating-control__stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" aria-label={`${value} ${value === 1 ? "star" : "stars"}`} aria-pressed={rating === value} onClick={() => setRating(value)}>
              <Star size={28} fill={rating >= value ? "currentColor" : "none"} aria-hidden="true" />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="form-grid form-grid--two">
        <FormField id="feedback-department" label="Department visited"><select id="feedback-department" value={department} onChange={(event) => setDepartment(event.target.value)} required><option value="">Select department</option>{departments.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}<option value="Other">Other</option></select></FormField>
        <FormField id="feedback-date" label="Date of visit"><input id="feedback-date" type="date" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} required /></FormField>
      </div>
      <FormField id="feedback-comments" label="Comments"><textarea id="feedback-comments" rows={4} maxLength={1000} value={comments} onChange={(event) => setComments(event.target.value)} placeholder="What went well, or what could we improve?" required /></FormField>
      <CaptchaFallback required={captcha.fallbackRequired} onToken={captcha.setV2Token} />
      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}</p>}
      <button className="button button--primary form-submit" type="submit" disabled={busy}>{busy ? "Sending…" : "Send feedback"}<ArrowRight size={16} /></button>
      <p className="form-footnote">Please do not include names, ID numbers or other identifying details. For a personal care concern, contact us directly.</p>
    </form>
  );
}
