# K.K Edilizia — sito web (client)

Sito vetrina per **K.K Edilizia** (ristrutturazioni e lavori edili a Modena e provincia): portfolio, contatti, preventivo online, stima costi (opzionale), tour virtuali 360°. Stack **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4**, internazionalizzazione **IT / EN** con [next-intl](https://next-intl.dev).

## Requisiti

- Node.js 20+ (consigliato LTS)
- npm (o pnpm/yarn)

## Avvio in locale

```bash
npm install
cp .env.example .env.local
# Modifica .env.local con URL sito, email, Redis, ecc. (vedi sotto)
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000). Il dev server usa Webpack (`npm run dev`); per provare Turbopack: `npm run dev:turbo`.

## Script

| Comando | Descrizione |
|--------|-------------|
| `npm run dev` | Server di sviluppo (Webpack) |
| `npm run dev:turbo` | Server di sviluppo (Turbopack) |
| `npm run build` | Build di produzione |
| `npm run start` | Avvia la build (`next start`) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (unit tests) |

## CI

Su GitHub, il workflow **`.github/workflows/ci.yml`** esegue `lint`, `test` e `build` su push/PR verso `main` o `master`.

## Operazioni e backup

Vedi **`docs/OPERATIONS.md`** (env, Redis, Google Business, Sentry opzionale).

## Variabili d’ambiente

Copia `.env.example` in `.env.local` nella **radice** del repo (accanto a `package.json`). Riepilogo:

- **`NEXT_PUBLIC_SITE_URL`** — URL canonico (sitemap, Open Graph, metadata).
- **`NEXT_PUBLIC_GTM_ID`** — Google Tag Manager; con GTM attivo il gtag GA4 diretto non viene caricato (configura GA4 nel container).
- **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** — GA4 solo senza GTM, vedi `.env.example`.
- **Email** — invio moduli (Gmail con password app **oppure** Resend): vedi commenti in `.env.example`.
- **Redis (Upstash)** — rate limiting sulle API dei form; opzionale in dev.
- **Admin** (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) — area `/admin` (contenuti Redis, portfolio, blob); senza queste variabili l’admin non è esposta.
- **Vercel Blob** — upload immagini portfolio da admin.
- **`NEXT_PUBLIC_ENABLE_PORTFOLIO`** — `true` pubblica portfolio, schede progetto e tour 360° (link interni + sitemap). Con il flag spento quelle pagine sono `noindex` ed escluse dalla sitemap: tenerlo off finché non ci sono foto proprie.
- **`NEXT_PUBLIC_ENABLE_COST_ESTIMATE`** — `true` pubblica `/stima-costi` e il teaser in home.
- Altri flag opzionali: WhatsApp, mappa embed, ecc.

## Cookie e analytics

GTM / GA4 vengono caricati **solo dopo consenso esplicito** (`src/components/seo/Analytics.tsx`). I default Consent Mode v2 sono `denied` e vengono impostati nel `<head>` prima di qualsiasi tag (`src/lib/consent.ts`). Se cambi il testo del banner, verifica che descriva quello che accade davvero.

## Immagini di brand

Il master del logo sta in **`assets/brand/logo-master.png`** (fuori da `public/`). `npm run generate:brand` — eseguito da `prebuild` — ritaglia il fondo crema del master e genera `favicon.ico`, `icon-192.png`, `icon-512.png`, `apple-icon.png`, `logo-mark.png` e le due mappe WebGL in `public/media/logo/`. Non mettere il master in `public/`: veniva servito come favicon a ogni richiesta.

Dettaglio e valori di esempio sono documentati in **`.env.example`**.

## Struttura (indicativa)

- `src/app/[locale]/` — pagine pubbliche (home, contatti, preventivo, portfolio, …) e metadata per locale.
- `src/app/api/` — route handler (form, admin, upload).
- `src/app/admin/` — pannello amministrazione (non linkato nel sito pubblico).
- `messages/` — stringhe IT/EN per next-intl.
- `src/components/` — UI e sezioni riutilizzabili.
- `src/lib/` — dati, validazioni, email, integrazioni.

## Deploy

Progetto pensato per **Vercel** (Analytics incluso in `layout`). Imposta le stesse variabili in Project Settings → Environment Variables e collega il dominio.

## Licenza

Repository privato; diritti riservati al titolare del progetto.
