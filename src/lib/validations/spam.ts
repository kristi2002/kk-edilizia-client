import { z } from "zod";

/** Honeypot: must be empty (bot o estensione che compilano campi nascosti). */
export const honeypotFieldSchema = z
  .string()
  .optional()
  .refine((s) => (s ?? "").length === 0, {
    message:
      "Invio bloccato: un campo nascosto risulta compilato (spesso per un’estensione del browser o l’autocompilazione). Prova in incognito o disattiva l’autofill per questo sito.",
  });

export function httpUrlCount(s: string): number {
  return (s.match(/https?:\/\//gi) ?? []).length;
}
