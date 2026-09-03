# Checklist: go-live e contenuti

Segna le voci man mano che le completi. I riferimenti ai file sono relativi alla root del repository.

**Aggiornamento codice (settembre 2026):** rimediati i problemi emersi dalla perizia tecnica — rendering statico ripristinato, `og:image`, redirect 301/308 legacy, consenso cookie effettivo, sessione admin con scadenza, contrasto WCAG AA, favicon (da 8,1 MB a 5 kB), menu Servizi, template silo ridisegnato. **Rimosso** il blocco recensioni dimostrative dalla home.

**Restano a carico tuo:** i **media** (foto portfolio, chi siamo, tour 360°, panorami, video hero) e i **dati verificabili** elencati sotto.

---

## 1. `src/lib/site.ts` (priorità alta)

| Campo | Nota |
|--------|------|
| Fallback URL | Usa **`NEXT_PUBLIC_SITE_URL`** in produzione (vedi §2). |
| `legalName`, `vatId`, `fiscalCode`, `rea` | In codice: **REA `MO-444353`**, email pubblica **`info@kkedilizia.it`** — verifica con visura se serve. |
| `streetAddress`, `postalCode`, `addressLocality`, `addressRegion` | **Vuoti in codice.** Finché `streetAddress` è vuoto, il JSON-LD **non** emette `PostalAddress` e il footer non mostra l’indirizzo: senza indirizzo l’attività non è candidabile ai risultati locali. Compilare da visura, allineato alla scheda Google Business. |
| `publicReviewUrl` | Incollare URL scheda **Google Business** per `sameAs` in JSON-LD e link contatti. |
| `insurance` / `compliance` / `certifications` | Testi tipo — adattare a SOA/realtà con consulente. |

---

## 2. Variabili d'ambiente (`.env.local` / pannello hosting)

Vedi **`.env.example`**. Non committare segreti.

- [ ] **`NEXT_PUBLIC_SITE_URL`** — URL pubblico (sitemap, Open Graph, `metadataBase`)
- [ ] **Email** moduli: `RESEND_*` **oppure** `GMAIL_*`; opz. `CONTATTI_NOTIFY_EMAIL` / `PREVENTIVO_NOTIFY_EMAIL`
- [ ] **`NEXT_PUBLIC_WHATSAPP_NUMBER`** — se assente, il pulsante non viene mostrato

---

## 3. `src/components/sections/StatsStrip.tsx` — numeri (priorità alta)

- [ ] **Verificare `v1`–`v4` in `messages` → `StatsStrip`.** Sono la **sola fonte** delle cifre: l’hero legge le stesse chiavi (prima erano hardcoded a `15+` / `120+` e contraddicevano la strip a 800 px di distanza).
- La `footnote` che dichiarava le cifre come indicative è stata rimossa: era una nota interna pubblicata ai clienti. **Non pubblicare numeri che non puoi documentare.**

---

## 4. `src/lib/data/cost-estimator.ts`

- [ ] Fascia **€/m²** aggiornata nel codice + **re-seed Redis** da admin se in produzione usi ancora vecchi valori.

---

## 5. `src/lib/data/projects.ts` e portfolio

- Il portfolio è dietro il flag **`NEXT_PUBLIC_ENABLE_PORTFOLIO`** (default: off). Con il flag spento le pagine sono `noindex, nofollow` ed escluse dalla sitemap; accendendolo tornano tutti i link interni (header, footer, home, hero).
- [ ] **Media** — sostituire URL dimostrativi con foto proprie (`public/` o blob), poi **accendere il flag**.
- Tutti gli hotlink a `images.unsplash.com` sono stati rimossi dall’hero e da `chi-siamo`; restano solo in `projects.ts` (dati dimostrativi, non indicizzati).

---

## 6. Tour virtuale 360°

- [ ] **Media** — foto equirettangolari in `public/virtual-tour/projects/<slug>/`, config Pannellum. (`public/virtual-tour/panoramas/` conteneva copie duplicate non referenziate: rimosso.)

---

## 6-bis. Video hero (opzionale, consigliato)

Il codice è già pronto in **`src/components/sections/HeroBackgroundLayers.tsx`**: valorizza `HERO_MEDIA` e i file compaiono.

- [ ] `public/media/hero-poster.jpg` — **deve essere il primo fotogramma del video**, così l’immagine ferma “si mette in movimento” senza stacco.
- [ ] `public/media/hero.webm` (VP9, 1280×720, 8–12 s, senza audio, **< 2,5 MB**) + `public/media/hero.mp4` (H.264) come fallback.
- Il poster resta l’elemento LCP, il video ha `preload="none"` e viene saltato con `prefers-reduced-motion` o `saveData`.

---

## 6-ter. Foto della home (settembre 2026)

La home ha ora **14 fotografie** in **`public/media/work/`**, indicizzate da **`src/lib/media/home-imagery.ts`** (slug → file + id Pexels di origine). Sono **stock su licenza Pexels** (uso commerciale libero, senza attribuzione): stanno lì **al posto** delle foto aziendali, esattamente come il video dell’hero.

Scelta deliberata: **solo materiali, dettagli e lavorazioni, nessun volto riconoscibile**. Una foto stock di un operaio identificabile sul sito di un’impresa suggerisce che quella persona ci lavori — e non è un’affermazione che possiamo fare.

- [ ] **Sostituire con foto proprie** — stesso percorso, taglio **3:2** (~1200×800). Non serve toccare altro: i componenti leggono il manifest.
- [ ] **Dopo la sostituzione, ricalcolare il tono:** `node scripts/compute-image-tone.mjs work` (il set è un argomento: `work` per la home, `about` per chi siamo), poi incollare i valori `tone` in `src/lib/media/home-imagery.ts`. Serve solo alle 4 card di `Services`, dove la foto sta **sotto** un velo bianco: una foto già chiara (i disegni di progetto erano luma 205 su 255) lì sparisce del tutto, mentre una scura resta leggibile. Lo script riporta ogni immagine verso lo stesso tono medio.
- [ ] **Aggiornare gli `alt`** in **`messages/*.json` → `HomeMedia`** (IT **e** EN): sono testo indicizzabile, quindi **servizio + soggetto + luogo**, non “bagno” e basta.
- Le 4 card di `Services` usano la foto come **sfondo** (`alt=""`, decorativa); le 9 card dei silos e `HomeLocalIntro` la mostrano **in chiaro** e hanno `alt` reale.

---

## 7. `src/app/[locale]/chi-siamo/page.tsx`

La pagina è stata rifatta (settembre 2026): non è più una colonna di testo con due riquadri vuoti, ma nove sezioni — hero scuro, numeri, manifesto, banda con citazione, quattro pilastri, territorio, mosaico dei cantieri, garanzie, CTA. I componenti stanno in **`src/components/sections/about/`**.

**17 fotografie** in **`public/media/about/`**, indicizzate da **`src/lib/media/about-imagery.ts`**. Stock Pexels come per la home, ma **set separato**: nessuna immagine è condivisa con `/`, così chi passa dalla home a `/chi-siamo` non rivede le stesse foto. Stessa regola di sempre: materiali e lavorazioni, **nessun volto riconoscibile**. Tre scatti sono di Modena (skyline con la Ghirlandina, portici, torre): sono le uniche immagini del sito che affermano un *luogo* invece di un lavoro, ed è un'affermazione che possiamo fare.

- [ ] **Sostituire con foto proprie** — stessi percorsi. **I tagli non sono uniformi**: l'hero è 16:9, la banda 21:9, due verticali 4:5, un inserto 1:1, il resto 3:2 (~1200×800). Il rapporto di ogni file è annotato nel manifest; cambiarlo fa comparire bande nere.
- [ ] **Dopo la sostituzione:** `node scripts/compute-image-tone.mjs about` e incollare i `tone` nel manifest. Serve **solo** alle 4 card dei pilastri, le uniche con la foto sotto un velo.
- [ ] **Aggiornare gli `alt`** in `messages/*.json` → **`AboutMedia`** (IT **e** EN).
- [x] ~~Testo `galleryFooterNote`~~ — la vecchia copia della galleria era rivolta a chi mantiene il repository ("carica i file in `public/images/` e aggiorna i percorsi in `chi-siamo/page.tsx`") ed era **stampata ai visitatori** in entrambe le lingue. Sostituita da `galleryNote`, che dichiara onestamente che sono immagini di riferimento su licenza Pexels e non cantieri nostri.
- [ ] **Categorie SOA e qualificazioni** — si aggiornano in **`site.certifications`** (`src/lib/site.ts` o pannello admin), non nei messaggi. Anche qui la vecchia `certificationsHint` mostrava ai visitatori l'istruzione "aggiorna questo testo con categorie SOA reali": rimossa, il pannello ora rende solo il dato.
- [ ] **`site.insurance` / `site.compliance` / `site.certifications` sono monolingua**: la versione EN della pagina li mostra in italiano. Servono campi EN nel record azienda se `/en` deve essere completo.

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
- **Recensioni rimosse.** Il blocco `ReviewsStrip` e la citazione in `HomeLocalIntro` erano testi inventati la cui stessa copy li dichiarava dimostrativi. Quando avrai recensioni reali su Google Business, reintroduci **citazioni verbatim** con link alla scheda.
- [ ] **`publicReviewUrl`** in `site.ts` / admin: abilita il link “Recensioni su Google” nel footer e `sameAs` nel JSON-LD.

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

*Ultimo aggiornamento: settembre 2026 (rev. 2) — home alleggerita: copy a schermo da ~1.180 a ~700 parole senza perdere testo indicizzabile (anzi, +366: la FAQ ora rende **tutte** le risposte nell’HTML e `/` emette `FAQPage`); `BrandEcosystemStrip` accorpato in `Materials`; 14 foto in `public/media/work/` (§6-ter). Precedente: settembre 2026 — rimedi perizia tecnica; media, indirizzo, numeri e revisione legale ancora a carico del titolare. Precedente: aprile 2026 — allineamento repository; media e revisione legale esterna ancora a carico del titolare.*
