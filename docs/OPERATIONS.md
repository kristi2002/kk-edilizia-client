# Operations (production)

Short reference for hosting, data, and optional tooling beyond the README.

## Environment

- Set **`NEXT_PUBLIC_SITE_URL`** to the live origin (e.g. `https://kkedilizia.it`) on Vercel (or your host).
- **Email**: configure **Resend** or **Gmail** app password as in `.env.example`. Public-facing **`info@…`** in `staticSite` / Redis should match what you monitor; SMTP may still use a separate mailbox.
- **Redis (Upstash)**: optional but recommended for form rate limits. Without it, forms still work but are not throttled per IP.

## Redis / admin content

- **Backup**: export or snapshot Redis (Upstash dashboard) before major changes. Re-seed from admin or API if you reset the database.
- After changing **estimator** defaults in `src/lib/data/cost-estimator.ts`, run the admin **seed** for estimator categories if production still shows old €/m² bands.

## Google Business Profile

- Set **`publicReviewUrl`** in site data (admin or Redis) so JSON-LD **`sameAs`** points at the public review page.
- Replace demo **review** copy on the home (`HomeLocalIntro`) with short verbatim excerpts from public Google reviews when appropriate.

## Optional: Sentry

- Not bundled by default. To add error monitoring, use the official **Sentry wizard** for Next.js (`npx @sentry/wizard@latest -i nextjs`) and commit the generated config; keep the DSN only in environment variables.

## CI

- GitHub Actions **`.github/workflows/ci.yml`** runs `lint`, `test`, and `build` on push/PR to `main`/`master`.
