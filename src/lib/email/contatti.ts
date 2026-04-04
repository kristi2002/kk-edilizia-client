import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { ContattiInput } from "@/lib/validations/contatti";
import type { EmailAttachment } from "@/lib/form-attachments";
import { withRetry } from "@/lib/with-retry";
import { getGmailCredentials, hasGmailEnv, hasResendEnv } from "./env";
import { logResendError } from "./logResendError";
import {
  getEnglishDaytimeGreeting,
  getItalianDaytimeGreeting,
} from "./time-greeting";

const SUBJECT_CUSTOMER_IT = "Messaggio ricevuto – K.K Edilizia";
const SUBJECT_CUSTOMER_EN = "Message received – K.K Edilizia";

/** Stili inline (compatibili con la maggior parte dei client email). */
const C = {
  brand: "#b8860b",
  brandLight: "#c9a22722",
  text: "#1a1a1a",
  muted: "#5c5c5c",
  border: "#e8e8e6",
  bg: "#f0f0ee",
  card: "#ffffff",
} as const;

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

/**
 * Destinatario per copia ufficio: esplicita in env, altrimenti l’account Gmail usato per l’invio.
 * Così kkedilizia@gmail.com riceve i dati senza dover ricordare CONTATTI_NOTIFY_EMAIL.
 */
export function getContattiOfficeNotifyEmail(): string | undefined {
  const explicit =
    process.env.CONTATTI_NOTIFY_EMAIL?.trim() ||
    process.env.PREVENTIVO_NOTIFY_EMAIL?.trim();
  if (explicit) return explicit;
  return getGmailCredentials()?.user;
}

/** Email al cliente: breve ringraziamento professionale (senza ripetere tutto il modulo). */
function buildContattiCustomerSimpleHtml(data: ContattiInput): string {
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
          <p style="margin:16px 0 0;font-size:15px;line-height:1.65;color:${C.muted};">Thank you for contacting K.K Edilizia. We have received your message and will get back to you shortly.</p>
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
          <p style="margin:16px 0 0;font-size:15px;line-height:1.65;color:${C.muted};">Abbiamo ricevuto il suo messaggio. Le risponderemo al più presto.</p>
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

function buildContattiCustomerSimpleText(data: ContattiInput): string {
  const en = data.locale === "en";
  const hi = data.name.split(" ")[0] || data.name;
  if (en) {
    const greet = getEnglishDaytimeGreeting();
    return [
      "K.K Edilizia",
      "",
      `${greet} ${hi},`,
      "",
      "Thank you for contacting us. We have received your message and will get back to you shortly.",
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
    "Abbiamo ricevuto il suo messaggio e le risponderemo al più presto.",
    "",
    "Cordiali saluti,",
    "K.K Edilizia",
  ].join("\n");
}

function buildContattiOfficeHtml(
  data: ContattiInput,
  attachments: EmailAttachment[],
): string {
  const phone = data.phone?.trim() || "—";
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
          <h1 style="margin:10px 0 0;font-size:20px;font-weight:700;color:${C.text};line-height:1.25;">Nuovo contatto dal sito web</h1>
          <p style="margin:12px 0 0;font-size:14px;color:${C.muted};">Modulo <strong>Contatti</strong> — inoltra o rispondi al cliente usando «Rispondi».</p>
        </td></tr>
        <tr><td style="padding:8px 28px 20px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">Anagrafica</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${C.border};border-radius:12px;overflow:hidden;">
            ${rowHtml("Nome", escapeHtml(data.name))}
            ${rowHtml("Email", escapeHtml(data.email))}
            ${rowHtml("Telefono", escapeHtml(phone))}
          </table>
        </td></tr>
        <tr><td style="padding:0 28px 24px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.muted};">Testo inviato</p>
          <div style="background:${C.brandLight};border-left:4px solid ${C.brand};border-radius:0 10px 10px 0;padding:16px 18px;font-size:15px;line-height:1.55;color:${C.text};white-space:pre-wrap;">${escapeHtml(data.message)}</div>
        </td></tr>
        ${attRow}
        <tr><td style="padding:0 28px 28px;background:#fafaf9;border-top:1px solid ${C.border};">
          <p style="margin:0;font-size:12px;line-height:1.55;color:#777;"><strong style="color:${C.text};">Risposta rapida:</strong> usa Rispondi — il destinatario sarà <strong>${escapeHtml(data.email)}</strong> (Reply-To già impostato).</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildContattiOfficeText(
  data: ContattiInput,
  attachments: EmailAttachment[],
): string {
  const phone = data.phone?.trim() || "—";
  const attLines =
    attachments.length > 0
      ? [
          "",
          "--- Allegati (vedi file in questa email) ---",
          ...attachments.map((a) => `- ${a.filename}`),
        ]
      : [];
  return [
    "[UFFICIO] Nuovo contatto — modulo Contatti (sito web)",
    "",
    "--- Anagrafica ---",
    `Nome:     ${data.name}`,
    `Email:    ${data.email}`,
    `Telefono: ${phone}`,
    "",
    "--- Messaggio ---",
    data.message,
    ...attLines,
    "",
    `Rispondi a questo messaggio per scrivere a: ${data.email}`,
  ].join("\n");
}

async function sendOfficeCopyGmail(
  transporter: nodemailer.Transporter,
  fromLine: string,
  office: string,
  data: ContattiInput,
  attachments: EmailAttachment[],
) {
  try {
    await transporter.sendMail({
      from: fromLine,
      to: office,
      subject: `[Sito] Nuovo contatto: ${data.name}${attachments.length ? ` (${attachments.length} allegati)` : ""}`,
      text: buildContattiOfficeText(data, attachments),
      html: buildContattiOfficeHtml(data, attachments),
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
      "[contatti] Gmail: copia ufficio non inviata (il cliente potrebbe aver già ricevuto la conferma):",
      e,
    );
  }
}

async function sendViaGmail(data: ContattiInput, attachments: EmailAttachment[]) {
  const creds = getGmailCredentials();
  if (!creds) throw new Error("EMAIL_NOT_CONFIGURED");
  const { user, pass } = creds;
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || "K.K Edilizia";
  const fromLine = `"${fromName.replace(/"/g, "")}" <${user}>`;
  const office = getContattiOfficeNotifyEmail();
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
    text: buildContattiCustomerSimpleText(data),
    html: buildContattiCustomerSimpleHtml(data),
    replyTo: data.email,
  });

  if (office) {
    await sendOfficeCopyGmail(transporter, fromLine, office, data, attachments);
  }
}

async function sendViaResend(data: ContattiInput, attachments: EmailAttachment[]) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();
  const office = getContattiOfficeNotifyEmail();
  const en = data.locale === "en";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: en ? SUBJECT_CUSTOMER_EN : SUBJECT_CUSTOMER_IT,
    html: buildContattiCustomerSimpleHtml(data),
    text: buildContattiCustomerSimpleText(data),
    replyTo: data.email,
  });

  if (error) {
    logResendError("contatti", error.message);
    throw new Error("EMAIL_SEND_FAILED");
  }

  if (office) {
    try {
      const { error: errOffice } = await resend.emails.send({
        from,
        to: office,
        subject: `[Sito] Nuovo contatto: ${data.name}${attachments.length ? ` (${attachments.length} allegati)` : ""}`,
        html: buildContattiOfficeHtml(data, attachments),
        text: buildContattiOfficeText(data, attachments),
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
        console.error("[contatti] Resend copia ufficio:", errOffice.message);
      }
    } catch (e) {
      console.error("[contatti] Resend copia ufficio:", e);
    }
  }
}

export async function sendContattiConfirmation(
  data: ContattiInput,
  attachments: EmailAttachment[] = [],
) {
  if (hasGmailEnv()) {
    try {
      await withRetry(() => sendViaGmail(data, attachments), {
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
      await withRetry(() => sendViaResend(data, attachments), {
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
