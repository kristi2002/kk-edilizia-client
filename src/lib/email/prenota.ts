import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { PrenotaInput } from "@/lib/validations/prenota";
import { withRetry } from "@/lib/with-retry";
import { hasGmailEnv, hasResendEnv } from "./env";
import { logResendError } from "./logResendError";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:40%;">${escapeHtml(label)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(value)}</td></tr>`;
}

function buildHtmlIt(data: PrenotaInput) {
  const addr = data.address?.trim() || "—";
  const notes = data.notes?.trim() || "—";
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:560px;margin:0 auto;padding:24px;">
  <p style="font-size:18px;font-weight:600;">Richiesta di sopralluogo ricevuta</p>
  <p>Ciao ${escapeHtml(data.name.split(" ")[0] || data.name)},</p>
  <p>Abbiamo ricevuto la tua richiesta di sopralluogo. Ti contatteremo al più presto per concordare data e ora.</p>
  <p style="margin-top:24px;font-size:14px;font-weight:600;color:#666;">Riepilogo</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${row("Nome", data.name)}
    ${row("Email", data.email)}
    ${row("Telefono", data.phone)}
    ${row("Indirizzo / luogo intervento", addr)}
    ${row("Preferenze data/ora", data.preferredSlot)}
    ${row("Note", notes)}
  </table>
  <p style="margin-top:24px;font-size:14px;color:#666;">K.K Edilizia</p>
</body>
</html>`;
}

function buildTextIt(data: PrenotaInput) {
  const addr = data.address?.trim() || "—";
  const notes = data.notes?.trim() || "—";
  return [
    "Richiesta di sopralluogo ricevuta",
    "",
    `Ciao ${data.name.split(" ")[0] || data.name},`,
    "",
    "Abbiamo ricevuto la tua richiesta di sopralluogo. Ti contatteremo al più presto per concordare data e ora.",
    "",
    "Riepilogo:",
    `- Nome: ${data.name}`,
    `- Email: ${data.email}`,
    `- Telefono: ${data.phone}`,
    `- Indirizzo: ${addr}`,
    `- Preferenze data/ora: ${data.preferredSlot}`,
    `- Note: ${notes}`,
    "",
    "K.K Edilizia",
  ].join("\n");
}

function buildHtmlEn(data: PrenotaInput) {
  const addr = data.address?.trim() || "—";
  const notes = data.notes?.trim() || "—";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:560px;margin:0 auto;padding:24px;">
  <p style="font-size:18px;font-weight:600;">Site visit request received</p>
  <p>Hi ${escapeHtml(data.name.split(" ")[0] || data.name)},</p>
  <p>We’ve received your site visit request. We’ll get back to you shortly to agree on a date and time.</p>
  <p style="margin-top:24px;font-size:14px;font-weight:600;color:#666;">Summary</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${row("Name", data.name)}
    ${row("Email", data.email)}
    ${row("Phone", data.phone)}
    ${row("Address / job site", addr)}
    ${row("Preferred date/time", data.preferredSlot)}
    ${row("Notes", notes)}
  </table>
  <p style="margin-top:24px;font-size:14px;color:#666;">K.K Edilizia</p>
</body>
</html>`;
}

function buildTextEn(data: PrenotaInput) {
  const addr = data.address?.trim() || "—";
  const notes = data.notes?.trim() || "—";
  return [
    "Site visit request received",
    "",
    `Hi ${data.name.split(" ")[0] || data.name},`,
    "",
    "We’ve received your site visit request. We’ll get back to you shortly to agree on a date and time.",
    "",
    "Summary:",
    `- Name: ${data.name}`,
    `- Email: ${data.email}`,
    `- Phone: ${data.phone}`,
    `- Address: ${addr}`,
    `- Preferred date/time: ${data.preferredSlot}`,
    `- Notes: ${notes}`,
    "",
    "K.K Edilizia",
  ].join("\n");
}

const SUBJECT_IT = "Richiesta sopralluogo ricevuta – K.K Edilizia";
const SUBJECT_EN = "Site visit request received – K.K Edilizia";

async function sendViaGmail(data: PrenotaInput) {
  const user = process.env.GMAIL_USER!.trim();
  const pass = process.env.GMAIL_APP_PASSWORD!.trim();
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || "K.K Edilizia";
  const notify =
    process.env.PRENOTA_NOTIFY_EMAIL?.trim() ||
    process.env.PREVENTIVO_NOTIFY_EMAIL?.trim();

  const en = data.locale === "en";
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"${fromName.replace(/"/g, "")}" <${user}>`,
    to: data.email,
    subject: en ? SUBJECT_EN : SUBJECT_IT,
    text: en ? buildTextEn(data) : buildTextIt(data),
    html: en ? buildHtmlEn(data) : buildHtmlIt(data),
    replyTo: data.email,
    ...(notify ? { bcc: notify } : {}),
  });
}

async function sendViaResend(data: PrenotaInput) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();
  const notify =
    process.env.PRENOTA_NOTIFY_EMAIL?.trim() ||
    process.env.PREVENTIVO_NOTIFY_EMAIL?.trim();

  const en = data.locale === "en";
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: en ? SUBJECT_EN : SUBJECT_IT,
    html: en ? buildHtmlEn(data) : buildHtmlIt(data),
    text: en ? buildTextEn(data) : buildTextIt(data),
    replyTo: data.email,
    ...(notify ? { bcc: [notify] } : {}),
  });

  if (error) {
    logResendError("prenota", error.message);
    throw new Error("EMAIL_SEND_FAILED");
  }
}

export async function sendPrenotaConfirmation(data: PrenotaInput) {
  if (hasGmailEnv()) {
    try {
      await withRetry(() => sendViaGmail(data), {
        maxAttempts: 3,
        baseDelayMs: 400,
      });
    } catch (e) {
      console.error("[prenota] Gmail SMTP:", e);
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
      console.error("[prenota] Resend:", e);
      throw new Error("EMAIL_SEND_FAILED");
    }
    return;
  }

  throw new Error("EMAIL_NOT_CONFIGURED");
}
