import { z } from "zod";

const HONEYPOT_IT =
  "Invio bloccato: un campo nascosto risulta compilato (spesso per un’estensione del browser o l’autocompilazione). Prova in incognito o disattiva l’autofill per questo sito.";

const HONEYPOT_EN =
  "Submission blocked: a hidden field was filled (often by a browser extension or autofill). Try incognito or disable autofill for this site.";

/** Honeypot: must be empty (bot o estensione che compilano campi nascosti). */
export function createHoneypotFieldSchema(message: string) {
  return z
    .string()
    .optional()
    .refine((s) => (s ?? "").length === 0, { message });
}

/** Default IT copy (preventivo, prenota). */
export const honeypotFieldSchema = createHoneypotFieldSchema(HONEYPOT_IT);

export const honeypotMessages = { it: HONEYPOT_IT, en: HONEYPOT_EN } as const;

export function httpUrlCount(s: string): number {
  return (s.match(/https?:\/\//gi) ?? []).length;
}
