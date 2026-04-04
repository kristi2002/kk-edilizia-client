/**
 * Dati aziendali: valori predefiniti in codice; copia runtime in Redis (vedi `site-store.ts`).
 * URL canonico: `canonicalUrl` da admin, altrimenti `NEXT_PUBLIC_SITE_URL`, altrimenti esempio.
 */

export type SiteAddress = {
  street: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
};

export type SiteData = {
  /** Se valorizzato, ha priorità su NEXT_PUBLIC_SITE_URL (senza slash finale). */
  canonicalUrl: string;
  brand: string;
  legalName: string;
  vatId: string;
  fiscalCode: string;
  rea: string;
  shareCapital: string;
  address: SiteAddress;
  serviceArea: string;
  serviceAreaEn: string;
  email: string;
  pec: string;
  phoneDisplay: string;
  phoneTel: string;
  privacyContactName: string;
  publicReviewUrl: string;
  insurance: string;
  compliance: string;
  certifications: string;
};

export const staticSite: SiteData = {
  canonicalUrl: "",
  brand: "K.K Edilizia",
  legalName: "K.K Edilizia S.r.l.",
  vatId: "IT00000000000",
  fiscalCode: "00000000000",
  rea: "MO-0000000",
  shareCapital: "10.000 € i.v.",
  address: {
    street: "Via Galileo Galilei, 145",
    postalCode: "41122",
    city: "Modena",
    province: "MO",
    country: "Italia",
  },
  serviceArea: "Modena e provincia (comuni limitrofi su valutazione)",
  serviceAreaEn: "Modena and province (neighbouring municipalities on request)",
  email: "kkedilizia@gmail.com",
  pec: "kkedilizia@pec.example.it",
  phoneDisplay: "+39 02 0000 0000",
  phoneTel: "+390200000000",
  privacyContactName: "Titolare del trattamento — K.K Edilizia S.r.l.",
  publicReviewUrl: "",
  insurance:
    "Copertura assicurativa RC professionale per attività esercitata, in linea con quanto previsto da contratto e normativa di settore.",
  compliance:
    "Documentazione di cantiere, DPI per il personale e adempimenti previsti per coordinamento della sicurezza, in conformità alle normative vigenti. Dove richiesto, gestiamo rapporti con fornitori in regola con contributi e DURC.",
  certifications:
    "Qualificazione SOA e classifiche possono essere indicate qui se attive (categorie e importi aggiornati).",
};

/** URL di default se né Redis né env definiscono il dominio (solo fallback). */
export function getFallbackSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (raw?.trim()) return raw.replace(/\/$/, "");
  return "https://kk-edilizia.example.com";
}

export function formatLegalAddress(site: SiteData): string {
  const a = site.address;
  return `${a.street}, ${a.postalCode} ${a.city} (${a.province}) — ${a.country}`;
}
