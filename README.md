# Gilead Medical Centre

Patient-first digital services for outpatient and inpatient care, diagnostics, maternity, surgery and pharmacy support in Nairobi and Mombasa.

## Source archive and design fidelity

The supplied `argon-v1.0.0.zip` was extracted completely and retained. The original Argon Design System CSS, Sass, HTML, JavaScript, vendor assets and font-face rules remain unchanged. The application imports the original `assets/css/argon.css` and uses its original design tokens; the source package manifest is preserved in `argon-source-package.json` and audited in `design-source-audit.md`.

- `file-inventory.md` records the full archive file inventory before application code was added.
- `design-source-audit.md` records the source CSS tokens, font-face rules, original package versions and features absent from the archive.
- `image-credits.md` lists locally saved Pexels photographs.

The archive is an Argon component showcase, not an existing hospital website. No loading screen, cookie behavior, CAPTCHA, legal pages, API routes, environment names, or hospital content existed in the source; the corresponding application features were built from the supplied brief.

## Runtime

- Node.js `24.21.0` (`.nvmrc`); `engines.node` is `>=24.21.0`.
- Next.js `16.4.0`.
- React and React DOM `19.3.0`.

```bash
nvm use
npm ci
cp .env.example .env.local
npm run dev
```

The development server binds to `0.0.0.0` for preview hosting. A process-local, non-persistent KV adapter is available only in development. Do not use real patient data in a local preview or demo environment.

## Production integrations

Configure all production values in Vercel Project Settings → Environment Variables. Never commit secrets or put them in client code. Note that Vercel deprecated `@vercel/kv` for new stores; this implementation follows the requested KV interface, so confirm an existing compatible KV store or migrate the persistence adapter to a supported Redis Marketplace integration before launching.

1. **Patient portal:** configure `NEXTAUTH_SECRET`, `NEXTAUTH_URL` and a real `PATIENT_AUTH_URL` that authenticates patient ID and password. The Next.js 16 `proxy.ts` gate protects `/portal/*`, except the public `/portal/login` route. Connect your EMR/billing system to populate encrypted portal records in KV.
2. **Patient data:** configure `KV_REST_API_URL`, `KV_REST_API_TOKEN` and a random 32-byte `PATIENT_DATA_ENCRYPTION_KEY`. Appointment, insurance and feedback records are encrypted at the application layer before storage. Production writes fail closed if the KV or encryption key is missing.
3. **Insurance documents:** configure a Vercel Blob token with private access. The upload route limits requests to five PDF/JPG/PNG documents of 10 MB each.
4. **CAPTCHA:** configure reCAPTCHA v3 site/secret keys and v2 fallback site/secret keys. A v3 score below `RECAPTCHA_V3_SCORE_THRESHOLD` (default `0.5`) requires the visible v2 check. Production forms fail closed if verification is not configured.
5. **Email and WhatsApp:** configure SMTP and WhatsApp Business Cloud API values. Booking requests are saved first; notification status is returned without exposing patient details to the browser.
6. **M-Pesa:** configure Daraja credentials, shortcode, passkey, callback URL and callback secret. Start in sandbox and complete Safaricom’s callback/production approval steps before enabling live collections.
7. **Telemedicine:** configure the approved video-call provider URL and signing secret before sending join links.

See `.env.example` for the complete environment-variable list. The legal pages are implementation drafts and should be reviewed by Kenyan counsel and the hospital’s Data Protection Officer before deployment.

## Review before launch

The supplied brief did not include verified clinician records, street addresses, branch email addresses, live insurance agreements, package pricing, DPO details, SMTP/WhatsApp/M-Pesa credentials, or an EMR authentication endpoint. Named clinicians, qualifications, branch email addresses, package contents/prices, accreditation labels and sample news are illustrative or client-supplied placeholders and must be verified. Replace placeholder media with approved East African clinical photography where required. Do not publish unverified medical claims or use demo profiles as a live clinical roster.

## Useful commands

```bash
npm run typecheck
npm run build
npm start
```
