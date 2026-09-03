import { z } from "zod";
import { BOOKING_TIME_SLOT_VALUES } from "@/lib/booking-time-slots";
import {
  createHoneypotFieldSchema,
  honeypotFieldSchema,
  honeypotMessages,
  httpUrlCount,
} from "./spam";

export type PrenotaLocale = "it" | "en";

/**
 * Validation copy, per locale.
 *
 * The schema used to carry Italian strings only, so an English visitor filling the
 * booking form was told "Scegli la data". `/contatti` already solved this with a schema
 * factory (`createContattiSchema`); this mirrors it. The server keeps parsing with the
 * Italian instance exported below — the request shape is identical either way, and the
 * messages a visitor actually reads are produced client-side.
 */
const MESSAGES: Record<
  PrenotaLocale,
  {
    nameMin: string;
    emailInvalid: string;
    phoneMin: string;
    dateRequired: string;
    timeRequired: string;
    dateInvalid: string;
    timeInvalid: string;
    timeNotInList: string;
    slotInvalid: string;
    slotPast: string;
    tooManyLinks: string;
  }
> = {
  it: {
    nameMin: "Inserisci il nome",
    emailInvalid: "Email non valida",
    phoneMin: "Telefono non valido",
    dateRequired: "Scegli la data",
    timeRequired: "Scegli l’orario",
    dateInvalid: "Data non valida",
    timeInvalid: "Orario non valido",
    timeNotInList: "Seleziona un orario dalla lista",
    slotInvalid: "Data e ora non valide",
    slotPast: "Scegli una data e ora nel futuro",
    tooManyLinks: "Troppi link nel testo",
  },
  en: {
    nameMin: "Enter your name",
    emailInvalid: "Invalid email",
    phoneMin: "Invalid phone number",
    dateRequired: "Choose a date",
    timeRequired: "Choose a time",
    dateInvalid: "Invalid date",
    timeInvalid: "Invalid time",
    timeNotInList: "Pick a time from the list",
    slotInvalid: "Invalid date and time",
    slotPast: "Choose a date and time in the future",
    tooManyLinks: "Too many links in the text",
  },
};

export function createPrenotaSchema(locale: PrenotaLocale) {
  const m = MESSAGES[locale];
  return z
    .object({
      name: z.string().trim().min(2, m.nameMin).max(120),
      email: z.string().email(m.emailInvalid).max(254),
      phone: z.string().min(6, m.phoneMin).max(40),
      preferredDate: z.string().min(1, m.dateRequired),
      preferredTime: z.string().min(1, m.timeRequired),
      notes: z.string().max(4000).optional(),
      locale: z.enum(["it", "en"]).optional(),
    })
    .superRefine((data, ctx) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.dateInvalid,
          path: ["preferredDate"],
        });
        return;
      }
      if (!/^\d{2}:\d{2}$/.test(data.preferredTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.timeInvalid,
          path: ["preferredTime"],
        });
        return;
      }
      if (!BOOKING_TIME_SLOT_VALUES.includes(data.preferredTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.timeNotInList,
          path: ["preferredTime"],
        });
        return;
      }
      const combined = new Date(
        `${data.preferredDate}T${data.preferredTime}:00`,
      );
      if (Number.isNaN(combined.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.slotInvalid,
          path: ["preferredDate"],
        });
        return;
      }
      if (combined < new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.slotPast,
          path: ["preferredTime"],
        });
      }
    })
    .superRefine((data, ctx) => {
      const n = data.notes ?? "";
      if (httpUrlCount(n) > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: m.tooManyLinks,
          path: ["notes"],
        });
      }
    });
}

/** Italian instance. The API route parses with this; the client uses the factory. */
export const prenotaSchema = createPrenotaSchema("it");

export type PrenotaFormData = z.infer<typeof prenotaSchema>;

/** Payload usato dalle email (testo unico per data/ora). */
export type PrenotaInput = Omit<
  PrenotaFormData,
  "preferredDate" | "preferredTime"
> & {
  preferredSlot: string;
};

export function toPrenotaEmailInput(data: PrenotaFormData): PrenotaInput {
  const { preferredDate, preferredTime, ...rest } = data;
  const d = new Date(`${preferredDate}T${preferredTime}:00`);
  const loc = data.locale === "en" ? "en-GB" : "it-IT";
  const preferredSlot = Number.isNaN(d.getTime())
    ? `${preferredDate} ${preferredTime}`
    : d.toLocaleString(loc, { dateStyle: "long", timeStyle: "short" });
  return { ...rest, preferredSlot };
}

export function createPrenotaRequestSchema(locale: PrenotaLocale) {
  return createPrenotaSchema(locale).extend({
    _gotcha: createHoneypotFieldSchema(honeypotMessages[locale]),
  });
}

export const prenotaRequestSchema = prenotaSchema.extend({
  _gotcha: honeypotFieldSchema,
});

export type PrenotaRequest = z.infer<typeof prenotaRequestSchema>;
