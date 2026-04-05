# SEO patterns used on this site

This document summarizes **search-oriented patterns** implemented in the codebase so the project stays understandable when you extend content or deploy to production. It is **not** a guarantee of rankings; search engines decide what to show.

**See also:** [Guida introduttiva SEO (Google, contesto generale, IT)](docs/seo-guida-introduttiva-google-it.md) — general principles from Google Search Central; **this document** describes **this codebase** only.

---

## 1. Technical foundation (Next.js App Router)

- **Per-route metadata** — Pages export `generateMetadata` (or `metadata`) so each URL has its own **title**, **description**, and **Open Graph** fields (`opengraph-image.tsx`, layout metadata, service silo helper `buildServiceSiloMetadata`). **Canonical URL + `hreflang` alternates** (`it` / `en` / `x-default`) are applied via `withLocaleAlternates` in `src/lib/seo-metadata.ts` so each localized URL has a single canonical and clear language variants (aligns with Google guidance on duplicate content across locales). The HTML **meta keywords** tag is **not** emitted: Google Search ignores it; keyword lists for silos remain in `messages` only as editorial reference if needed.
- **Canonical base URL** — `getSiteUrl()` (Redis `canonicalUrl` → `NEXT_PUBLIC_SITE_URL` → fallback) drives **sitemap**, **robots**, **JSON-LD `url`**, and consistent absolute links. On **Vercel**, set `NEXT_PUBLIC_SITE_URL` to the **live custom domain** (e.g. `https://kkedilizia.it`), not only the default `*.vercel.app` URL, or canonicals and schema can disagree with Search Console.
- **`robots.ts`** — Allows crawlers on public routes, blocks `/admin` and `/api/admin`, and points to **`/sitemap.xml`**.
- **`sitemap.ts`** — Generates URLs for **both locales** (`it`, `en`), static segments, **service silo** routes, portfolio slugs, and virtual-tour URLs when present. Uses **`lastModified`**, **`changeFrequency`**, and **`priority`** hints.

---

## 2. Internationalization (broader query coverage)

- **Italian (default) and English** — Content lives in `messages/it.json` and `messages/en.json` with **`localePrefix: "as-needed"`** so Italian stays on clean paths (`/contatti`) and English is prefixed (`/en/contatti`).
- **`localeDetection: false`** — The default experience is **Italian at `/`**; English is chosen explicitly (`/en/...` or the language control), avoiding accidental English results for Italian-first queries.

---

## 3. “Topical authority” — service silos

Dedicated **keyword-aligned URLs** (not a single long homepage) help search engines map **intent** to pages:

| Path (IT default) | Focus |
|-------------------|--------|
| `/ristrutturazioni-bagno` | Bathroom renovation |
| `/cartongesso-modena` | Drywall / cartongesso |
| `/rifacimento-tetto` | Roof work |

Each silo page has:

- **Unique `metaTitle` / `metaDescription` / `metaKeywords`** (IT + EN in `messages/*.json` → `ServiceSilos.<silo>`).
- **Long-form body copy** — Six sections per silo (`body1`–`body6`) rendered by `ServiceSiloContent.tsx`, aimed at **substantial** Italian/English text (local services, materials such as Mapei/Kerakoll where relevant, Modena-area neighborhoods, process and permits explained at a high level).
- **Local footprint** — `ServiceSilos.modenaArea` (IT): *Modena centro, Sassuolo, Carpi, Formigine, Castelfranco Emilia e tutta la provincia.* (mirrored in EN.)
- **Internal links** to **preventivo** and **contatti** to keep crawl paths and user journeys clear.

**Internal linking:**

- Homepage section **`HomeServiceSilos`** links to the three silos.
- Footer **quick links** repeat those URLs under “Servizi”.

---

## 4. Structured data (rich results & local relevance)

- **`LocalBusinessJsonLd`** — Injects **schema.org** `HomeAndConstructionBusiness` with **name**, **legalName**, **taxID**, **vatID**, **numberOfEmployees**, **address**, **geo-related `areaServed`** (Modena, Sassuolo, Carpi, Formigine, Provincia di Modena), **contact**, and optional **`sameAs`** when a Google Business (or similar) URL is set in site data.
- **`BreadcrumbJsonLd`** — Used on portfolio-style pages to expose breadcrumb trails where implemented.

These help eligible **local** and **knowledge-panel-style** treatments; eligibility still depends on Google’s policies and entity data.

---

## 5. On-page content patterns

- **FAQ (homepage)** — Questions and answers live in **`src/lib/data/faq.ts`** (`faqByLocale.it` / `.en`), not in `messages/*.json`. The UI uses `FaqSection` intro strings from **`messages` → `FaqSection`**. Include **informational** and **AEO-style** queries (permits, timelines, CILA, costs, area served, **Bonus Ristrutturazione / tax relief** with a disclaimer to verify current law with a commercialista). Answers avoid fake precision and point to **survey / quote** where appropriate.
- **Portfolio** — Project pages with titles, descriptions, and images support **long-tail** and **location** relevance. Cover, gallery, and before/after images use **descriptive `alt`** (project title and gallery index) per Google image guidance. In **admin**, use descriptive titles (e.g. *Ristrutturazione appartamento storico — Centro Modena*) rather than generic labels; placeholders on the portfolio editor suggest this pattern.

---

## 6. Brand, crawl, and sharing assets

- **Favicon / tab icon** — Root layout **`metadata.icons`** and `<head>` links point to **`/logo.png`**. **`next.config.ts`** rewrites **`/favicon.ico`** → **`/logo.png`** so default browser requests resolve to the real logo. No generated `app/icon.tsx`; avoid leftover template SVGs in `public/`.
- **`opengraph-image.tsx`** — Default social preview image for shares.
- **`manifest.ts`** — Web app manifest includes **`icons`** referencing **`/logo.png`** for install/home-screen surfaces.

---

## 7. Analytics & tags (measurement, not rankings)

- **Google Tag Manager / GA** (when env vars are set) — Supports **measurement** and campaigns; they do not directly “rank” pages. Cookie copy in **`messages` → `CookieBanner`** describes technical cookies and aggregate analytics; align text with what you actually load (e.g. GA via GTM).

---

## 8. Company data & CMS (Redis / admin)

- **Site payload normalization** — `src/lib/validate-site-payload.ts` merges admin/Redis JSON with **`staticSite`** and **coalesces** empty or obvious **placeholder** values so the public site does not show wiped or demo fiscal/contact fields. Operational truth remains: save real data in admin and use production URLs in env.

---

## 9. Operational checklist for you

1. Set **`NEXT_PUBLIC_SITE_URL`** in **production** (e.g. Vercel project env) to **`https://kkedilizia.it`** (or your definitive domain). Optionally set **`canonicalUrl`** in admin company settings. Avoid relying only on **`*.vercel.app`** for canonical/sitemap/schema.
2. Submit **`https://<your-domain>/sitemap.xml`** in **Google Search Console** (and Bing Webmaster Tools) after major launches or domain changes.
3. Keep **service silo** and **homepage** copy aligned with **real services** and **accurate** areas; extend FAQ in `faq.ts` as new recurring questions appear.
4. Fill **`publicReviewUrl`** in company data when you have a stable **Google Business Profile** link for `sameAs` in JSON-LD.
5. **Paid search / social** — The site exposes conversion paths (**Preventivo**, **Contatti**, silo landing pages). Campaign setup (keywords, negatives, geo, creatives) lives in ad platforms, not in this repo.

---

## 10. Where to change things in code

| Concern | Main locations |
|--------|----------------|
| Page titles / descriptions (global) | `src/app/[locale]/layout.tsx`, `messages/*.json` → `Metadata` |
| Service silo SEO + long copy | `messages/*.json` → `ServiceSilos`, `HomeServiceSilos`; rendering `src/components/sections/service-silo/ServiceSiloContent.tsx` |
| FAQ Q&A text | **`src/lib/data/faq.ts`**; section titles `messages/*.json` → `FaqSection` |
| Silo routes | `src/lib/service-silos.ts`, `src/app/[locale]/*/page.tsx` |
| Canonical + hreflang | `src/lib/seo-metadata.ts` (`withLocaleAlternates`) |
| Sitemap entries | `src/app/sitemap.ts` |
| Local business schema | `src/components/seo/LocalBusinessJsonLd.tsx` |
| Robots | `src/app/robots.ts` |
| Favicon / manifest icons | `src/app/layout.tsx`, `src/app/manifest.ts`, `next.config.ts` rewrites, `public/logo.png` |
| Locale routing | `src/i18n/routing.ts` |
| Site data validation / Redis read | `src/lib/validate-site-payload.ts`, `src/lib/data/site-store.ts` |

---

*Last updated: April 2026 — canonical/hreflang via `seo-metadata.ts`, portfolio meta + image `alt`, no meta keywords in HTML, service silo long copy, FAQ in `faq.ts`, favicon/logo, manifest icons.*
