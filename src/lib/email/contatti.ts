import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { ContattiInput } from "@/lib/validations/contatti";
import { withRetry } from "@/lib/with-retry";
import { hasGmailEnv, hasResendEnv } from "./env";
import { logResendError } from "./logResendError";

const SUBJECT = "Messaggio ricevuto – K.K Edilizia";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildContattiEmailHtml(data: ContattiInput): string {
  const phone = data.phone?.trim() || "—";
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:560px;margin:0 auto;padding:24px;">
  <p style="font-size:18px;font-weight:600;">Abbiamo ricevuto il tuo messaggio</p>
  <p>Ciao ${escapeHtml(data.name.split(" ")[0] || data.name)},</p>
  <p>Grazie per averci scritto. Ti risponderemo al più presto all’indirizzo che ci hai lasciato.</p>
  <p style="margin-top:24px;font-size:14px;font-weight:600;color:#666;">Riepilogo</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:40%;">Nome</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(data.email)}</td></tr>
    <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;">Telefono</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(phone)}</td></tr>
  </table>
  <p style="margin-top:16px;font-size:14px;font-weight:600;color:#666;">Messaggio</p>
  <p style="font-size:14px;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
  <p style="margin-top:24px;font-size:14px;color:#666;">K.K Edilizia</p>
</body>
</html>`;
}

export function buildContattiEmailText(data: ContattiInput): string {
  const phone = data.phone?.trim() || "—";
  return [
    "Abbiamo ricevuto il tuo messaggio",
    "",
    `Ciao ${data.name.split(" ")[0] || data.name},`,
    "",
    "Grazie per averci scritto. Ti risponderemo al più presto.",
    "",
    "Riepilogo:",
    `- Nome: ${data.name}`,
    `- Email: ${data.email}`,
    `- Telefono: ${phone}`,
    "",
    "Messaggio:",
    data.message,
    "",
    "K.K Edilizia",
  ].join("\n");
}

function notifyAddress() {
  return (
    process.env.CONTATTI_NOTIFY_EMAIL?.trim() ||
    process.env.PREVENTIVO_NOTIFY_EMAIL?.trim()
  );
}

async function sendViaGmail(data: ContattiInput) {
  const user = process.env.GMAIL_USER!.trim();
  const pass = process.env.GMAIL_APP_PASSWORD!.trim();
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || "K.K Edilizia";
  const notify = notifyAddress();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"${fromName.replace(/"/g, "")}" <${user}>`,
    to: data.email,
    subject: SUBJECT,
    text: buildContattiEmailText(data),
    html: buildContattiEmailHtml(data),
    replyTo: data.email,
    ...(notify ? { bcc: notify } : {}),
  });
}

async function sendViaResend(data: ContattiInput) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();
  const notify = notifyAddress();

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: SUBJECT,
    html: buildContattiEmailHtml(data),
    text: buildContattiEmailText(data),
    replyTo: data.email,
    ...(notify ? { bcc: [notify] } : {}),
  });

  if (error) {
    logResendError("contatti", error.message);
    throw new Error("EMAIL_SEND_FAILED");
  }
}

export async function sendContattiConfirmation(data: ContattiInput) {
  if (hasGmailEnv()) {
    try {
      await withRetry(() => sendViaGmail(data), {
        maxAttempts: 3,
        baseDelayMs: 400,
      });
    } catch (e) {
      console.error("[contatti] Gmail SMTP:", e);
      throw new Error("EMAIL_SEND_FAILED");
    }
    return;
  }

  if (hasResendEnv()) {
    try {
      await withRetry(() => sendViaResend(data), {
        maxAttempts: 3,
        baseDelayMs: 400,
      });
    } catch (e) {
      console.error("[contatti] Resend:", e);
      throw new Error("EMAIL_SEND_FAILED");
    }
    return;
  }

  throw new Error("EMAIL_NOT_CONFIGURED");
}
