import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { EmailAttachment } from "@/lib/form-attachments";
import type { PrenotaInput } from "@/lib/validations/prenota";
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

const SUBJECT_CUSTOMER_IT = "Richiesta sopralluogo ricevuta – K.K Edilizia";
const SUBJECT_CUSTOMER_EN = "Site visit request received – K.K Edilizia";

/** Email al cliente: breve ringraziamento (senza ripetere tutto il modulo). */
function buildPrenotaCustomerSimpleHtml(
  data: PrenotaInput,
  brand: EmailBrand,
): string {
  const first = escapeHtml(data.name.split(" ")[0] || data.name);
  const en = data.locale === "en";
  if (en) {
    return renderEmailShell({
      brand,
      locale: "en",
      preheader: "We have received your site visit request.",
      body: [
        heading(`${getEnglishDaytimeGreeting()}, ${first}`),
        paragraph(
          `Thank you for your site visit request to <strong>${escapeHtml(brand.name)}</strong>. We have received it and will contact you shortly to confirm date and time.`,
        ),
        paragraph(
          "If your availability changes in the meantime, simply reply to this email.",
        ),
        italicNote("This is an automated confirmation."),
      ].join("\n"),
    });
  }
  return renderEmailShell({
    brand,
    locale: "it",
    preheader: "Abbiamo ricevuto la sua richiesta di sopralluogo.",
    body: [
      heading(`${getItalianDaytimeGreeting()}, ${first}`),
      paragraph(
        `Grazie per la sua richiesta di sopralluogo. L’abbiamo ricevuta e la contatteremo al più presto per confermare data e orario.`,
      ),
      paragraph(
        "Se nel frattempo cambiano le sue disponibilità, può rispondere direttamente a questa email.",
      ),
      italicNote("Email automatica di conferma."),
    ].join("\n"),
  });
}

function buildPrenotaCustomerSimpleText(
  data: PrenotaInput,
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
      "Thank you for your site visit request. We have received it and will contact you shortly.",
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
    "Abbiamo ricevuto la sua richiesta di sopralluogo e la contatteremo al più presto.",
    "",
    "Cordiali saluti,",
    brand.name,
    ...textFooter(brand),
  ].join("\n");
}

function buildPrenotaOfficeHtml(
  data: PrenotaInput,
  attachments: EmailAttachment[],
  brand: EmailBrand,
): string {
  const notes = data.notes?.trim() || "—";
  return renderEmailShell({
    brand,
    locale: "it",
    preheader: `Sopralluogo — ${data.name} · ${data.preferredSlot}`,
    body: [
      heading("Nuova richiesta di sopralluogo"),
      paragraph(
        "È arrivata una nuova richiesta dal modulo <strong>Prenota sopralluogo</strong> del sito. Ecco i dettagli:",
      ),
      `<div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>`,
      detailTable([
        { label: "Nome", value: escapeHtml(data.name) },
        { label: "Telefono", value: escapeHtml(data.phone), emphasis: true },
        { label: "Email", value: escapeHtml(data.email), emphasis: true },
        {
          label: "Data e ora preferite",
          value: escapeHtml(data.preferredSlot),
        },
      ]),
      noteBlock("Note aggiuntive", notes),
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

function buildPrenotaOfficeText(
  data: PrenotaInput,
  attachments: EmailAttachment[],
  brand: EmailBrand,
): string {
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
    "",
    "--- Preferenza data e ora ---",
    data.preferredSlot,
    "",
    "--- Note ---",
    notes,
    ...attLines,
    "",
    `Rispondi a questo messaggio per scrivere a: ${data.email}`,
    ...textFooter(brand),
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
  brand: EmailBrand,
) {
  try {
    await transporter.sendMail({
      from: fromLine,
      to,
      subject: `[Sito] Sopralluogo: ${data.name}${attachments.length ? ` (${attachments.length} allegati)` : ""}`,
      text: buildPrenotaOfficeText(data, attachments, brand),
      html: buildPrenotaOfficeHtml(data, attachments, brand),
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
  const officeBrand = await getEmailBrand("it");
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || officeBrand.name;
  const fromLine = `"${fromName.replace(/"/g, "")}" <${user}>`;
  const notify = getPrenotaNotifyEmail();
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
    text: buildPrenotaCustomerSimpleText(data, customerBrand),
    html: buildPrenotaCustomerSimpleHtml(data, customerBrand),
    replyTo: data.email,
  });

  if (notify) {
    await sendPrenotaOfficeGmail(
      transporter,
      fromLine,
      notify,
      data,
      attachments,
      officeBrand,
    );
  }
}

async function sendViaResend(data: PrenotaInput, attachments: EmailAttachment[]) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();
  const notify = getPrenotaNotifyEmail();
  const en = data.locale === "en";
  const officeBrand = await getEmailBrand("it");
  const customerBrand = en ? withLocale(officeBrand, "en") : officeBrand;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: en ? SUBJECT_CUSTOMER_EN : SUBJECT_CUSTOMER_IT,
    html: buildPrenotaCustomerSimpleHtml(data, customerBrand),
    text: buildPrenotaCustomerSimpleText(data, customerBrand),
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
        html: buildPrenotaOfficeHtml(data, attachments, officeBrand),
        text: buildPrenotaOfficeText(data, attachments, officeBrand),
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
