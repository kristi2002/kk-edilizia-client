/** Avoid dumping Resend’s long “testing only” message; point to the real fix (verify domain). */
export function logResendError(tag: string, message: string) {
  if (
    /verify a domain|only send testing emails|your own email address/i.test(
      message,
    )
  ) {
    console.error(
      `[${tag}] Resend — To send to customers, verify your domain at https://resend.com/domains, add the DNS records, then set RESEND_FROM_EMAIL to an address @that domain. Until then Resend only delivers to your account email.`,
    );
    return;
  }
  console.error(`[${tag}] Resend:`, message);
}
