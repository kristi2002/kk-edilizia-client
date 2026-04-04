/**
 * Credenziali Gmail per SMTP.
 * La password per le app va incollata senza spazi; se Google la mostra "xxxx xxxx xxxx xxxx", togliamo gli spazi qui.
 */
export function getGmailCredentials(): { user: string; pass: string } | null {
  const user = process.env.GMAIL_USER?.trim();
  const raw = process.env.GMAIL_APP_PASSWORD?.trim();
  if (!user || !raw) return null;
  const pass = raw.replace(/\s/g, "");
  if (!pass) return null;
  return { user, pass };
}

/** Gmail SMTP è usato se user + password per le app sono valorizzati (ha priorità su Resend). */
export function hasGmailEnv() {
  return getGmailCredentials() !== null;
}

export function hasResendEnv() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim(),
  );
}
