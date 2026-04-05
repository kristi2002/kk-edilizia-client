import { z } from "zod";
import type { SiteData } from "@/lib/site";

const addressSchema = z.object({
  street: z.string(),
  postalCode: z.string(),
  city: z.string(),
  province: z.string(),
  country: z.string(),
});

export const siteSchema = z.object({
  canonicalUrl: z.string(),
  brand: z.string().min(1),
  legalName: z.string().min(1),
  vatId: z.string(),
  fiscalCode: z.string(),
  rea: z.string(),
  legalForm: z.string(),
  address: addressSchema,
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

/** Migrazione: vecchi salvataggi Redis usavano `shareCapital` (capitale / S.r.l.). */
function normalizeSitePayload(body: unknown): unknown {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return body;
  }
  const o = { ...(body as Record<string, unknown>) };
  if (typeof o.shareCapital === "string" && o.legalForm === undefined) {
    o.legalForm = o.shareCapital;
    delete o.shareCapital;
  }
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
