/**
 * Impaginazione condivisa delle email transazionali (contatti, prenota, preventivo).
 *
 * Ogni messaggio esce con la stessa carta intestata: filetto oro, fascia scura con
 * marchio e mestiere, corpo bianco, fascia scura di chiusura con i recapiti. I tre
 * moduli email compongono solo il *contenuto* — testata e piede vivono qui, così un
 * ritocco al marchio non va replicato tre volte.
 *
 * Vincoli dei client email: niente `<style>` (Gmail lo tiene, Outlook desktop no per
 * i selettori complessi), niente flex/grid, layout a tabelle e stili inline. I colori
 * ricalcano i token del sito (`globals.css`): oro `--accent`, scuro `--inverse`,
 * carta `--page`.
 */
import itMessages from "../../../messages/it.json";
import enMessages from "../../../messages/en.json";
import { getSite } from "@/lib/data/site-store";
import { getFallbackSiteUrl, normalizePublicSiteUrl } from "@/lib/site";

export type EmailLocale = "it" | "en";

/** Palette allineata ai token di `globals.css`. */
const C = {
  gold: "#c9a227",
  goldDeep: "#a9822f",
  goldLight: "#e8d48b",
  /** Oro leggibile su fondo chiaro (contrasto AA sul bianco). */
  goldInk: "#7e6015",
  /** Oro leggibile su fondo scuro. */
  goldOnDark: "#d9b344",
  dark: "#14171a",
  text: "#17191c",
  text2: "#3a3f45",
  muted: "#5a616a",
  border: "#e4dfd2",
  page: "#f3f1eb",
  card: "#ffffff",
  /** Fondo delle celle-etichetta e dei riquadri nota. */
  labelBg: "#f7f3e9",
  noteBg: "#faf6ec",
  onDark: "#d6d2c7",
  onDarkMuted: "#8d8880",
} as const;

const SANS =
  "'Segoe UI',system-ui,-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif";
/** Instrument Serif non è un web-safe font: in email si scende su Georgia. */
const SERIF = "Georgia,'Times New Roman',Times,serif";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export type EmailBrand = {
  /** Nome completo, es. «K.K Edilizia». */
  name: string;
  /** Prima parola del marchio (bianca in testata). */
  nameLead: string;
  /** Resto del marchio (oro in testata); vuoto se il nome è di una parola sola. */
  nameTail: string;
  /** Mestiere in maiuscoletto sotto il marchio. */
  craftMark: string;
  legalName: string;
  /** Riga indirizzo già composta; vuota finché la sede non è compilata in admin. */
  addressLine: string;
  phoneDisplay: string;
  phoneTel: string;
  email: string;
  siteUrl: string;
  /** Assente in locale: un `src` su localhost resterebbe un’immagine rotta. */
  logoUrl: string;
};

function isLocalUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(url);
}

function buildAddressLine(s: Awaited<ReturnType<typeof getSite>>): string {
  const cityLine = [s.postalCode, s.addressLocality, s.addressRegion && `(${s.addressRegion})`]
    .filter((p) => p && String(p).trim())
    .join(" ")
    .trim();
  const parts = [s.streetAddress?.trim(), cityLine].filter(Boolean);
  return parts.join(", ");
}

/**
 * Dati aziendali per testata e piede, dalla copia runtime in Redis (fallback: `site.ts`).
 * Va chiamata **una volta per invio** e passata ai builder: è una lettura di rete.
 * Per la seconda lingua dello stesso invio si usa `withLocale`, che non rilegge nulla.
 */
export async function getEmailBrand(locale: EmailLocale): Promise<EmailBrand> {
  const site = await getSite();
  const canonical = site.canonicalUrl?.trim();
  const siteUrl = canonical
    ? normalizePublicSiteUrl(canonical)
    : getFallbackSiteUrl();
  const name = site.brand?.trim() || "K.K Edilizia";
  const space = name.indexOf(" ");
  const messages = locale === "en" ? enMessages : itMessages;
  return {
    name,
    nameLead: space > 0 ? name.slice(0, space) : name,
    nameTail: space > 0 ? name.slice(space + 1) : "",
    craftMark: messages.Footer.craftMark,
    legalName: site.legalName?.trim() || "",
    addressLine: buildAddressLine(site),
    phoneDisplay: site.phoneDisplay,
    phoneTel: site.phoneTel,
    email: site.email,
    siteUrl,
    logoUrl: isLocalUrl(siteUrl) ? "" : `${siteUrl}/logo-mark.png`,
  };
}

/** Stessa anagrafica, mestiere nell’altra lingua (nessuna nuova lettura da Redis). */
export function withLocale(brand: EmailBrand, locale: EmailLocale): EmailBrand {
  const messages = locale === "en" ? enMessages : itMessages;
  if (brand.craftMark === messages.Footer.craftMark) return brand;
  return { ...brand, craftMark: messages.Footer.craftMark };
}

/** Filetto oro: apre la carta intestata e stacca il piede (cfr. `.rule-gold`). */
function goldRule(height = 4): string {
  return `<tr><td height="${height}" style="height:${height}px;line-height:${height}px;font-size:0;background:${C.gold};background-image:linear-gradient(90deg,${C.goldDeep} 0%,${C.gold} 45%,${C.goldLight} 100%);">&nbsp;</td></tr>`;
}

function headerBand(brand: EmailBrand): string {
  const logo = brand.logoUrl
    ? `<img src="${brand.logoUrl}" width="62" height="62" alt="" style="display:block;margin:0 auto 14px;border:0;outline:none;text-decoration:none;">`
    : "";
  const tail = brand.nameTail
    ? ` <span style="color:${C.gold};">${escapeHtml(brand.nameTail)}</span>`
    : "";
  return `<tr><td align="center" style="background:${C.dark};padding:30px 28px 26px;">
        ${logo}
        <p style="margin:0;font-family:${SERIF};font-size:27px;line-height:1.2;color:#ffffff;">${escapeHtml(brand.nameLead)}${tail}</p>
        <p style="margin:12px 0 0;font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${C.goldOnDark};">${escapeHtml(brand.craftMark)}</p>
      </td></tr>`;
}

function footerBand(brand: EmailBrand, locale: EmailLocale): string {
  const rights =
    locale === "en" ? "All rights reserved." : "Tutti i diritti riservati.";
  const year = new Date().getFullYear();
  const legal = [brand.legalName, brand.addressLine].filter(Boolean).join(" — ");
  const legalRow = legal
    ? `<p style="margin:7px 0 0;font-family:${SANS};font-size:11px;line-height:1.5;color:${C.onDarkMuted};">${escapeHtml(legal)}</p>`
    : "";
  return `${goldRule(3)}
      <tr><td align="center" style="background:${C.dark};padding:26px 28px 24px;">
        <p style="margin:0;font-family:${SERIF};font-size:17px;line-height:1.3;color:#ffffff;">${escapeHtml(brand.name)}</p>
        ${legalRow}
        <p style="margin:14px 0 0;font-family:${SANS};font-size:12.5px;line-height:1.6;">
          <a href="tel:${escapeHtml(brand.phoneTel)}" style="color:${C.goldOnDark};text-decoration:none;font-weight:600;">${escapeHtml(brand.phoneDisplay)}</a>
          <span style="color:#4a4f55;">&nbsp;|&nbsp;</span>
          <a href="mailto:${escapeHtml(brand.email)}" style="color:${C.goldOnDark};text-decoration:none;font-weight:600;">${escapeHtml(brand.email)}</a>
        </p>
        <p style="margin:14px 0 0;font-family:${SANS};font-size:10.5px;line-height:1.5;color:#6d7278;">© ${year} ${escapeHtml(brand.name)}. ${rights}</p>
      </td></tr>`;
}

/**
 * Carta intestata completa attorno a `body`.
 * `preheader` è il testo di anteprima in lista messaggi (nascosto nel corpo).
 */
export function renderEmailShell(opts: {
  brand: EmailBrand;
  locale: EmailLocale;
  preheader: string;
  body: string;
}): string {
  const { brand, locale, preheader, body } = opts;
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(brand.name)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};font-family:${SANS};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;max-width:0;opacity:0;overflow:hidden;font-size:1px;line-height:1px;color:${C.page};">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
    <tr><td align="center" style="padding:32px 14px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.card};border-radius:14px;overflow:hidden;box-shadow:0 6px 28px rgba(20,23,26,0.09);">
        ${goldRule(4)}
        ${headerBand(brand)}
        <tr><td style="padding:32px 28px 30px;">
          ${body}
        </td></tr>
        ${footerBand(brand, locale)}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Titolo del messaggio con il trattino oro sotto. */
export function heading(title: string): string {
  return `<h1 style="margin:0;font-family:${SERIF};font-size:24px;line-height:1.3;font-weight:400;color:${C.text};">${escapeHtml(title)}</h1>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 0;"><tr><td width="48" height="3" style="width:48px;height:3px;line-height:3px;font-size:0;background:${C.gold};">&nbsp;</td></tr></table>`;
}

/** Paragrafo di testo corrente. `html` può contenere `<strong>`. */
export function paragraph(html: string, marginTop = 18): string {
  return `<p style="margin:${marginTop}px 0 0;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.text2};">${html}</p>`;
}

export type DetailRow = {
  label: string;
  /** Già scappato dal chiamante quando contiene dati utente. */
  value: string;
  /** Recapiti: in grassetto oro, come nell’impaginato di riferimento. */
  emphasis?: boolean;
};

/** Tabella dati: colonna etichetta beige, colonna valore bianca. */
export function detailTable(rows: DetailRow[]): string {
  const cells = rows
    .map((r, i) => {
      const last = i === rows.length - 1;
      const line = last ? "" : `border-bottom:1px solid ${C.border};`;
      const valueStyle = r.emphasis
        ? `font-weight:700;color:${C.goldInk};`
        : `color:${C.text};`;
      return `<tr>
            <td width="36%" style="width:36%;${line}background:${C.labelBg};padding:12px 16px;font-family:${SANS};font-size:10.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.goldInk};vertical-align:top;">${escapeHtml(r.label)}</td>
            <td style="${line}padding:12px 16px;font-family:${SANS};font-size:15px;line-height:1.5;vertical-align:top;${valueStyle}">${r.value}</td>
          </tr>`;
    })
    .join("\n");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid ${C.border};border-radius:10px;border-collapse:separate;overflow:hidden;">
${cells}
          </table>`;
}

/** Riquadro con filetto oro a sinistra: messaggio del cliente, note, preferenze. */
export function noteBlock(
  label: string,
  text: string,
  marginTop = 24,
): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:${marginTop}px 0 0;">
            <tr><td style="background:${C.noteBg};border-left:4px solid ${C.gold};border-radius:0 10px 10px 0;padding:16px 18px;">
              <p style="margin:0 0 8px;font-family:${SANS};font-size:10.5px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.goldInk};">${escapeHtml(label)}</p>
              <p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.text};white-space:pre-wrap;">${escapeHtml(text)}</p>
            </td></tr>
          </table>`;
}

/** Riga «Documenti allegati: …» sotto i dati. */
export function attachmentsLine(label: string, filenames: string[]): string {
  if (filenames.length === 0) return "";
  return `<p style="margin:22px 0 0;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.text2};"><strong style="color:${C.text};">${escapeHtml(label)}</strong> ${escapeHtml(filenames.join(", "))}</p>`;
}

/** Nota in corsivo di chiusura (es. «rispondi per scrivere al cliente»). */
export function italicNote(text: string, marginTop = 22): string {
  return `<p style="margin:${marginTop}px 0 0;font-family:${SANS};font-size:13px;line-height:1.6;font-style:italic;color:${C.muted};">${escapeHtml(text)}</p>`;
}

/** Piede della versione testuale, gemello della fascia scura. */
export function textFooter(brand: EmailBrand): string[] {
  const legal = [brand.legalName, brand.addressLine].filter(Boolean).join(" — ");
  return [
    "",
    "—",
    brand.name,
    ...(legal ? [legal] : []),
    `${brand.phoneDisplay} · ${brand.email}`,
    ...(brand.siteUrl ? [brand.siteUrl] : []),
  ];
}
