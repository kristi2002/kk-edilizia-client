import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { EmailAttachment } from "@/lib/form-attachments";
import type { PrenotaInput } from "@/lib/validations/prenota";
import { withRetry } from "@/lib/with-retry";
import { getGmailCredentials, hasGmailEnv, hasResendEnv } from "./env";
import { logResendError } from "./logResendError";
import {
  getEnglishDaytimeGreeting,
  getItalianDaytimeGreeting,
} from "./time-greeting";

const C = {
  brand: "#b8860b",
  brandLight: "#c9a22722",
  text: "#1a1a1a",
  muted: "#5c5c5c",
  border: "#e8e8e6",
  bg: "#f0f0ee",
  card: "#ffffff",
} as const;

const SUBJECT_CUSTOMER_IT = "Richiesta sopralluogo ricevuta – K.K Edilizia";
const SUBJECT_CUSTOMER_EN = "Site visit request received – K.K Edilizia";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rowHtml(label: string, value: string): string {
  return `<tr>
  <td style="padding:12px 16px;border-bottom:1px solid ${C.border};color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:0.06em;width:34%;vertical-align:top;">${label}</td>
  <td style="padding:12px 16px;border-bottom:1px solid ${C.border};color:${C.text};font-size:15px;vertical-align:top;">${value}</td>
</tr>`;
}

/** Email al cliente: breve ringraziamento (senza ripetere tutto il modulo). */
function buildPrenotaCustomerSimpleHtml(data: PrenotaInput): string {
  const first = escapeHtml(data.name.split(" ")[0] || data.name);
  const en = data.locale === "en";
  const enGreet = escapeHtml(getEnglishDaytimeGreeting());
  const itGreet = getItalianDaytimeGreeting();
  if (en) {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:${C.bg};font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${C.card};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <tr><td style="height:4px;background:linear-gradient(90deg,${C.brand},#ddb92e);"></td></tr>
        <tr><td style="padding:32px 28px 28px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.brand};">Thank you</p>
          <h1 style="margin:10px 0 0;font-size:22px;font-weight:700;color:${C.text};line-height:1.3;">${enGreet}, ${first}</h1>
          <p style="margin:16px 0 0;font-size:15px;line-height:1.65;color:${C.muted};">Thank you for your site visit request. We have received it and will contact you shortly to confirm the details.</p>
        </td></tr>
        <tr><td style="padding:0 28px 28px;border-top:1px solid ${C.border};">
          <p style="margin:0;font-size:13px;color:${C.muted};line-height:1.5;">Kind regards,<br><strong style="color:${C.text};">K.K Edilizia</strong></p>
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:11px;color:#888;max-width:560px;">This is an automated confirmation.</p>
    </td></tr>
  </table>
</body>
</html>`;
  }
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:${C.bg};font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${C.card};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <tr><td style="height:4px;background:linear-gradient(90deg,${C.brand},#ddb92e);"></td></tr>
        <tr><td style="padding:32px 28px 28px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.brand};">Grazie</p>
          <h1 style="margin:10px 0 0;font-size:22px;font-weight:700;color:${C.text};line-height:1.3;">${escapeHtml(itGreet)}, ${first}</h1>
          <p style="margin:16px 0 0;font-size:15px;line-height:1.65;color:${C.muted};">Abbiamo ricevuto la sua richiesta di sopralluogo. La contatteremo al più presto per concordare i dettagli.</p>
        </td></tr>
        <tr><td style="padding:0 28px 28px;border-top:1px solid ${C.border};">
          <p style="margin:0;font-size:13px;color:${C.muted};line-height:1.5;">Cordiali saluti,<br><strong style="color:${C.text};">K.K Edilizia</strong></p>
        </td></tr>
      </table>
      <p style="margin:20px 0 0;font-size:11px;color:#888;max-width:560px;">Email automatica di conferma.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildPrenotaCustomerSimpleText(data: PrenotaInput): string {
  const en = data.locale === "en";
  const hi = data.name.split(" ")[0] || data.name;
  if (en) {
    const greet = getEnglishDaytimeGreeting();
    return [
      "K.K Edilizia",
      "",
      `${greet} ${hi},`,
      "",
      "Thank you for your site visit request. We have received it and will contact you shortly.",
      "",
      "Kind regards,",
      "K.K Edilizia",
    ].join("\n");
  }
  return [
    "K.K Edilizia",
    "",
    `${getItalianDaytimeGreeting()} ${hi},`,
    "",
    "Abbiamo ricevuto la sua richiesta di sopralluogo e la contatteremo al più presto.",
    "",
    "Cordiali saluti,",
    "K.K Edilizia",
  ].join("\n");
}

function buildPrenotaOfficeHtml(
  data: PrenotaInput,
  attachments: EmailAttachment[],
): string {
  const addr = data.address?.trim() || "—";
  const notes = data.notes?.trim() || "—";
  const attRow =
    attachments.length > 0
      ? `<tr><td style="padding:0 28px 20px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">Allegati</p>
          <p style="margin:0;font-size:14px;color:${C.text};">${attachments.length} file: ${escapeHtml(attachments.map((a) => a.filename).join(", "))}</p>
        </td></tr>`
      : "";
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:${C.bg};font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${C.card};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <tr><td style="height:4px;background:${C.brand};"></td></tr>
        <tr><td style="padding:28px 28px 8px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.brand};">Notifica ufficio</p>
          <h1 style="margin:10px 0 0;font-size:20px;font-weight:700;color:${C.text};line-height:1.25;">Nuova richiesta sopralluogo (sito web)</h1>
          <p style="margin:12px 0 0;font-size:14px;color:${C.muted};">Modulo <strong>Prenota sopralluogo</strong> — Rispondi al cliente con «Rispondi».</p>
        </td></tr>
        <tr><td style="padding:8px 28px 20px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">Anagrafica</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${C.border};border-radius:12px;overflow:hidden;">
            ${rowHtml("Nome", escapeHtml(data.name))}
            ${rowHtml("Email", escapeHtml(data.email))}
            ${rowHtml("Telefono", escapeHtml(data.phone))}
            ${rowHtml("Indirizzo / luogo", escapeHtml(addr))}
          </table>
        </td></tr>
        <tr><td style="padding:0 28px 24px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">Preferenza data e ora</p>
          <div style="background:${C.brandLight};border-left:4px solid ${C.brand};border-radius:0 10px 10px 0;padding:16px 18px;font-size:15px;line-height:1.55;color:${C.text};">${escapeHtml(data.preferredSlot)}</div>
        </td></tr>
        <tr><td style="padding:0 28px 24px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">Note aggiuntive</p>
          <div style="border:1px solid ${C.border};border-radius:12px;padding:16px 18px;font-size:15px;line-height:1.55;color:${C.text};white-space:pre-wrap;">${escapeHtml(notes)}</div>
        </td></tr>
        ${attRow}
        <tr><td style="padding:0 28px 28px;background:#fafaf9;border-top:1px solid ${C.border};">
          <p style="margin:0;font-size:12px;line-height:1.55;color:#777;"><strong style="color:${C.text};">Risposta rapida:</strong> Rispondi — destinatario <strong>${escapeHtml(data.email)}</strong> (Reply-To impostato).</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildPrenotaOfficeText(
  data: PrenotaInput,
  attachments: EmailAttachment[],
): string {
  const addr = data.address?.trim() || "—";
  const notes = data.notes?.trim() || "—";
  const attLines =
    attachments.length > 0
      ? [
          "",
          "--- Allegati (vedi file in questa email) ---",
          ...attachments.map((a) => `- ${a.filename}`),
        ]
      : [];
  return [
    "[UFFICIO] Nuova richiesta sopralluogo — modulo Prenota (sito web)",
    "",
    "--- Anagrafica ---",
    `Nome:      ${data.name}`,
    `Email:     ${data.email}`,
    `Telefono:  ${data.phone}`,
    `Indirizzo: ${addr}`,
    "",
    "--- Preferenza data e ora ---",
    data.preferredSlot,
    "",
    "--- Note ---",
    notes,
    ...attLines,
    "",
    `Rispondi a questo messaggio per scrivere a: ${data.email}`,
  ].join("\n");
}

function getPrenotaNotifyEmail(): string | undefined {
  return (
    process.env.PRENOTA_NOTIFY_EMAIL?.trim() ||
    process.env.PREVENTIVO_NOTIFY_EMAIL?.trim() ||
    getGmailCredentials()?.user
  );
}

async function sendPrenotaOfficeGmail(
  transporter: nodemailer.Transporter,
  fromLine: string,
  to: string,
  data: PrenotaInput,
  attachments: EmailAttachment[],
) {
  try {
    await transporter.sendMail({
      from: fromLine,
      to,
      subject: `[Sito] Sopralluogo: ${data.name}${attachments.length ? ` (${attachments.length} allegati)` : ""}`,
      text: buildPrenotaOfficeText(data, attachments),
      html: buildPrenotaOfficeHtml(data, attachments),
      replyTo: data.email,
      attachments:
        attachments.length > 0
          ? attachments.map((a) => ({
              filename: a.filename,
              content: a.content,
              contentType: a.contentType,
            }))
          : undefined,
    });
  } catch (e) {
    console.error(
      "[prenota] Gmail: copia ufficio non inviata (il cliente potrebbe aver già ricevuto la conferma):",
      e,
    );
  }
}

async function sendViaGmail(data: PrenotaInput, attachments: EmailAttachment[]) {
  const creds = getGmailCredentials();
  if (!creds) throw new Error("EMAIL_NOT_CONFIGURED");
  const { user, pass } = creds;
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || "K.K Edilizia";
  const fromLine = `"${fromName.replace(/"/g, "")}" <${user}>`;
  const notify = getPrenotaNotifyEmail();
  const en = data.locale === "en";

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: fromLine,
    to: data.email,
    subject: en ? SUBJECT_CUSTOMER_EN : SUBJECT_CUSTOMER_IT,
    text: buildPrenotaCustomerSimpleText(data),
    html: buildPrenotaCustomerSimpleHtml(data),
    replyTo: data.email,
  });

  if (notify) {
    await sendPrenotaOfficeGmail(transporter, fromLine, notify, data, attachments);
  }
}

async function sendViaResend(data: PrenotaInput, attachments: EmailAttachment[]) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();
  const notify = getPrenotaNotifyEmail();
  const en = data.locale === "en";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: en ? SUBJECT_CUSTOMER_EN : SUBJECT_CUSTOMER_IT,
    html: buildPrenotaCustomerSimpleHtml(data),
    text: buildPrenotaCustomerSimpleText(data),
    replyTo: data.email,
  });

  if (error) {
    logResendError("prenota", error.message);
    throw new Error("EMAIL_SEND_FAILED");
  }

  if (notify) {
    try {
      const { error: errOffice } = await resend.emails.send({
        from,
        to: notify,
        subject: `[Sito] Sopralluogo: ${data.name}${attachments.length ? ` (${attachments.length} allegati)` : ""}`,
        html: buildPrenotaOfficeHtml(data, attachments),
        text: buildPrenotaOfficeText(data, attachments),
        replyTo: data.email,
        attachments:
          attachments.length > 0
            ? attachments.map((a) => ({
                filename: a.filename,
                content: a.content,
              }))
            : undefined,
      });
      if (errOffice) {
        console.error("[prenota] Resend copia ufficio:", errOffice.message);
      }
    } catch (e) {
      console.error("[prenota] Resend copia ufficio:", e);
    }
  }
}

export async function sendPrenotaConfirmation(
  data: PrenotaInput,
  attachments: EmailAttachment[] = [],
) {
  if (hasGmailEnv()) {
    try {
      await withRetry(() => sendViaGmail(data, attachments), {
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
      await withRetry(() => sendViaResend(data, attachments), {
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
