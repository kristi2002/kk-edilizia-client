# SEO patterns used on this site

This document summarizes **search-oriented patterns** implemented in the codebase so the project stays understandable when you extend content or deploy to production. It is **not** a guarantee of rankings; search engines decide what to show.

**See also:** [Guida introduttiva SEO (Google, contesto generale, IT)](docs/seo-guida-introduttiva-google-it.md) — general principles from Google Search Central; **this document** describes **this codebase** only.

**Purpose for tooling:** Feed this file to another model when you want **suggestions** that respect existing architecture (Next.js App Router, `next-intl`, Redis site data, file locations below).

---

## 1. Technical foundation (Next.js App Router)

### Metadata & duplicates across locales

- **Per-route metadata** — Pages export `generateMetadata` (or static `metadata`) so each URL has its own **title**, **description**, and **Open Graph** fields (`opengraph-image.tsx`, `[locale]/layout.tsx` defaults, service silo helper `buildServiceSiloMetadata`).
- **Canonical URL + `hreflang`** — `it` / `en` / `x-default` (default = Italian site) via **`withLocaleAlternates`** in **`src/lib/seo-metadata.ts`**, merged into each page’s metadata. Aligns with Google guidance on localized duplicates.
- **No HTML meta keywords** — The **`<meta name="keywords">`** tag is **not** emitted. Google Search ignores it. Arrays named `metaKeywords` under **`messages/*.json` → `ServiceSilos`** are **editorial / legacy only** and are not passed to Next `Metadata` (removed from `buildServiceSiloMetadata`).

### Canonical base URL & legacy domain

- **`getSiteUrl()`** — Resolution order: Redis **`canonicalUrl`** (admin) → **`NEXT_PUBLIC_SITE_URL`** → fallback **`PLACEHOLDER_PUBLIC_SITE_URL`** in **`src/lib/site.ts`** (`https://kkedilizia.it`).
- **`normalizePublicSiteUrl()`** (in **`src/lib/site.ts`**) — Ensures absolute URLs; **rewrites legacy hostname** `kk-edilizia.it` (and `www` variants) to **`kkedilizia.it`** so env/Redis mistakes do not leak wrong absolute URLs into sitemap, schema, or canonicals.
- **Production** — Set **`NEXT_PUBLIC_SITE_URL=https://kkedilizia.it`** on Vercel (and **`canonicalUrl`** in admin if used). Avoid relying only on **`*.vercel.app`** for canonical/sitemap/schema alignment with Search Console.

### Crawl & index files

- **`src/app/robots.ts`** — `allow: /` for `*`; **`disallow`**: `/admin`, `/api/admin`**; **`sitemap`**: absolute URL from `getSiteUrl()` + `/sitemap.xml`. View in browser: **`/robots.txt`**.
- **`src/app/sitemap.ts`** + **`src/lib/sitemap-lastmod.ts`** — **`lastModified`** is **`YYYY-MM-DD`** (string). **Static** marketing routes use **`NEXT_PUBLIC_SITEMAP_STATIC_LASTMOD`** (see **`.env.example`**) or a code fallback—**bump the env date** when you ship copy/silo changes so Google does not see a fake “today” on every URL. **Home** and **`/portfolio`** index use **`max(static, latest portfolio date)`**. **Portfolio** and **virtual-tour** URLs use **`Project.updatedAt`** (optional, from API/admin JSON) if set, else **inferred from `year`** (`YYYY-12-01`). Next.js serializes with **`<?xml version="1.0" encoding="UTF-8"?>`** first (see Next’s `resolve-route-data` for sitemaps).

---

## 2. Internationalization

- **Locales** — `it` (default), `en`; content in **`messages/it.json`** and **`messages/en.json`**.
- **`localePrefix: "as-needed"`** — Italian URLs have no prefix (`/contatti`); English uses **`/en/...`**.
- **`localeDetection: false`** — No automatic redirect by `Accept-Language`; Italian remains default at **`/`** unless the user picks English.

---

## 3. “Topical authority” — service silos

Keyword-aligned **dedicated URLs** (not everything on the homepage):

| Path (IT default) | Focus |
|-------------------|--------|
| `/ristrutturazioni-bagno` | Bathroom renovation |
| `/cartongesso-modena` | Drywall / cartongesso |
| `/rifacimento-tetto` | Roof work |

- **Metadata** — Unique **`metaTitle`** / **`metaDescription`** per silo via **`buildServiceSiloMetadata`** + **`withLocaleAlternates`** (path from **`src/lib/service-silos.ts`**).
- **Body** — Long copy in **`messages` → `ServiceSilos.<key>`** (`body1`–`body6`), rendered by **`ServiceSiloContent.tsx`**. Mentions **Mapei**, **Kerakoll**, Modena-area zones (e.g. Via Emilia, **Viale Amendola**, **Piazza Roma**, Quartiere Musicisti), province towns (e.g. **Spilamberto**, **Maranello**), high-level **CILA/SCIA** context (professional responsibility stays with client’s technician).
- **Area string** — **`ServiceSilos.modenaArea`** (IT/EN): hyper-local Modena references plus a broad list of municipalities; keep both when you extend copy.
- **Compliance block** — **`ServiceSilos.complianceModena`** (IT/EN): **RUE** (regolamento urbanistico-edilizio) **Comune di Modena**, D.P.R. 380/2001, split of responsibility (technician vs execution on site). Rendered in **`ServiceSiloContent.tsx`** below **`modenaArea`**.
- **Internal links** — **`HomeServiceSilos`**, footer **“Zone servite”** (see below), CTAs to **preventivo** / **contatti**.

---

## 4. Structured data (JSON-LD)

- **`LocalBusinessJsonLd`** (`src/components/seo/LocalBusinessJsonLd.tsx`) — **`@type`: `HomeAndConstructionBusiness`**: brand, legalName, tax/vat, employees, **description** (IT, aligned with services), **`url`** from `getSiteUrl()`, phone, email, **PostalAddress**, **`areaServed`** — **many explicit `City` entries** (Modena, Sassuolo, Carpi, Formigine, Castelfranco Emilia, Spilamberto, Maranello, Vignola, Castelnuovo Rangone, San Prospero, Nonantola, Mirandola, Pavullo nel Frignano, Fiorano Modenese, Soliera, Campogalliano, Concordia sulla Secchia, Finale Emilia, …) plus **`AdministrativeArea` “Provincia di Modena”**. Expand this list in code when you routinely serve additional comuni. **`geo`** (approximate **GeoCoordinates** for Modena area), **`knowsAbout`** (topics including services, **Mapei/Kerakoll**, **Knauf**, **Comune di Modena** building rules mention), **`priceRange`**, optional **`sameAs`** if **`publicReviewUrl`** is set in site data (Google Business Profile).
- **`BreadcrumbJsonLd`** — Portfolio and virtual-tour pages where implemented.

Eligibility for rich/local features remains at Google’s discretion.

---

## 5. On-page content patterns

### Homepage — `HomeLocalIntro`

- **Component** — **`src/components/sections/HomeLocalIntro.tsx`**, rendered on **`src/app/[locale]/page.tsx`** after **`StatsStrip`**, before **`Services`**.
- **Strings** — **`messages/*.json` → `HomeLocalIntro`** (`label`, `title`, **`p1`–`p4`**). Italian copy covers: **impresa edile**, **servizi edili**, **privati** and **small businesses**, **Comune di Modena** / building regulations, **territory** (Modena, Sassuolo, Carpi, Formigine), **material brands** (**Mapei**, **Kerakoll**, **Knauf** or certified equivalents), transparency on **quotes** and **no guaranteed rankings** for local search.

### Global homepage metadata

- **`messages` → `Metadata`** — **`siteTitle`** / **`siteDescription`** tuned for **Modena**, **servizi edili**, **privati/aziende**, **materiali** (Mapei, Kerakoll, equivalenti), province towns.
- **Root layout** — **`src/app/[locale]/layout.tsx`** sets default **title template** and **Open Graph** locale; per-page metadata overrides where defined.
- **Verification** — Google **site verification** meta is set on the **home** `generateMetadata` in **`src/app/[locale]/page.tsx`** (alongside **`withLocaleAlternates`** for `/`).

### FAQ

- **Data** — **`src/lib/data/faq.ts`**: **`faqByLocale.it`** / **`.en`** arrays (not in `messages` for Q/A bodies).
- **UI** — **`FaqSection`** intro from **`messages` → `FaqSection`**. Topics include: permits/CILA, **Bonus** disclaimer, timelines, **area served**, **local / “near me”** behavior (honest), **Mapei/Kerakoll/Knauf** FAQ entry, **servizi edili** scope.

### Portfolio

- **Metadata** — Per-project titles/descriptions; **`withLocaleAlternates`** on detail and virtual-tour routes.
- **Images (descriptive `alt`, include location)** — Prefer **service + title + place**, not generic words (“bagno” alone).
  - **Detail page** (`src/app/[locale]/portfolio/[slug]/page.tsx`) — Cover: **`ProjectDetail.coverAlt`** (`category`, `title`, **`location`**). Gallery: **`ProjectDetail.galleryAlt`** (`category`, `index`, `title`, **`location`**). Before/after: **`photoAltBefore`** / **`photoAltAfter`**.
  - **Listing** — Same pattern via **`FeaturedProjects.coverAlt`** in **`src/app/[locale]/portfolio/page.tsx`**.
  - **Home featured strip** — **`FeaturedProjects.coverAlt`** in **`FeaturedProjects.tsx`**.
- **Internal linking from projects** — After the project description, a block links to all three **service silos** (`SERVICE_SILO_ROUTES`). If **`location`** matches a **provincial town** (regex in the page: e.g. Sassuolo, Carpi, Formigine, Spilamberto, …), an extra line points to **bathroom silo** as the “same work in central Modena” path (**`ProjectDetail.crossSellModena`** + **`crossSellBagno`**). Adjust the regex or copy when expanding towns.
- **Sitemap freshness** — Portfolio URLs use **`Project.updatedAt`** when set (see §1 + checklist). Adding or updating projects with **`updatedAt`** helps reflect an active service area in **`lastModified`**.

Listing page meta: **`PortfolioPage.metaTitle` / `metaDescription`**.

### Footer — “Zone servite”

- **`src/components/site/Footer.tsx`** — First nav block under the quick-links column: **`Footer.zonesTitle`** (“Zone servite” / “Areas served”), **`Footer.zonesIntro`**, then the three silo links from **`SERVICE_SILO_ROUTES`** (`linkBagno`, `linkCartongesso`, `linkTetto`). Below that, **`Footer.quick`** groups portfolio, contacts, booking, etc. **`Footer.napAreas`** (NAP-adjacent line) lists representative towns for consistency with copy/schema.

### Other

- **Hero / Services / ProcessSteps** — Copy in **`messages`**; tuned for **edilizia** / **servizi edili** / Modena province where relevant.

---

## 6. Brand, crawl, and sharing assets

- **Favicon** — **`public/favicon.ico`** (32×32 + 16×16 generated from **`public/logo.png`** via **`npm run generate:favicon`**, script: **`scripts/generate-favicon.mjs`**, uses **sharp** + **png-to-ico**). **`src/app/layout.tsx`** lists **`/favicon.ico`** first in **`metadata.icons`**, then **`/logo.png`**. No **`next.config`** rewrite for favicon (direct static file).
- **`opengraph-image.tsx`** — Exports **`alt`**, **`size`**, **`width`**, **`height`**, **`contentType`** (`image/png`, 1200×630) so crawlers and social CDNs can reserve space without probing the image. **`manifest.ts`** — icons still reference **`/logo.png`** for PWA/home-screen.

---

## 7. Analytics & tags

- **GTM / GA** — When env vars are set; measurement does not equal rankings. **`CookieBanner`** copy should match what is actually loaded.

---

## 8. Company data & CMS (Redis / admin)

- **`src/lib/validate-site-payload.ts`** — Merges Redis/admin JSON with **`staticSite`**; coalesces empty placeholders.
- **`src/lib/data/site-store.ts`** — **`getSite()`**, **`getSiteUrl()`** for runtime URL used across metadata, sitemap, robots, schema.

---

## 9. Operational checklist

1. **Env** — **`NEXT_PUBLIC_SITE_URL=https://kkedilizia.it`** in production; align **`canonicalUrl`** in admin if used. After **static marketing** content updates, bump **`NEXT_PUBLIC_SITEMAP_STATIC_LASTMOD`** (YYYY-MM-DD). Portfolio pages: set **`updatedAt`** on projects when editing in admin/API (optional field).
2. **Search Console** — Submit **`https://kkedilizia.it/sitemap.xml`**; use **URL Inspection** after changes.
3. **Google Business Profile** — Critical for **“near me”** and Maps; fill **`publicReviewUrl`** for **`sameAs`** in JSON-LD.
4. **Content** — Keep silo and homepage copy truthful (materials, areas); extend **`faq.ts`** as new questions repeat. When you **routinely** add work in new comuni, update **`LocalBusinessJsonLd` `areaServed`**, and align **`Footer.napAreas`** / **`ServiceSilos.modenaArea`** (and the **province-town regex** on the portfolio detail page if those towns should trigger the Modena cross-link).
5. **Ads** — Campaign config lives outside the repo.

---

## 10. File map (where to edit)

| Concern | Main locations |
|--------|------------------|
| Default layout metadata + title template | `src/app/[locale]/layout.tsx` |
| Home: verification + alternates for `/` | `src/app/[locale]/page.tsx` |
| Home local SEO block (`p1`–`p4`) | `src/components/sections/HomeLocalIntro.tsx`, `messages/*.json` → `HomeLocalIntro` |
| Global site title/description | `messages/*.json` → `Metadata` |
| Service silo copy + meta (incl. `modenaArea`, `complianceModena`) | `messages/*.json` → `ServiceSilos`, `HomeServiceSilos`; `src/lib/service-silo-metadata.ts`; `src/components/sections/service-silo/ServiceSiloContent.tsx` |
| Footer silos + “Zone servite” | `src/components/site/Footer.tsx`; `messages/*.json` → `Footer` |
| Portfolio detail: alt + silo cross-links | `src/app/[locale]/portfolio/[slug]/page.tsx`; `messages/*.json` → `ProjectDetail`, `FeaturedProjects` |
| FAQ Q&A | `src/lib/data/faq.ts`; intro `messages` → `FaqSection` |
| Silo route table | `src/lib/service-silos.ts`; pages under `src/app/[locale]/` |
| Canonical + hreflang helper | `src/lib/seo-metadata.ts` |
| Public URL + legacy host rewrite | `src/lib/site.ts` (`normalizePublicSiteUrl`, `getFallbackSiteUrl`) |
| Sitemap + lastmod logic | `src/app/sitemap.ts`, `src/lib/sitemap-lastmod.ts` |
| Robots | `src/app/robots.ts` |
| LocalBusiness JSON-LD | `src/components/seo/LocalBusinessJsonLd.tsx` |
| Breadcrumbs JSON-LD | `src/components/seo/BreadcrumbJsonLd.tsx` |
| Favicon / OG image | `src/app/layout.tsx`, `src/app/opengraph-image.tsx`, `src/app/manifest.ts`, `public/favicon.ico`, `public/logo.png`, `scripts/generate-favicon.mjs` |
| Locale routing | `src/i18n/routing.ts`, `src/lib/i18n-path.ts` |
| Site URL / Redis | `src/lib/data/site-store.ts`, `src/lib/validate-site-payload.ts` |
| Portfolio `updatedAt` (Zod) | `src/lib/validate-projects-payload.ts`, `src/lib/data/projects.ts` (`Project` type) |

---

*Last updated: April 2026 — silo RUE/compliance + hyper-local copy; expanded `LocalBusinessJsonLd` `areaServed`; portfolio/featured `alt` with category + location; footer “Zone servite”; project-page internal links to silos + optional Modena cross-link; sitemap lastmod from env + projects; `favicon.ico` in `public`; OG exports `width`/`height`/`contentType`; HomeLocalIntro, FAQ, canonical/hreflang, no meta keywords in HTML.*
