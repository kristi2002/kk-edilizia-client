/** Primo messaggio da `flatten().fieldErrors` restituito dalle API dei moduli. */
export function firstServerFieldError(
  errors: Record<string, string[] | undefined> | undefined,
): string | null {
  if (!errors) return null;
  for (const msgs of Object.values(errors)) {
    if (Array.isArray(msgs) && msgs[0]) return msgs[0];
  }
  return null;
}
