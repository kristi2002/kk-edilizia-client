import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { PreventivoInput } from "@/lib/validations/preventivo";
import { withRetry } from "@/lib/with-retry";
import { getGmailCredentials, hasGmailEnv, hasResendEnv } from "./env";
import { logResendError } from "./logResendError";
import { resolvePreventivoLabelsForEmail } from "@/lib/data/preventivo-options-store";
import {
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

const SUBJECT_CUSTOMER_IT = "Richiesta di preventivo ricevuta – K.K Edilizia";
const SUBJECT_CUSTOMER_EN = "Quote request received – K.K Edilizia";

type ResolvedPreventivoLabels = Awaited<
  ReturnType<typeof resolvePreventivoLabelsForEmail>
>;

/** Email al cliente: breve conferma (stesso stile contatti / prenota). */
function buildPreventivoCustomerSimpleHtml(
  data: PreventivoInput,
  brand: EmailBrand,
): string {
  const first = escapeHtml(data.name.split(" ")[0] || data.name);
  const en = data.locale === "en";
  if (en) {
    return renderEmailShell({
      brand,
      locale: "en",
      preheader: "We have received your quote request.",
      body: [
        heading(`${getEnglishDaytimeGreeting()}, ${first}`),
        paragraph(
          `Thank you for your quote request to <strong>${escapeHtml(brand.name)}</strong>. We have received it and will contact you within <strong>1–2 business days</strong> with the next steps.`,
        ),
        paragraph(
          "If you would like to add details, photos or drawings in the meantime, simply reply to this email.",
        ),
        italicNote("This is an automated confirmation."),
      ].join("\n"),
    });
  }
  return renderEmailShell({
    brand,
    locale: "it",
    preheader: "Abbiamo ricevuto la sua richiesta di preventivo.",
    body: [
      heading(`${getItalianDaytimeGreeting()}, ${first}`),
      paragraph(
        `Grazie per la sua richiesta di preventivo. L’abbiamo ricevuta e la contatteremo entro <strong>1–2 giorni lavorativi</strong> con i prossimi passi.`,
      ),
      paragraph(
        "Se nel frattempo desidera aggiungere dettagli, foto o disegni, può rispondere direttamente a questa email.",
      ),
      italicNote("Email automatica di conferma."),
    ].join("\n"),
  });
}

function buildPreventivoCustomerSimpleText(
  data: PreventivoInput,
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
      "We have received your quote request. We will contact you within 1–2 business days with the next steps.",
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
    "Abbiamo ricevuto la sua richiesta di preventivo. La contatteremo entro 1–2 giorni lavorativi con i prossimi passi.",
    "",
    "Cordiali saluti,",
    brand.name,
    ...textFooter(brand),
  ].join("\n");
}

/** Copia ufficio: tutti i campi, stile allineato a contatti / prenota. */
function buildPreventivoOfficeHtml(
  data: PreventivoInput,
  labels: ResolvedPreventivoLabels,
  brand: EmailBrand,
): string {
  const { work, budget, timeline, sqm, notes } = labels;
  return renderEmailShell({
    brand,
    locale: "it",
    preheader: `Preventivo — ${data.name} · ${work}`,
    body: [
      heading("Nuova richiesta di preventivo"),
      paragraph(
        "È arrivata una nuova richiesta dal modulo <strong>Richiedi preventivo</strong> del sito. Ecco i dettagli:",
      ),
      `<div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>`,
      detailTable([
        { label: "Nome", value: escapeHtml(data.name) },
        { label: "Telefono", value: escapeHtml(data.phone), emphasis: true },
        { label: "Email", value: escapeHtml(data.email), emphasis: true },
        { label: "Tipo di intervento", value: escapeHtml(work) },
        { label: "Superficie (m²)", value: escapeHtml(sqm) },
        { label: "Budget", value: escapeHtml(budget) },
        { label: "Tempistiche", value: escapeHtml(timeline) },
      ]),
      noteBlock("Descrizione del lavoro", notes),
      italicNote(
        "Puoi rispondere direttamente a questa email: la risposta arriverà al cliente.",
      ),
    ].join("\n"),
  });
}

function buildPreventivoOfficeText(
  data: PreventivoInput,
  labels: ResolvedPreventivoLabels,
  brand: EmailBrand,
): string {
  const { work, budget, timeline, sqm, notes } = labels;
  return [
    "[UFFICIO] Nuova richiesta preventivo — modulo Preventivo (sito web)",
    "",
    "--- Anagrafica ---",
    `Nome:     ${data.name}`,
    `Email:    ${data.email}`,
    `Telefono: ${data.phone}`,
    "",
    "--- Dettaglio ---",
    `Tipo di intervento: ${work}`,
    `Superficie (m²):    ${sqm}`,
    `Budget:             ${budget}`,
    `Tempistiche:        ${timeline}`,
    "",
    "--- Note ---",
    notes,
    "",
    `Rispondi a questo messaggio per scrivere a: ${data.email}`,
    ...textFooter(brand),
  ].join("\n");
}

function getPreventivoNotifyEmail(): string | undefined {
  return process.env.PREVENTIVO_NOTIFY_EMAIL?.trim() || getGmailCredentials()?.user;
}

async function sendPreventivoOfficeGmail(
  transporter: nodemailer.Transporter,
  fromLine: string,
  to: string,
  data: PreventivoInput,
  labels: ResolvedPreventivoLabels,
  brand: EmailBrand,
) {
  try {
    await transporter.sendMail({
      from: fromLine,
      to,
      subject: `[Sito] Preventivo: ${data.name}`,
      text: buildPreventivoOfficeText(data, labels, brand),
      html: buildPreventivoOfficeHtml(data, labels, brand),
      replyTo: data.email,
    });
  } catch (e) {
    console.error(
      "[preventivo] Gmail: copia ufficio non inviata (il cliente potrebbe aver già ricevuto la conferma):",
      e,
    );
  }
}

async function sendViaGmail(data: PreventivoInput) {
  const creds = getGmailCredentials();
  if (!creds) throw new Error("EMAIL_NOT_CONFIGURED");
  const { user, pass } = creds;
  const officeBrand = await getEmailBrand("it");
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || officeBrand.name;
  const fromLine = `"${fromName.replace(/"/g, "")}" <${user}>`;
  const notify = getPreventivoNotifyEmail();
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
    text: buildPreventivoCustomerSimpleText(data, customerBrand),
    html: buildPreventivoCustomerSimpleHtml(data, customerBrand),
    replyTo: data.email,
  });

  if (notify) {
    const labels = await resolvePreventivoLabelsForEmail(data);
    await sendPreventivoOfficeGmail(
      transporter,
      fromLine,
      notify,
      data,
      labels,
      officeBrand,
    );
  }
}

async function sendViaResend(data: PreventivoInput) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();
  const notify = getPreventivoNotifyEmail();
  const en = data.locale === "en";
  const officeBrand = await getEmailBrand("it");
  const customerBrand = en ? withLocale(officeBrand, "en") : officeBrand;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: en ? SUBJECT_CUSTOMER_EN : SUBJECT_CUSTOMER_IT,
    html: buildPreventivoCustomerSimpleHtml(data, customerBrand),
    text: buildPreventivoCustomerSimpleText(data, customerBrand),
    replyTo: data.email,
  });

  if (error) {
    logResendError("preventivo", error.message);
    throw new Error("EMAIL_SEND_FAILED");
  }

  if (notify) {
    try {
      const labels = await resolvePreventivoLabelsForEmail(data);
      const { error: errOffice } = await resend.emails.send({
        from,
        to: notify,
        subject: `[Sito] Preventivo: ${data.name}`,
        html: buildPreventivoOfficeHtml(data, labels, officeBrand),
        text: buildPreventivoOfficeText(data, labels, officeBrand),
        replyTo: data.email,
      });
      if (errOffice) {
        console.error("[preventivo] Resend copia ufficio:", errOffice.message);
      }
    } catch (e) {
      console.error("[preventivo] Resend copia ufficio:", e);
    }
  }
}

/** Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD) oppure Resend. Priorità: Gmail se entrambi configurati. */
export async function sendPreventivoConfirmation(data: PreventivoInput) {
  if (hasGmailEnv()) {
    try {
      await withRetry(() => sendViaGmail(data), {
        maxAttempts: 3,
        baseDelayMs: 400,
      });
    } catch (e) {
      console.error("[preventivo] Gmail SMTP:", e);
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
      console.error("[preventivo] Resend:", e);
      throw new Error("EMAIL_SEND_FAILED");
    }
    return;
  }

  throw new Error("EMAIL_NOT_CONFIGURED");
}
