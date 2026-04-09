import { z } from "zod";
import { staticSite, type SiteData } from "@/lib/site";

export const siteSchema = z.object({
  canonicalUrl: z.string(),
  brand: z.string().min(1),
  legalName: z.string().min(1),
  vatId: z.string(),
  fiscalCode: z.string(),
  rea: z.string(),
  legalForm: z.string(),
  vatEu: z.string(),
  numberOfEmployees: z.number().int().min(0),
  serviceArea: z.string(),
  serviceAreaEn: z.string(),
  email: z.string().min(1),
  pec: z.string(),
  phoneDisplay: z.string(),
  phoneTel: z.string(),
  privacyContactName: z.string(),
  publicReviewUrl: z.string(),
  insurance: z.string(),
  compliance: z.string(),
  certifications: z.string(),
});

/**
 * Redis/admin a volte salvano stringhe vuote: non devono sovrascrivere i default in codice.
 */
/** Cifre normalizzate per confronto telefoni (es. placeholder Milano 02 0000 0000). */
function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

function isPlaceholderPhoneDisplay(v: string): boolean {
  const t = v.trim();
  if (!t) return true;
  if (/02\s*0000\s*0000/.test(t)) return true;
  if (/^\+?39\s*02\s*0000/i.test(t)) return true;
  const d = digitsOnly(t);
  return d === "390200000000" || d === "0200000000" || d === "39200000000";
}

function isPlaceholderPhoneTel(v: string): boolean {
  const d = digitsOnly(v);
  return d === "390200000000" || d === "0200000000" || d === "39200000000";
}

function isPlaceholderVatId(v: string): boolean {
  const t = v.trim().toUpperCase().replace(/^IT/i, "");
  return /^0{11}$/.test(t);
}

function isPlaceholderFiscalCode(v: string): boolean {
  const t = v.trim().toUpperCase();
  return /^[0OX]{11}$/.test(t) || /^0{11}$/.test(t);
}

function isPlaceholderPec(v: string): boolean {
  const t = v.trim().toLowerCase();
  if (!t) return true;
  return (
    t.includes("example.it") ||
    t.includes("pec.example") ||
    /@(?:test|fake|dummy)\./i.test(t)
  );
}

function isPlaceholderRea(v: string): boolean {
  const t = v.trim().toUpperCase();
  return /^[A-Z]{0,2}-?0{6,}$/.test(t) || /^0{6,}$/.test(t);
}

/** Nome società da template (es. S.r.l.) non allineato all’impresa reale in staticSite. */
function isPlaceholderLegalName(v: string): boolean {
  const t = v.trim();
  if (!t) return true;
  if (/S\.?\s*r\.?\s*l\.?/i.test(t) && /K\.?\s*K\.?\s*Edilizia/i.test(t)) return true;
  return false;
}

/**
 * Redis può contenere valori di esempio non vuoti (02 0000 0000, P.IVA fittizia, PEC example.it):
 * in quel caso si ripristinano i default in codice.
 */
function coalescePlaceholderWithStatic(
  o: Record<string, unknown>,
  base: Record<string, unknown>,
): void {
  const phoneD = typeof o.phoneDisplay === "string" ? o.phoneDisplay : "";
  const phoneT = typeof o.phoneTel === "string" ? o.phoneTel : "";
  if (isPlaceholderPhoneDisplay(phoneD) || isPlaceholderPhoneTel(phoneT)) {
    o.phoneDisplay = base.phoneDisplay;
    o.phoneTel = base.phoneTel;
  }

  if (typeof o.pec === "string" && isPlaceholderPec(o.pec)) {
    o.pec = base.pec;
  }
  if (typeof o.vatId === "string" && isPlaceholderVatId(o.vatId)) {
    o.vatId = base.vatId;
  }
  if (typeof o.fiscalCode === "string" && isPlaceholderFiscalCode(o.fiscalCode)) {
    o.fiscalCode = base.fiscalCode;
  }
  if (typeof o.rea === "string" && isPlaceholderRea(o.rea)) {
    o.rea = base.rea;
  }
  if (typeof o.legalName === "string" && isPlaceholderLegalName(o.legalName)) {
    o.legalName = base.legalName;
  }
}

function coalesceEmptyWithStatic(
  o: Record<string, unknown>,
  base: Record<string, unknown>,
): void {
  for (const key of Object.keys(base)) {
    const bv = base[key];
    const ov = o[key];
    if (typeof bv === "string") {
      if (ov == null || (typeof ov === "string" && ov.trim() === "")) {
        o[key] = bv;
      }
    } else if (typeof bv === "number") {
      if (typeof ov !== "number" || Number.isNaN(ov) || ov < 0) {
        o[key] = bv;
      }
    }
  }
}

/** Migrazione: vecchi salvataggi Redis; merge con `staticSite` per chiavi mancanti. */
function normalizeSitePayload(body: unknown): unknown {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return body;
  }
  const incoming = body as Record<string, unknown>;
  const base = staticSite as unknown as Record<string, unknown>;
  const o = { ...base, ...incoming };
  if (typeof o.shareCapital === "string" && o.legalForm === undefined) {
    o.legalForm = o.shareCapital;
    delete o.shareCapital;
  }
  coalesceEmptyWithStatic(o, base);
  coalescePlaceholderWithStatic(o, base);
  return o;
}

export function parseSitePayload(body: unknown): SiteData {
  return siteSchema.parse(normalizeSitePayload(body)) as SiteData;
}

/** Lettura da Redis: accetta solo oggetti che rispettano lo schema. */
export function tryParseStoredSite(body: unknown): SiteData | null {
  const r = siteSchema.safeParse(normalizeSitePayload(body));
  return r.success ? (r.data as SiteData) : null;
}
