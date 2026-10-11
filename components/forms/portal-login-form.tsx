"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck } from "@/components/icons";
import { CaptchaFallback, useCaptcha } from "@/components/captcha";

export function PortalLoginForm() {
  const router = useRouter();
  const captcha = useCaptcha("staff_portal_login");
  const [patientId, setPatientId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!patientId || !password) { setError("Enter your patient ID and password."); return; }
    const proof = await captcha.getProof();
    if (!proof) { setError("Please complete the security check before signing in."); return; }
    setBusy(true);
    try {
      const requested = new URLSearchParams(window.location.search).get("callbackUrl") ?? "/portal";
      const callbackUrl = requested.startsWith("/") && !requested.startsWith("//") ? requested : "/portal";
      const result = await signIn("credentials", { redirect: false, callbackUrl, patientId, password, ...proof });
      if (result?.ok) {
        captcha.reset();
        router.push(result.url ?? "/portal");
        router.refresh();
        return;
      }
      if (proof.captchaVersion === "v3") {
        captcha.requestFallback();
        setError("We couldn’t complete verification. Please complete the additional security check and try again.");
      } else {
        setError("We couldn’t sign you in. Check your details or contact the patient support team.");
      }
    } catch {
      setError("The portal is temporarily unavailable. Please try again or contact patient support.");
    } finally { setBusy(false); }
  }

  return (
    <form className="portal-login-form" onSubmit={submit} noValidate>
      <span className="portal-login-icon"><LockKeyhole size={20} /></span>
      <h2>Patient portal</h2>
      <p>Sign in securely to view your appointments, medical summary, bills and prescriptions.</p>
      <label className="form-field" htmlFor="portal-patient-id"><span>Patient ID</span><input id="portal-patient-id" autoComplete="username" value={patientId} onChange={(event) => setPatientId(event.target.value)} required aria-invalid={Boolean(error && !patientId)} /></label>
      <label className="form-field" htmlFor="portal-password"><span>Password</span><input id="portal-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required aria-invalid={Boolean(error && !password)} /></label>
      <CaptchaFallback required={captcha.fallbackRequired} onToken={captcha.setV2Token} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button--primary form-submit" type="submit" disabled={busy}>{busy ? "Signing in securely…" : "Sign in"}<ArrowRight size={16} /></button>
      <p className="form-footnote"><ShieldCheck size={14} /> Your health information is private and visible only to you and authorised care providers.</p>
      <a className="portal-help-link" href="/contact">Need help accessing your account?</a>
    </form>
  );
}
