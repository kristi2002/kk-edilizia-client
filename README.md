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

## Variabili d’ambiente

Copia `.env.example` in `.env.local` nella **radice** del repo (accanto a `package.json`). Riepilogo:

- **`NEXT_PUBLIC_SITE_URL`** — URL canonico (sitemap, Open Graph, metadata).
- **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** — Google Analytics 4 (gtag); opzionale, vedi `.env.example`.
- **`NEXT_PUBLIC_GTM_ID`** — Google Tag Manager (snippet head + noscript body); opzionale.
- **Email** — invio moduli (Gmail con password app **oppure** Resend): vedi commenti in `.env.example`.
- **Redis (Upstash)** — rate limiting sulle API dei form; opzionale in dev.
- **Admin** (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) — area `/admin` (contenuti Redis, portfolio, blob); senza queste variabili l’admin non è esposta.
- **Vercel Blob** — upload immagini portfolio da admin.
- Altri flag opzionali: WhatsApp, mappa embed, cost estimate, ecc.

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
