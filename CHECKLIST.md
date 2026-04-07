# Checklist: go-live e contenuti

Segna le voci man mano che le completi. I riferimenti ai file sono relativi alla root del repository.

**Aggiornamento codice (aprile 2026):** molte voci non-media sono state allineate in repository (dati statici `site.ts`, stats, stima costi, area servita unificata, test/CI, testi legali/FAQ, blocco recensioni in home). **Media** (foto portfolio, chi siamo, tour 360°, panorami) restano da caricare da parte tua.

---

## 1. `src/lib/site.ts` (priorità alta)

| Campo | Nota |
|--------|------|
| Fallback URL | Usa **`NEXT_PUBLIC_SITE_URL`** in produzione (vedi §2). |
| `legalName`, `vatId`, `fiscalCode`, `rea` | In codice: **REA `MO-444353`**, email pubblica **`info@kkedilizia.it`** — verifica con visura se serve. |
| `address` | Modena (Via Galileo Galilei) — confermare con sede reale. |
| `publicReviewUrl` | Incollare URL scheda **Google Business** per `sameAs` in JSON-LD e link contatti. |
| `insurance` / `compliance` / `certifications` | Testi tipo — adattare a SOA/realtà con consulente. |

---

## 2. Variabili d'ambiente (`.env.local` / pannello hosting)

Vedi **`.env.example`**. Non committare segreti.

- [ ] **`NEXT_PUBLIC_SITE_URL`** — URL pubblico (sitemap, Open Graph, `metadataBase`)
- [ ] **Email** moduli: `RESEND_*` **oppure** `GMAIL_*`; opz. `CONTATTI_NOTIFY_EMAIL` / `PREVENTIVO_NOTIFY_EMAIL`
- [ ] **`NEXT_PUBLIC_WHATSAPP_NUMBER`** — se assente, il pulsante non viene mostrato

---

## 3. `src/components/sections/StatsStrip.tsx`

- [ ] Numeri e **didascalie** in **`messages` → `StatsStrip`** — aggiornati con cifre più prudenti + **nota a piè** (`footnote`) per uso in pubblicità.

---

## 4. `src/lib/data/cost-estimator.ts`

- [ ] Fascia **€/m²** aggiornata nel codice + **re-seed Redis** da admin se in produzione usi ancora vecchi valori.

---

## 5. `src/lib/data/projects.ts` e portfolio

- [ ] **Media** — sostituire URL dimostrativi con foto proprie (`public/` o blob). Commento in testa al file richiama la checklist.

---

## 6. Tour virtuale 360°

- [ ] **Media** — foto equirettangolari in `public/virtual-tour/…`, config Pannellum.

---

## 7. `src/app/[locale]/chi-siamo/page.tsx`

- [ ] **Media** — foto stock; testo **`galleryFooterNote`** ricorda sostituzione immagini.

---

## 8. `src/app/[locale]/contatti/page.tsx`

- Mappa: **`ContactMap`** usa indirizzo da `getSite()` + embed Google (`NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` opzionale).

---

## 9. Metadata

- Default in **`src/app/[locale]/layout.tsx`** da **`messages` → `Metadata`**.

---

## 10. Pagine legali

- **Privacy** / **Note legali**: testo migliorato in repo; **revisione legale** consigliata prima della pubblicazione definitiva.

---

## 11. API contatti

- **`POST /api/contatti`**: invio email (cliente + ufficio) come preventivo — configurare SMTP/Resend.

---

## 12. Brand, FAQ, recensioni

- **FAQ** (`src/lib/data/faq.ts`): voce su allineamento recensioni **Google / sito**.
- **Home** (`HomeLocalIntro`): blocco **recensione** dimostrativo — sostituire con estratti reali da GBP.

---

## Comandi utili

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```

---

*Ultimo aggiornamento: aprile 2026 — allineamento repository; media e revisione legale esterna ancora a carico del titolare.*
