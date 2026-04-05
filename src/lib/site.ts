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
  /** Forma giuridica (es. impresa individuale); non capitale sociale. */
  legalForm: string;
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
  legalName: "KK Edilizia di Komini Koli",
  vatId: "04117840365",
  fiscalCode: "KMNKLO93E12Z100X",
  rea: "MO-444353",
  legalForm: "Impresa individuale",
  address: {
    street: "Via Galileo Galilei, 145",
    postalCode: "41126",
    city: "Modena",
    province: "MO",
    country: "Italia",
  },
  serviceArea: "Modena e provincia (comuni limitrofi su valutazione)",
  serviceAreaEn: "Modena and province (neighbouring municipalities on request)",
  email: "kkedilizia@gmail.com",
  pec: "kk.edilizia@legalmail.it",
  phoneDisplay: "+39 376 120 1188",
  phoneTel: "+393761201188",
  privacyContactName: "Titolare del trattamento — KK Edilizia di Komini Koli",
  publicReviewUrl: "",
  insurance:
    "Copertura assicurativa RC professionale per attività esercitata, in linea con quanto previsto da contratto e normativa di settore.",
  compliance:
    "Documentazione di cantiere, DPI per il personale e adempimenti previsti per coordinamento della sicurezza, in conformità alle normative vigenti. Dove richiesto, gestiamo rapporti con fornitori in regola con contributi e DURC.",
  certifications:
    "Qualificazione SOA e classifiche possono essere indicate qui se attive (categorie e importi aggiornati).",
};

/** Fallback in codice quando mancano env e canonical (admin: sostituito con origine richiesta se possibile). */
export const PLACEHOLDER_PUBLIC_SITE_URL = "https://kk-edilizia.example.com";

/**
 * Garantisce protocollo assoluto per `href` (evita link relativi tipo `www...` che non aprono nulla).
 * Localhost / 127.0.0.1 → `http://`
 */
export function normalizePublicSiteUrl(url: string): string {
  const t = url.trim();
  if (!t) return PLACEHOLDER_PUBLIC_SITE_URL;
  if (/^https?:\/\//i.test(t)) {
    return t.replace(/\/$/, "");
  }
  const lower = t.toLowerCase();
  if (
    lower.startsWith("localhost") ||
    lower.startsWith("127.0.0.1") ||
    lower.startsWith("[::1]")
  ) {
    return `http://${t.replace(/\/$/, "")}`;
  }
  return `https://${t.replace(/\/$/, "")}`;
}

/** URL di default se né Redis né env definiscono il dominio (solo fallback). */
export function getFallbackSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return normalizePublicSiteUrl(raw);
  return PLACEHOLDER_PUBLIC_SITE_URL;
}

export function formatLegalAddress(site: SiteData): string {
  const a = site.address;
  return `${a.street}, ${a.postalCode} ${a.city} (${a.province}) — ${a.country}`;
}
