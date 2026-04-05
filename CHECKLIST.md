# Checklist: dati segnaposto e attività prima del go-live

Segna le voci man mano che le completi. I riferimenti ai file sono relativi alla root del repository.

---

## 1. `src/lib/site.ts` (priorità alta)

| Campo | Valore attuale / nota |
|--------|------------------------|
| Fallback URL (`getSiteUrl` senza env) | `https://kk-edilizia.example.com` → imposta **`NEXT_PUBLIC_SITE_URL`** (vedi sezione 2) |
| `legalName` | `KK Edilizia di Komini Koli` — verificare con visura |
| `vatId` | `04117840365` |
| `fiscalCode` | `KMNKLO93E12Z100X` |
| `rea` | `MO-444353` |
| `legalForm` | `Impresa individuale` (non società di capitali) |
| `address.street` | `Via Esempio 1` |
| `address.postalCode` / `city` / `province` | `20100`, `Milano`, `MI` — allineare alla sede reale |
| `email` | `info@kkedilizia.it` |
| `pec` | `kk.edilizia@legalmail.it` |
| `phoneDisplay` / `phoneTel` | `+39 376 120 1188` / `+393761201188` |
| `privacyContactName` | testo generico — eventualmente nome/cognome o ufficio |
| `publicReviewUrl` | vuoto — incollare URL scheda Google Business se si vuole il link in Contatti |
| `insurance` / `compliance` / `certifications` | testi tipo — adattare a SOA/realtà; verifica con consulente |

---

## 2. Variabili d’ambiente (`.env.local` / pannello hosting)

Vedi anche `.env.example`. Non committare segreti.

- [ ] **`NEXT_PUBLIC_SITE_URL`** — URL pubblico (sitemap, Open Graph, `metadataBase`)
- [ ] **Email preventivo** (se attivo l’invio): `RESEND_API_KEY`, `RESEND_FROM_EMAIL` **oppure** `GMAIL_USER`, `GMAIL_APP_PASSWORD`, opz. `GMAIL_FROM_NAME`
- [ ] **`PREVENTIVO_NOTIFY_EMAIL`** — opzionale (BCC in copia)
- [ ] **`NEXT_PUBLIC_WHATSAPP_NUMBER`** — solo cifre con prefisso paese (es. `393…`); se assente, il pulsante non viene mostrato

---

## 3. `src/components/sections/StatsStrip.tsx`

- [ ] Numeri **15+**, **50+**, ecc. — sostituire con dati reali se pubblicati sul sito

---

## 4. `src/lib/data/cost-estimator.ts`

- [ ] Fascia **€/m²** (min/max per categoria) — aggiornare in linea con i preventivi reali

---

## 5. `src/lib/data/projects.ts`

- [ ] Progetti portfolio (titoli, luoghi, anni, descrizioni) — esempi da sostituire con lavori reali
- [ ] **Immagini** (URL Unsplash) — sostituire con foto proprie in `public/` o URL stabili

---

## 6. Tour virtuale 360°

- [ ] **`public/virtual-tour/panoramas/living-room.jpg`** e **`stairs.jpg`** — foto demo; sostituire con equirettangolari proprie
- [ ] **`src/lib/virtual-tour/pannellum-config.ts`** — percorsi file, **pitch/yaw** hotspot, titoli scene
- [ ] Libreria Pannellum in **`public/virtual-tour/pannellum/`** — se manca dopo un clone, ricopiare da `node_modules/pannellum/build`

---

## 7. `src/app/chi-siamo/page.tsx`

- [ ] Immagini stock + didascalie “Esempio” — sostituire con foto reali
- [ ] Blocco certificazioni / SOA — completare con dati veri

---

## 8. `src/app/contatti/page.tsx`

- [ ] **Iframe mappa** (OpenStreetMap) — sostituire bbox/embed con sede reale

---

## 9. `src/app/layout.tsx`

- [ ] **Metadata** (titolo, description, Open Graph) — allineare al messaggio definitivo

---

## 10. Pagine legali (revisione professionale consigliata)

- [ ] **`src/app/privacy/page.tsx`**
- [ ] **`src/app/note-legali/page.tsx`**

---

## 11. API contatti

- [ ] **`/api/contatti`** — attualmente log lato server; estendere con invio email (come preventivo) se necessario

---

## 12. Brand e contenuti testuali

- [ ] Nome **“K.K Edilizia”** in header, footer, metadata, template email, ecc. — sostituire se il marchio è diverso
- [ ] **`src/lib/data/faq.ts`** — adattare le risposte alle policy aziendali

---

## Comandi utili

```bash
npm install
npm run dev      # sviluppo
npm run build    # verifica build produzione
```

---

*Ultimo aggiornamento: generato dal repository; integrare con consulente legale e dati di visura prima della pubblicazione.*
