# SEO patterns used on this site

This document summarizes **search-oriented patterns** implemented in the codebase so the project stays understandable when you extend content or deploy to production. It is **not** a guarantee of rankings; search engines decide what to show.

**See also:** [Guida introduttiva SEO (Google, contesto generale, IT)](docs/seo-guida-introduttiva-google-it.md) — general principles from Google Search Central; **this document** describes **this codebase** only.

**Purpose for tooling:** Feed this file to another model when you want **suggestions** that respect existing architecture (Next.js App Router, `next-intl`, Redis site data, file locations below).

---

## 1. Technical foundation (Next.js App Router)

### Metadata & duplicates across locales

- **Rendering** — Marketing routes are **statically prerendered** with `revalidate = 3600` (`src/app/[locale]/layout.tsx`). They previously carried `dynamic = "force-dynamic"`, which made every public URL server-render on demand and silently overrode each page's own `revalidate`. Static rendering requires **`setRequestLocale(locale)`** in every page that reads translations — the home route was the one missing it.
- **Per-route metadata** — Pages export `generateMetadata` (or static `metadata`) so each URL has its own **title**, **description**, and **Open Graph** fields (`opengraph-image.tsx`, `[locale]/layout.tsx` defaults, service silo helper `buildServiceSiloMetadata`).
- **Canonical URL + `hreflang`** — `it` / `en` / `x-default` (default = Italian site) via **`withLocaleAlternates`** in **`src/lib/seo-metadata.ts`**, merged into each page’s metadata. Aligns with Google guidance on localized duplicates.
- **No HTML meta keywords** — The **`<meta name="keywords">`** tag is **not** emitted. Google Search ignores it. Arrays named `metaKeywords` under **`messages/*.json` → `ServiceSilos`** are **editorial / legacy only**. Until September 2026 they *were* still passed through `buildServiceSiloMetadata` (and on the home / `impresa-edile-modena` routes), so the tag was in fact emitted; that is now removed and the code matches this section.

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

Authoritative list: **`src/lib/service-silos.ts`** (`SERVICE_SILO_ROUTES`) — three hubs and six spokes. All nine appear in the header **Servizi** menu, the footer, and the sibling-links block at the foot of every silo page.

| Path (IT default) | Focus |
|-------------------|--------|
| `/ristrutturazioni-chiavi-in-mano` | Turnkey renovations (hub) |
| `/ristrutturazione-bagno` | Bathroom renovation (hub) |
| `/ristrutturazione-cucina` | Kitchen renovation (hub) |
| `/impianti-elettrici-modena` | Electrical systems |
| `/idraulico-modena` | Plumbing |
| `/opere-murarie` | Masonry |
| `/cartongesso-isolamento` | Drywall and insulation |
| `/posa-pavimenti-rivestimenti` | Floor and wall tiling |
| `/rifacimento-tetto-facciate` | Roof and facade work |

**Legacy URLs** — `/ristrutturazioni-bagno`, `/cartongesso-modena` and `/rifacimento-tetto` are **308 permanent redirects** declared in `next.config.ts` (`redirects()`), for both locales. They were previously `redirect()` calls inside page components, which returned **HTTP 200** with the generic site title, no canonical, and only a `<meta http-equiv="refresh">`.

- **Metadata** — Unique **`metaTitle`** / **`metaDescription`** per silo via **`buildServiceSiloMetadata`** + **`withLocaleAlternates`** (path from **`src/lib/service-silos.ts`**).
- **Body** — Long copy in **`messages` → `ServiceSilos.<key>`** (`body1`–`body6`), rendered by **`ServiceSiloContent.tsx`**. Mentions **Mapei**, **Kerakoll**, Modena-area zones (e.g. Via Emilia, **Viale Amendola**, **Piazza Roma**, Quartiere Musicisti), province towns (e.g. **Spilamberto**, **Maranello**), high-level **CILA/SCIA** context (professional responsibility stays with client’s technician).
- **Area string** — **`ServiceSilos.modenaArea`** (IT/EN): hyper-local Modena references plus a broad list of municipalities; keep both when you extend copy.
- **Compliance block** — **`ServiceSilos.complianceModena`** (IT/EN): **RUE** (regolamento urbanistico-edilizio) **Comune di Modena**, D.P.R. 380/2001, split of responsibility (technician vs execution on site). Rendered in **`ServiceSiloContent.tsx`** below **`modenaArea`**.
- **Internal links** — **`HomeServiceSilos`**, footer **“Zone servite”** (see below), CTAs to **preventivo** / **contatti**.

---

## 4. Structured data (JSON-LD)

- **`LocalBusinessJsonLd`** (`src/components/seo/LocalBusinessJsonLd.tsx`) — **`@type`: `HomeAndConstructionBusiness`**: brand, legalName, tax/vat, employees, **description** (IT, aligned with services), **`url`** from `getSiteUrl()`, phone, email, **PostalAddress**, **`areaServed`** — array of schema.org **`City`** entries plus **`AdministrativeArea` “Provincia di Modena”**. **Authoritative list:** **`src/lib/constants/service-area.ts`** (`AREA_SERVED_CITY_NAMES` → **`buildLocalBusinessAreaServed()`**); do not duplicate town names in prose here. **`geo`** (approximate **GeoCoordinates** for Modena area), **`knowsAbout`** (topics including services, **Mapei/Kerakoll**, **Knauf**, **Comune di Modena** building rules mention), **`priceRange`**, optional **`sameAs`** if **`publicReviewUrl`** is set in site data (Google Business Profile).
- **`address`** — `PostalAddress` is emitted **only when `site.streetAddress` is set** (`src/lib/site.ts`). It was missing entirely despite being documented here; a `LocalBusiness` without an address is not a candidate for local pack results, so filling it is a go-live blocker (see CHECKLIST §1).
- **`BreadcrumbJsonLd`** — All nine **service silos** (via `ServiceSiloContent`), plus portfolio and virtual-tour pages.

- **`FaqPageJsonLd`** — the nine **service silos** (via `ServiceSiloContent`), **`/impresa-edile-modena`**, and — since September 2026 — the **home route**. See §5 “FAQ”.

Eligibility for rich/local features remains at Google’s discretion.

---

## 5. On-page content patterns

### Homepage — `HomeLocalIntro`

- **Component** — **`src/components/sections/HomeLocalIntro.tsx`**, rendered on **`src/app/[locale]/page.tsx`** after **`StatsStrip`**, before **`Services`**.
- **Strings** — **`messages/*.json` → `HomeLocalIntro`** (`label`, `title`, **`p1`–`p4`**, `moreLabel`). Italian copy covers: **impresa edile**, **servizi edili**, **privati** and **small businesses**, **Comune di Modena** / building regulations, **territory** (Modena, Sassuolo, Carpi, Formigine), **material brands** (**Mapei**, **Kerakoll**, **Knauf** or certified equivalents), transparency on **quotes**.
- **Progressive disclosure (September 2026)** — Only **`p1`–`p2`** are on screen; **`p3`–`p4`** sit inside a native **`<details>`**. This is a **`<details>`**, not a JS toggle, on purpose: the element ships its contents in the served HTML whether open or closed, so collapsed copy is still crawled. **Do not** convert it to a state-driven mount — that is exactly the bug this replaced in `FaqSection`.

### Homepage — copy budget

The page ran ~1,180 words of body copy across eleven stacked text sections. Two changes cut what is **on screen** without cutting what is **in the HTML**:

- **`BrandEcosystemStrip` was removed.** It duplicated the `Materials` caveat ("not an official dealer, equivalents listed in the quote") in different words, four sections apart. Its **outbound manufacturer links** (Mapei, Kerakoll, Knauf, Fassa Bortolo, BTicino, Vimar) and the **`brands.*`** strings moved into **`MaterialsMarquee.tsx`** / **`messages` → `Materials`**; the duplicate prose did not survive.
- **`HomeInternalHub` dropped four of nine cards, then was merged away entirely.** `linkChiavi`, `linkElettrico`, `linkIdraulico` and `linkCartongesso` pointed at URLs the **silo grid already links two sections above** — plus the Servizi menu and the footer. Removing the second link to the same URL costs no crawl path. The four that remained then turned out to duplicate **`ProcessSteps`**: the "Da dove iniziare" cards retold the sequence the section immediately above had just walked through, and `ProcessSteps` closed with a CTA to `/preventivo` — the hub's own primary card.
- **The two are now one section** (`ProcessSteps.tsx`, anchor `#come-lavoriamo`). Steps 1 and 2 are the ones a visitor triggers, so each carries its own action link (`/prenota`, `/preventivo`); the pages that are not steps close the section as an index (`/impresa-edile-modena`, `/contatti`, + `/portfolio` when the flag is on). **Every URL the hub linked is still linked from here**, and each is in the footer besides, so no crawl path depended on the block that went away. Its strings moved into **`messages` → `ProcessSteps`** (`startLabel`, `startTitle`, `startIntro`, `link*`/`desc*`, plus `s1Action`/`s2Action`); the `HomeInternalHub` namespace is gone, as are the orphaned `cta`/`ctaLink`.

Net: ~697 words on screen, ~1,545 in the HTML (up from ~1,179 both, because of the FAQ fix below).

### Homepage — imagery

- **Manifest** — **`src/lib/media/home-imagery.ts`** maps each slug to a file in **`public/media/work/`** plus the **Pexels id** it came from (Pexels License: free commercial use, no attribution required). Stock standing in until the company's own photography exists — same arrangement as the hero video, and an open item in CHECKLIST.md.
- **`alt` is translated**, not literal: keys live under **`messages/*.json` → `HomeMedia`**, following the portfolio rule (**service + subject + place**, never a bare noun).
- **Decorative vs content** — `Services` cards use the photograph as a **ground** (26% behind a scrim, `.photo-card` in `globals.css`) and therefore pass **`alt=""`**; the nine **silo cards** and `HomeLocalIntro` show theirs at full strength and carry **real `alt` text**. Do not give an empty `alt` to a picture a visitor is meant to look at, and do not describe one they cannot see.

### Global homepage metadata

- **`messages` → `Metadata`** — **`siteTitle`** / **`siteDescription`** tuned for **Modena**, **servizi edili**, **privati/aziende**, **materiali** (Mapei, Kerakoll, equivalenti), province towns.
- **Root layout** — **`src/app/[locale]/layout.tsx`** sets default **title template** and **Open Graph** locale; per-page metadata overrides where defined.
- **Verification** — Google **site verification** meta is set on the **home** `generateMetadata` in **`src/app/[locale]/page.tsx`** (alongside **`withLocaleAlternates`** for `/`).

### FAQ

- **Data** — **`src/lib/data/faq.ts`**: **`faqByLocale.it`** / **`.en`** arrays (not in `messages` for Q/A bodies).
- **UI** — **`FaqSection`** intro from **`messages` → `FaqSection`**. Topics include: permits/CILA, **Bonus** disclaimer, timelines, **area served**, **local / “near me”** behavior (honest), **Mapei/Kerakoll/Knauf** FAQ entry, **servizi edili** scope.
- **Every answer is rendered (September 2026).** The accordion used to mount only the open panel (`{isOpen && …}`), so the served HTML carried **16 questions and 1 answer** — about **680 words** of CILA/SCIA, bonus and Modena copy that no crawler could reach, on a page whose schema is supposed to mirror it. Panels are now always in the markup and collapsed with CSS (`0fr → 1fr` grid row; `visibility` is what removes a closed panel from the accessibility tree and tab order). **Keep it that way** — hidden-but-rendered text is indexed, text that never renders is not.
- **`FAQPage` on the home route** — **`src/app/[locale]/page.tsx`** now emits **`FaqPageJsonLd`** from the same `faqByLocale` array the section renders, so the schema and the visible content match (a Google requirement). Previously only the silos and `/impresa-edile-modena` emitted it, and `/` had none despite showing the block.

### Portfolio

- **Metadata** — Per-project titles/descriptions; **`withLocaleAlternates`** on detail and virtual-tour routes.
- **Images (descriptive `alt`, include location)** — Prefer **service + title + place**, not generic words (“bagno” alone).
  - **Detail page** (`src/app/[locale]/portfolio/[slug]/page.tsx`) — Cover: **`ProjectDetail.coverAlt`** (`category`, `title`, **`location`**). Gallery: **`ProjectDetail.galleryAlt`** (`category`, `index`, `title`, **`location`**). Before/after: **`photoAltBefore`** / **`photoAltAfter`**.
  - **Listing** — Same pattern via **`FeaturedProjects.coverAlt`** in **`src/app/[locale]/portfolio/page.tsx`**.
  - **Home featured strip** — **`FeaturedProjects.coverAlt`** in **`FeaturedProjects.tsx`**.
- **Internal linking from projects** — After the project description, a block links to all three **service silos** (`SERVICE_SILO_ROUTES`). If **`location`** matches a **provincial town**, an extra line points to **bathroom silo** as the “same work in central Modena” path (**`ProjectDetail.crossSellModena`** + **`crossSellBagno`**). Town matching and **`areaServed`** city names share **`src/lib/constants/service-area.ts`** (`AREA_SERVED_CITY_NAMES`, **`shouldOfferModenaServiceLinks`**) — extend that list (and keep footer/silo copy aligned) instead of duplicating regex or schema entries.
- **Sitemap freshness** — Portfolio URLs use **`Project.updatedAt`** when set (see §1 + checklist). Adding or updating projects with **`updatedAt`** helps reflect an active service area in **`lastModified`**.

Listing page meta: **`PortfolioPage.metaTitle` / `metaDescription`**.

### Footer — “Zone servite”

- **`src/components/site/Footer.tsx`** — First nav block under the quick-links column: **`Footer.zonesTitle`** (“Zone servite” / “Areas served”), **`Footer.zonesIntro`**, then the three silo links from **`SERVICE_SILO_ROUTES`** (`linkBagno`, `linkCartongesso`, `linkTetto`). Below that, **`Footer.quick`** groups portfolio, contacts, booking, etc. **`Footer.napAreas`** (NAP-adjacent line) lists representative towns for consistency with copy/schema.

### Other

- **Hero / Services / ProcessSteps** — Copy in **`messages`**; tuned for **edilizia** / **servizi edili** / Modena province where relevant.

---

## 6. Brand, crawl, and sharing assets

- **Favicon / brand images** — All generated from **`assets/brand/logo-master.png`** by **`npm run generate:favicon`** (`scripts/generate-favicon.mjs`, **sharp** + **png-to-ico**), wired into `prebuild`: `favicon.ico` (16+32), `icon-192.png`, `icon-512.png`, `apple-icon.png`, and **`logo-mark.png`** (256px, the mark rendered in the header and footer). No **`next.config`** rewrite (direct static files).
- **`opengraph-image.tsx`** — Exports **`alt`**, **`size`**, **`width`**, **`height`**, **`contentType`** (`image/png`, 1200×630). The route is referenced **explicitly** from **`withLocaleAlternates`** (`openGraph.images` / `twitter.images`): nested `[locale]` segments did not inherit the file convention, and the proxy matcher was rewriting `/opengraph-image` → `/it/opengraph-image` (404), so **no page emitted an `og:image` at all**. Both are fixed — see the matcher exclusions in `src/proxy.ts`.
- **`manifest.ts`** — icons reference **`/icon-192.png`** and **`/icon-512.png`**, generated from `assets/brand/logo-master.png`. The master (2048², ~8 MB) is deliberately outside `public/`; it used to be served directly as the favicon and apple-touch-icon on every request.

---

## 7. Analytics & tags

- **GTM / GA** — Loaded by **`src/components/seo/Analytics.tsx`** **only after the visitor accepts** (`readConsent() === "all"`). Consent Mode v2 defaults are set `denied` in the document head before any tag can fire (`CONSENT_DEFAULTS_SNIPPET` in `src/lib/consent.ts`). Previously both loaded unconditionally from the root layout and the banner's choice was never read, so "Solo necessari" had no effect.
- **Portfolio** — Gated by **`isPortfolioEnabled()`** (`NEXT_PUBLIC_ENABLE_PORTFOLIO`). While off, `/portfolio` and project/tour routes serve `noindex, nofollow` and are excluded from the sitemap; with it on, every internal link returns. This replaces five files' worth of commented-out JSX, which hid the links from visitors but left the URLs in the sitemap.

---

## 8. Company data & CMS (Redis / admin)

- **`src/lib/validate-site-payload.ts`** — Merges Redis/admin JSON with **`staticSite`**; coalesces empty placeholders.
- **`src/lib/data/site-store.ts`** — **`getSite()`**, **`getSiteUrl()`** for runtime URL used across metadata, sitemap, robots, schema.

---

## 9. Operational checklist

1. **Env** — **`NEXT_PUBLIC_SITE_URL=https://kkedilizia.it`** in production; align **`canonicalUrl`** in admin if used. After **static marketing** content updates, bump **`NEXT_PUBLIC_SITEMAP_STATIC_LASTMOD`** (YYYY-MM-DD). Portfolio pages: set **`updatedAt`** on projects when editing in admin/API (optional field).
2. **Search Console** — Submit **`https://kkedilizia.it/sitemap.xml`**; use **URL Inspection** after changes.
3. **Google Business Profile (GBP)** — Critical for **“near me”** and Maps; fill **`publicReviewUrl`** for **`sameAs`** in JSON-LD. When you have **authentic 5-star reviews** on Google, **manually** reuse one or two short **review excerpts** (with permission / accurate quotes) in **`HomeLocalIntro`** (`messages` → `HomeLocalIntro`) or as a FAQ item in **`src/lib/data/faq.ts`** + **`FaqSection`** intro — this reinforces E-E-A-T and matches GBP, without scraping reviews automatically.
4. **Content** — Keep silo and homepage copy truthful (materials, areas); extend **`faq.ts`** as new questions repeat. When you **routinely** add work in new comuni, update **`AREA_SERVED_CITY_NAMES`** in **`src/lib/constants/service-area.ts`** (covers both JSON-LD and portfolio cross-link), and align **`Footer.napAreas`** / **`ServiceSilos.modenaArea`**.
5. **Ads** — Campaign config lives outside the repo.

---

## 10. File map (where to edit)

| Concern | Main locations |
|--------|------------------|
| Default layout metadata + title template | `src/app/[locale]/layout.tsx` |
| Home: verification + alternates for `/` | `src/app/[locale]/page.tsx` |
| Home local SEO block (`p1`–`p4`, `<details>`) | `src/components/sections/HomeLocalIntro.tsx`, `messages/*.json` → `HomeLocalIntro` |
| Home imagery + `alt` keys | `src/lib/media/home-imagery.ts`, `public/media/work/`, `messages/*.json` → `HomeMedia` |
| Photo-card / gleam CSS | `src/app/globals.css` ("Photo cards"), `src/components/decor/PhotoCardMedia.tsx` |
| Per-image tone for dimmed grounds | `scripts/compute-image-tone.mjs` → `tone` in `src/lib/media/home-imagery.ts` |
| Materials + manufacturer links | `src/components/sections/MaterialsMarquee.tsx`, `messages/*.json` → `Materials` |
| Global site title/description | `messages/*.json` → `Metadata` |
| Service silo copy + meta (incl. `modenaArea`, `complianceModena`) | `messages/*.json` → `ServiceSilos`, `HomeServiceSilos`; `src/lib/service-silo-metadata.ts`; `src/components/sections/service-silo/ServiceSiloContent.tsx` |
| Footer silos + “Zone servite” | `src/components/site/Footer.tsx`; `messages/*.json` → `Footer` |
| Portfolio detail: alt + silo cross-links | `src/app/[locale]/portfolio/[slug]/page.tsx`; `messages/*.json` → `ProjectDetail`, `FeaturedProjects` |
| Province towns + `areaServed` (single source) | `src/lib/constants/service-area.ts` (`towns.ts` re-export) |
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

*Last updated: September 2026 (rev. 3) — home copy budget: `BrandEcosystemStrip` merged into `Materials`, `HomeInternalHub` merged into `ProcessSteps`, `HomeLocalIntro` p3/p4 behind a `<details>`; **`FaqSection` now renders every answer into the HTML** (was mounting only the open one) and `/` emits `FAQPage`; home imagery in `public/media/work/` with `HomeMedia` alt keys. Previously: September 2026 — static rendering restored; `og:image` fixed; legacy 308s; consent-gated analytics; portfolio flag; `PostalAddress`; silo table corrected. Previously: April 2026 — `areaServed` + portfolio town match: **`src/lib/constants/service-area.ts`** (used by `LocalBusinessJsonLd`); GBP checklist; silo RUE/compliance; portfolio `alt`; footer “Zone servite”; sitemap lastmod; canonical/hreflang.*
