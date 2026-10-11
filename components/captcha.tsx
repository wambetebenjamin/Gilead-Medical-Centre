"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CaptchaProof = { captchaToken: string; captchaVersion: "v3" | "v2" };

type RecaptchaApi = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  render?: (container: HTMLElement | string, options: Record<string, unknown>) => number;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

let recaptchaV3Loading: Promise<void> | null = null;

function loadRecaptchaV3(siteKey: string): Promise<void> {
  if (window.grecaptcha?.execute) return Promise.resolve();
  if (recaptchaV3Loading) return recaptchaV3Loading;
  recaptchaV3Loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "gilead-recaptcha-v3";
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => window.grecaptcha?.execute ? resolve() : reject(new Error("reCAPTCHA did not initialise."));
    script.onerror = () => reject(new Error("reCAPTCHA could not load."));
    document.head.appendChild(script);
  }).finally(() => { recaptchaV3Loading = null; });
  return recaptchaV3Loading;
}

export function useCaptcha(action: string) {
  const [fallbackRequired, setFallbackRequired] = useState(false);
  const [v2Token, setV2Token] = useState<string | null>(null);

  const getProof = useCallback(async (): Promise<CaptchaProof | null> => {
    if (fallbackRequired) return v2Token ? { captchaToken: v2Token, captchaVersion: "v2" } : null;
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
      if (process.env.NODE_ENV !== "production") return { captchaToken: "development-test-token", captchaVersion: "v3" };
      if (process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY) setFallbackRequired(true);
      return null;
    }
    try {
      if (!window.grecaptcha?.execute) await loadRecaptchaV3(siteKey);
      const api = window.grecaptcha;
      if (!api?.execute) throw new Error("reCAPTCHA is unavailable.");
      const token = await new Promise<string>((resolve, reject) => {
        api.ready(() => { api.execute(siteKey, { action }).then(resolve, reject); });
      });
      return token ? { captchaToken: token, captchaVersion: "v3" } : null;
    } catch {
      if (process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY) setFallbackRequired(true);
      return null;
    }
  }, [action, fallbackRequired, v2Token]);

  const handleFailure = useCallback((body: { captchaFallback?: boolean; error?: string }) => {
    if (body.captchaFallback || body.error === "captcha_fallback_required") {
      setFallbackRequired(true);
      setV2Token(null);
    }
  }, []);

  const requestFallback = useCallback(() => {
    setFallbackRequired(true);
    setV2Token(null);
  }, []);

  const reset = useCallback(() => {
    setFallbackRequired(false);
    setV2Token(null);
  }, []);

  return { getProof, fallbackRequired, v2Token, setV2Token, handleFailure, requestFallback, reset };
}

export function CaptchaFallback({ required, onToken }: { required: boolean; onToken: (token: string | null) => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY;

  useEffect(() => {
    if (!required) return;
    if (!siteKey) {
      setMessage("Additional verification is required. Please contact the centre if this continues.");
      return;
    }

    let cancelled = false;
    const render = () => {
      if (cancelled || !mountRef.current) return;
      const api = window.grecaptcha;
      if (!api?.render) {
        setMessage("The verification challenge is loading. Please try again in a moment.");
        return;
      }
      try {
        mountRef.current.innerHTML = "";
        api.render(mountRef.current, {
          sitekey: siteKey,
          callback: (token: string) => { onToken(token); setMessage(""); },
          "expired-callback": () => onToken(null),
          "error-callback": () => setMessage("Verification could not load. Check your connection and try again."),
        });
        setMessage("");
      } catch {
        setMessage("The verification challenge could not be displayed. Please refresh and try again.");
      }
    };

    const existing = document.getElementById("gilead-recaptcha-v2");
    if (existing && window.grecaptcha?.render) {
      render();
      return () => { cancelled = true; };
    }
    if (!existing) {
      const script = document.createElement("script");
      script.id = "gilead-recaptcha-v2";
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = render;
      script.onerror = () => setMessage("Verification could not load. Please try again later.");
      document.head.appendChild(script);
    } else {
      existing.addEventListener("load", render, { once: true });
    }
    return () => { cancelled = true; };
  }, [required, siteKey, onToken]);

  if (!required) return null;
  return (
    <div className="captcha-fallback" aria-live="polite">
      <p>Please complete this additional security check.</p>
      <div ref={mountRef} />
      {message && <small>{message}</small>}
    </div>
  );
}
