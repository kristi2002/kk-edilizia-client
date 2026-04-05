/**
 * Lanciare dopo `setError(...)` nelle azioni admin confermate da `AdminConfirmDialog`,
 * così il modale non si chiude e l’utente vede il messaggio di errore.
 */
export class AdminActionFailedError extends Error {
  constructor() {
    super("ADMIN_ACTION_FAILED");
    this.name = "AdminActionFailedError";
  }
}

/** Messaggio leggibile per risposte PUT fallite dalle route /api/admin/*. */
export function messageFromAdminPutFailure(
  status: number,
  body: { error?: string; message?: string },
): string {
  const detail = body.message?.trim();
  if (status === 401) {
    return "Sessione non valida: vai su /admin/login e accedi di nuovo.";
  }
  if (status === 503) {
    const err = body.error;
    if (err?.includes("UPSTASH") || err?.includes("mancanti")) {
      return "Redis non configurato: in .env.local servono UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN, poi riavvia «npm run dev».";
    }
    return err ?? "Servizio non disponibile.";
  }
  if (status === 400 && body.error === "invalid_payload") {
    return detail
      ? `Dati non validi. ${detail}`
      : "Dati non validi. Prova «Sincronizza da codice» e ripeti le modifiche.";
  }
  if (status === 400 && body.error === "invalid_json") {
    return "Richiesta non valida (JSON).";
  }
  if (detail) {
    return body.error
      ? `${body.error} — ${detail}`
      : detail;
  }
  return body.error ?? `Errore ${status}`;
}
