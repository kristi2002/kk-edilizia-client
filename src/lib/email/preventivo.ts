import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { PreventivoInput } from "@/lib/validations/preventivo";
import { withRetry } from "@/lib/with-retry";
import { hasGmailEnv, hasResendEnv } from "./env";
import { logResendError } from "./logResendError";

const SUBJECT = "Richiesta di preventivo ricevuta – K.K Edilizia";

const WORK_LABELS: Record<string, string> = {
  ristrutturazione: "Ristrutturazione completa",
  "bagno-cucina": "Bagno / cucina",
  impianti: "Impianti",
  facciata: "Facciata / condominio",
  commerciale: "Commerciale / ufficio",
  altro: "Altro",
};

const BUDGET_LABELS: Record<string, string> = {
  "under-30": "Fino a 30.000 €",
  "30-60": "30.000 – 60.000 €",
  "60-100": "60.000 – 100.000 €",
  "100+": "Oltre 100.000 €",
  "da-definire": "Da definire in sede",
};

const TIMELINE_LABELS: Record<string, string> = {
  urgent: "Entro 3 mesi",
  semester: "3–6 mesi",
  year: "6–12 mesi",
  flex: "Flessibile",
};

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

export function buildPreventivoEmailHtml(data: PreventivoInput): string {
  const work = WORK_LABELS[data.workType] ?? data.workType;
  const budget = BUDGET_LABELS[data.budget] ?? data.budget;
  const timeline = TIMELINE_LABELS[data.timeline] ?? data.timeline;
  const sqm = data.sqm?.trim() || "—";
  const notes = data.notes?.trim() || "—";

  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:560px;margin:0 auto;padding:24px;">
  <p style="font-size:18px;font-weight:600;">Richiesta di preventivo ricevuta</p>
  <p>Ciao ${escapeHtml(data.name.split(" ")[0] || data.name)},</p>
  <p>Abbiamo registrato la tua richiesta. Ti contatteremo entro <strong>1–2 giorni lavorativi</strong> con i prossimi passi.</p>
  <p style="margin-top:24px;font-size:14px;font-weight:600;color:#666;">Riepilogo</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${row("Nome", data.name)}
    ${row("Email", data.email)}
    ${row("Telefono", data.phone)}
    ${row("Tipo di intervento", work)}
    ${row("Superficie (m²)", sqm)}
    ${row("Budget", budget)}
    ${row("Tempistiche", timeline)}
    ${row("Note", notes)}
  </table>
  <p style="margin-top:24px;font-size:14px;color:#666;">K.K Edilizia</p>
</body>
</html>`;
}

export function buildPreventivoEmailText(data: PreventivoInput): string {
  const work = WORK_LABELS[data.workType] ?? data.workType;
  const budget = BUDGET_LABELS[data.budget] ?? data.budget;
  const timeline = TIMELINE_LABELS[data.timeline] ?? data.timeline;
  const lines = [
    "Richiesta di preventivo ricevuta",
    "",
    `Ciao ${data.name.split(" ")[0] || data.name},`,
    "",
    "Abbiamo registrato la tua richiesta. Ti contatteremo entro 1–2 giorni lavorativi con i prossimi passi.",
    "",
    "Riepilogo:",
    `- Nome: ${data.name}`,
    `- Email: ${data.email}`,
    `- Telefono: ${data.phone}`,
    `- Tipo di intervento: ${work}`,
    `- Superficie (m²): ${data.sqm?.trim() || "—"}`,
    `- Budget: ${budget}`,
    `- Tempistiche: ${timeline}`,
    `- Note: ${data.notes?.trim() || "—"}`,
    "",
    "K.K Edilizia",
  ];
  return lines.join("\n");
}

async function sendViaGmail(data: PreventivoInput) {
  const user = process.env.GMAIL_USER!.trim();
  const pass = process.env.GMAIL_APP_PASSWORD!.trim();
  const fromName = process.env.GMAIL_FROM_NAME?.trim() || "K.K Edilizia";
  const notify = process.env.PREVENTIVO_NOTIFY_EMAIL?.trim();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"${fromName.replace(/"/g, "")}" <${user}>`,
    to: data.email,
    subject: SUBJECT,
    text: buildPreventivoEmailText(data),
    html: buildPreventivoEmailHtml(data),
    replyTo: data.email,
    ...(notify ? { bcc: notify } : {}),
  });
}

async function sendViaResend(data: PreventivoInput) {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.RESEND_FROM_EMAIL!.trim();
  const notify = process.env.PREVENTIVO_NOTIFY_EMAIL?.trim();

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: SUBJECT,
    html: buildPreventivoEmailHtml(data),
    text: buildPreventivoEmailText(data),
    replyTo: data.email,
    ...(notify ? { bcc: [notify] } : {}),
  });

  if (error) {
    logResendError("preventivo", error.message);
    throw new Error("EMAIL_SEND_FAILED");
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
