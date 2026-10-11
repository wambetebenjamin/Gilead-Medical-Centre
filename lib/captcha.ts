export type CaptchaVersion = "v3" | "v2";
export type CaptchaResult = {
  ok: boolean;
  fallbackRequired?: boolean;
  reason?: "missing-config" | "rejected" | "low-score" | "action-mismatch";
};

type SiteVerifyResponse = {
  success?: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export async function verifyCaptcha(
  token: string | undefined,
  action: string,
  version: CaptchaVersion = "v3",
): Promise<CaptchaResult> {
  if (!token) return { ok: false, reason: "rejected" };

  // Local preview fallback only. A deployed production environment always fails closed.
  if (token === "development-test-token" && process.env.NODE_ENV !== "production") {
    return { ok: true };
  }

  const secret = version === "v2" ? process.env.RECAPTCHA_V2_SECRET_KEY : process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: false, reason: "missing-config" };

  const form = new URLSearchParams({ secret, response: token });
  const remoteIp = undefined; // Avoid retaining or forwarding patient IP addresses.
  if (remoteIp) form.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { ok: false, reason: "rejected" };
    const result = (await response.json()) as SiteVerifyResponse;
    if (!result.success) return { ok: false, reason: "rejected" };
    if (version === "v2") return { ok: true };
    if (result.action !== action) return { ok: false, reason: "action-mismatch" };

    const configuredThreshold = Number(process.env.RECAPTCHA_V3_SCORE_THRESHOLD ?? "0.5");
    const threshold = Number.isFinite(configuredThreshold) && configuredThreshold >= 0 && configuredThreshold <= 1 ? configuredThreshold : 0.5;
    if (typeof result.score !== "number" || !Number.isFinite(result.score) || result.score < threshold) {
      return { ok: false, fallbackRequired: true, reason: "low-score" };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "rejected" };
  }
}

export function captchaErrorResponse(result: CaptchaResult) {
  if (result.fallbackRequired) {
    return Response.json({ error: "captcha_fallback_required", captchaFallback: true, message: "Please complete the additional verification." }, { status: 428, headers: { "Cache-Control": "no-store" } });
  }
  if (result.reason === "missing-config") {
    return Response.json({ error: "captcha_not_configured", message: "Secure verification is temporarily unavailable." }, { status: 503 });
  }
  return Response.json({ error: "captcha_rejected", message: "We could not verify this request. Please try again." }, { status: 403 });
}
