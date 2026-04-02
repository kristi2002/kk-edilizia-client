/**
 * Dati aziendali e URL canonico: aggiorna i valori segnaposto con quelli reali
 * e imposta NEXT_PUBLIC_SITE_URL in produzione (es. https://www.tuodominio.it).
 */

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw?.trim()) return raw.replace(/\/$/, "");
  return "https://kk-edilizia.example.com";
}

export const site = {
  brand: "K.K Edilizia",
  /** Ragione sociale completa (visura / contratti) */
  legalName: "K.K Edilizia S.r.l.",
  /** Partita IVA con prefisso IT */
  vatId: "IT00000000000",
  /** Codice fiscale azienda */
  fiscalCode: "00000000000",
  /** REA */
  rea: "MO-0000000",
  /** Capitale sociale (se applicabile) */
  shareCapital: "10.000 € i.v.",
  address: {
    street: "Via Esempio 1",
    postalCode: "41121",
    city: "Modena",
    province: "MO",
    country: "Italia",
  },
  /** Area operativa descrittiva */
  serviceArea: "Modena e provincia (comuni limitrofi su valutazione)",
  serviceAreaEn: "Modena and province (neighbouring municipalities on request)",
  email: "kkedilizia@gmail.com",
  pec: "kkedilizia@pec.example.it",
  phoneDisplay: "+39 02 0000 0000",
  /** Solo cifre con prefisso internazionale per tel: e schema.org */
  phoneTel: "+390200000000",
  /** Responsabile del trattamento dati (es. legale rappresentante o titolare) */
  privacyContactName: "Titolare del trattamento — K.K Edilizia S.r.l.",
  /**
   * Link alla scheda Google Business / recensioni (opzionale).
   * Esempio: https://g.page/r/... oppure ricerca su Google Maps.
   */
  publicReviewUrl: "",

  /** Testi brevi per trust (modificare se non applicabili) */
  insurance:
    "Copertura assicurativa RC professionale per attività esercitata, in linea con quanto previsto da contratto e normativa di settore.",
  compliance:
    "Documentazione di cantiere, DPI per il personale e adempimenti previsti per coordinamento della sicurezza, in conformità alle normative vigenti. Dove richiesto, gestiamo rapporti con fornitori in regola con contributi e DURC.",
  certifications:
    "Qualificazione SOA e classifiche possono essere indicate qui se attive (categorie e importi aggiornati).",
} as const;

export function formatLegalAddress(): string {
  const a = site.address;
  return `${a.street}, ${a.postalCode} ${a.city} (${a.province}) — ${a.country}`;
}
