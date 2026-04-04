import type { z } from "zod";

/** Messaggio breve in italiano per errori di validazione salvataggio dati azienda. */
export function siteValidationMessageItalian(error: z.ZodError): string {
  const issues = error.issues;
  if (issues.length === 0) return "Dati non validi. Controlla i campi e riprova.";
  const first = issues[0];
  const path = first.path.length ? `${first.path.join(" → ")}: ` : "";
  const base = `${path}${first.message}`;
  if (issues.length === 1) return base;
  return `${base} (e altre ${issues.length - 1} segnalazioni)`;
}
