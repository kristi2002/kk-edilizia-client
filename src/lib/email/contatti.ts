import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { ContattiInput } from "@/lib/validations/contatti";
import type { EmailAttachment } from "@/lib/form-attachments";
import { withRetry } from "@/lib/with-retry";
import { getGmailCredentials, hasGmailEnv, hasResendEnv } from "./env";
import { logResendError } from "./logResendError";
import {
  attachmentsLine,
  detailTable,
  escapeHtml,
  getEmailBrand,
  heading,
  italicNote,
  noteBlock,
  paragraph,
  renderEmailShell,
  textFooter,
  withLocale,
  type EmailBrand,
} from "./layout";
import {
  getEnglishDaytimeGreeting,
  getItalianDaytimeGreeting,
} from "./time-greeting";

const SUBJECT_CUSTOMER_IT = "Messaggio ricevuto – K.K Edilizia";
const SUBJECT_CUSTOMER_EN = "Message received – K.K Edilizia";

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
function buildContattiCustomerSimpleHtml(
  data: ContattiInput,
  brand: EmailBrand,
): string {
  const first = escapeHtml(data.name.split(" ")[0] || data.name);
  const en = data.locale === "en";
  if (en) {
    return renderEmailShell({
      brand,
      locale: "en",
      preheader: "We have received your message and will get back to you shortly.",
      body: [
        heading(`${getEnglishDaytimeGreeting()}, ${first}`),
        paragraph(
          `Thank you for contacting <strong>${escapeHtml(brand.name)}</strong>. We have received your message through the website contact form and will get back to you shortly.`,
        ),
        paragraph(
          "If you would like to add details or documents in the meantime, simply reply to this email.",
        ),
        italicNote("This is an automated confirmation."),
      ].join("\n"),
    });
  }
  return renderEmailShell({
    brand,
    locale: "it",
    preheader: "Abbiamo ricevuto il suo messaggio e le risponderemo al più presto.",
    body: [
      heading(`${getItalianDaytimeGreeting()}, ${first}`),
      paragraph(
        `Grazie per averci scritto. Abbiamo ricevuto il suo messaggio dal modulo <strong>Contatti</strong> del sito e le risponderemo al più presto.`,
      ),
      paragraph(
        "Se nel frattempo desidera aggiungere dettagli o documenti, può rispondere direttamente a questa email.",
      ),
      italicNote("Email automatica di conferma."),
    ].join("\n"),
  });
}

function buildContattiCustomerSimpleText(
  data: ContattiInput,
  brand: EmailBrand,
): string {
  const en = data.locale === "en";
  const hi = data.name.split(" ")[0] || data.name;
  if (en) {
    const greet = getEnglishDaytimeGreeting();
    return [
      brand.name,
      "",
      `${greet} ${hi},`,
      "",
      "Thank you for contacting us. We have received your message and will get back to you shortly.",
      "",
      "Kind regards,",
      brand.name,
      ...textFooter(brand),
    ].join("\n");
  }
  return [
    brand.name,
    "",
    `${getItalianDaytimeGreeting()} ${hi},`,
    "",
    "Abbiamo ricevuto il suo messaggio e le risponderemo al più presto.",
    "",
    "Cordiali saluti,",
    brand.name,
    ...textFooter(brand),
  ].join("\n");
}

function buildContattiOfficeHtml(
  data: ContattiInput,
  attachments: EmailAttachment[],
  brand: EmailBrand,
): string {
  const phone = data.phone?.trim() || "—";
  return renderEmailShell({
    brand,
    locale: "it",
    preheader: `Contatti — ${data.name} · ${data.email}`,
    body: [
      heading("Nuovo messaggio dal sito"),
      paragraph(
        "È arrivata una nuova richiesta dal modulo <strong>Contatti</strong> del sito. Ecco i dettagli:",
      ),
      `<div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>`,
      detailTable([
        { label: "Nome", value: escapeHtml(data.name) },
        { label: "Telefono", value: escapeHtml(phone), emphasis: true },
        { label: "Email", value: escapeHtml(data.email), emphasis: true },
      ]),
      noteBlock("Messaggio", data.message),
      attachmentsLine(
        "Documenti allegati:",
        attachments.map((a) => a.filename),
      ),
      italicNote(
        "Puoi rispondere direttamente a questa email: la risposta arriverà al cliente.",
      ),
    ].join("\n"),
  });
}

function buildContattiOfficeText(
  data: ContattiInput,
  attachments: EmailAttachment[],
  brand: EmailBrand,
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
    ...textFooter(brand),
  ].join("\n");
}

async function sendOfficeCopyGmail(
  transporter: nodemailer.Transporter,
  fromLine: string,
  office: string,
  data: ContattiInput,
  attachments: EmailAttachment[],
  brand: EmailBrand,
) {
  try {
    await transporter.sendMail({
      from: fromLine,
      to: office,
      subject: `[Sito] Nuovo contatto: ${data.name}${attachments.length ? ` (${attachments.length} allegati)` : ""}`,
      text: buildContattiOfficeText(data, attachments, brand),
      html: buildContattiOfficeHtml(data, attachments, brand),
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
  const officeBrand = await getEmailBrand("it");
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || officeBrand.name;
  const fromLine = `"${fromName.replace(/"/g, "")}" <${user}>`;
  const office = getContattiOfficeNotifyEmail();
  const en = data.locale === "en";
  const customerBrand = en ? withLocale(officeBrand, "en") : officeBrand;

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
    text: buildContattiCustomerSimpleText(data, customerBrand),
    html: buildContattiCustomerSimpleHtml(data, customerBrand),
    replyTo: data.email,
  });

  if (office) {
    await sendOfficeCopyGmail(
      transporter,
      fromLine,
      office,
      data,
      attachments,
      officeBrand,
    );
  }
}

async function sendViaResend(data: ContattiInput, attachments: EmailAttachment[]) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();
  const office = getContattiOfficeNotifyEmail();
  const en = data.locale === "en";
  const officeBrand = await getEmailBrand("it");
  const customerBrand = en ? withLocale(officeBrand, "en") : officeBrand;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: en ? SUBJECT_CUSTOMER_EN : SUBJECT_CUSTOMER_IT,
    html: buildContattiCustomerSimpleHtml(data, customerBrand),
    text: buildContattiCustomerSimpleText(data, customerBrand),
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
        html: buildContattiOfficeHtml(data, attachments, officeBrand),
        text: buildContattiOfficeText(data, attachments, officeBrand),
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
