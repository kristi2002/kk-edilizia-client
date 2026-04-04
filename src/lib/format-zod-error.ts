import type { ZodError } from "zod";

/** Compatta errori Zod per messaggi API / admin (una riga leggibile). */
export function formatZodIssues(err: ZodError): string {
  return err.issues
    .map((i) => `${i.path.length ? i.path.join(".") : "root"}: ${i.message}`)
    .join(" · ");
}
