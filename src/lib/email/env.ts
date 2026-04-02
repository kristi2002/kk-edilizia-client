/** Gmail SMTP is used when both vars are set (takes priority over Resend if both exist). */
export function hasGmailEnv() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  return Boolean(user && pass);
}

export function hasResendEnv() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim(),
  );
}
