"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "@/components/icons";
import { insuranceProviders } from "@/lib/data";
import { CaptchaFallback, useCaptcha } from "@/components/captcha";
import { FormField } from "@/components/ui";

export function PreAuthForm() {
  const captcha = useCaptcha("preauth_request");
  const [values, setValues] = useState({ patientName: "", email: "", provider: "", policyNumber: "", procedure: "", referringDoctor: "" });
  const [files, setFiles] = useState<FileList | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reference, setReference] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess("");
    if (!consent) { setError("Please confirm that you consent to sharing these details with your insurer."); return; }
    const proof = await captcha.getProof();
    if (!proof) { setError("Please complete the security check before submitting."); return; }
    const form = new FormData();
    Object.entries(values).forEach(([key, value]) => form.append(key, value));
    if (files) Array.from(files).forEach((file) => form.append("supportingDocuments", file));
    form.append("consent", "true");
    form.append("captchaToken", proof.captchaToken);
    form.append("captchaVersion", proof.captchaVersion);
    setBusy(true);
    try {
      const response = await fetch("/api/pre-auth", { method: "POST", body: form });
      const result = await response.json();
      captcha.handleFailure(result);
      if (!response.ok) throw new Error(result.message ?? "We could not submit this request.");
      setSuccess(result.message);
      setReference(result.reference ?? "");
      setValues({ patientName: "", email: "", provider: "", policyNumber: "", procedure: "", referringDoctor: "" });
      setFiles(null);
      captcha.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not submit this request.");
    } finally { setBusy(false); }
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <div className="form-card__heading"><p className="eyebrow">Insurance support</p><h2>Request pre-authorisation</h2><p>Send the details your insurer needs. Supporting documents are handled securely.</p></div>
      <div className="form-grid form-grid--two">
        <FormField id="preauth-patient-name" label="Patient name"><input id="preauth-patient-name" autoComplete="name" value={values.patientName} onChange={(event) => set("patientName", event.target.value)} required /></FormField>
        <FormField id="preauth-email" label="Email address"><input id="preauth-email" type="email" autoComplete="email" value={values.email} onChange={(event) => set("email", event.target.value)} required /></FormField>
        <FormField id="preauth-provider" label="Insurance provider"><select id="preauth-provider" value={values.provider} onChange={(event) => set("provider", event.target.value)} required><option value="">Select provider</option>{insuranceProviders.map((provider) => <option key={provider}>{provider}</option>)}</select></FormField>
        <FormField id="preauth-policy" label="Policy number"><input id="preauth-policy" value={values.policyNumber} onChange={(event) => set("policyNumber", event.target.value)} required /></FormField>
        <FormField id="preauth-procedure" label="Procedure or service needed"><input id="preauth-procedure" value={values.procedure} onChange={(event) => set("procedure", event.target.value)} required /></FormField>
        <FormField id="preauth-doctor" label="Referring doctor"><input id="preauth-doctor" value={values.referringDoctor} onChange={(event) => set("referringDoctor", event.target.value)} required /></FormField>
      </div>
      <label className="upload-field" htmlFor="preauth-documents"><span className="upload-field__icon"><LockKeyhole size={18} /></span><span><strong>Supporting documents</strong><small>PDF, JPG or PNG · up to 5 files · 10 MB each</small></span><input id="preauth-documents" type="file" accept="application/pdf,image/jpeg,image/png" multiple onChange={(event) => setFiles(event.target.files)} /><span className="upload-field__button">Choose files</span></label>
      {files?.length ? <p className="field-hint">{Array.from(files).map((file) => file.name).join(", ")}</p> : null}
      <label className="check-row"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I consent to Gilead Medical Centre sharing the information and documents above with my insurer for this request.</span></label>
      <CaptchaFallback required={captcha.fallbackRequired} onToken={captcha.setV2Token} />
      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">{success}{reference && <><br />Reference: <strong>{reference}</strong></>}</p>}
      <button className="button button--primary form-submit" type="submit" disabled={busy}>{busy ? "Submitting securely…" : "Submit pre-authorisation request"}<ArrowRight size={16} /></button>
      <p className="form-footnote">We use your information only to coordinate this authorisation and related care. See <a href="/legal/privacy-policy">Insurance Data Sharing</a>.</p>
    </form>
  );
}
