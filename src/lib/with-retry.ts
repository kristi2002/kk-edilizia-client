const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type RetryOptions = {
  /** Tentativi totali (default 3). */
  maxAttempts?: number;
  /** Ritardo base prima del secondo tentativo; cresce linearmente (default 400 ms). */
  baseDelayMs?: number;
  /** Se restituisce false, non si ritenta (es. errore di validazione). */
  shouldRetry?: (error: unknown) => boolean;
};

/**
 * Ritenta operazioni async (rete, Redis, SMTP) con backoff lineare.
 * Non sostituisce code persistenti: solo tolleranza a errori transitori.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 400;
  const shouldRetry = options?.shouldRetry ?? (() => true);

  let last: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (attempt === maxAttempts || !shouldRetry(e)) {
        throw e;
      }
      await sleep(baseDelayMs * attempt);
    }
  }
  throw last;
}
