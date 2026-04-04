import { z } from "zod";
import { BOOKING_TIME_SLOT_VALUES } from "@/lib/booking-time-slots";
import { honeypotFieldSchema, httpUrlCount } from "./spam";

export const prenotaSchema = z
  .object({
    name: z.string().trim().min(2, "Inserisci il nome").max(120),
    email: z.string().email("Email non valida").max(254),
    phone: z.string().min(6, "Telefono non valido").max(40),
    address: z.string().max(500).optional(),
    preferredDate: z.string().min(1, "Scegli la data"),
    preferredTime: z.string().min(1, "Scegli l’orario"),
    notes: z.string().max(4000).optional(),
    locale: z.enum(["it", "en"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data non valida",
        path: ["preferredDate"],
      });
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(data.preferredTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Orario non valido",
        path: ["preferredTime"],
      });
      return;
    }
    if (!BOOKING_TIME_SLOT_VALUES.includes(data.preferredTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleziona un orario dalla lista",
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
        message: "Data e ora non valide",
        path: ["preferredDate"],
      });
      return;
    }
    if (combined < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Scegli una data e ora nel futuro",
        path: ["preferredTime"],
      });
    }
  })
  .superRefine((data, ctx) => {
    const n = data.notes ?? "";
    if (httpUrlCount(n) > 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Troppi link nel testo",
        path: ["notes"],
      });
    }
  });

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

export const prenotaRequestSchema = prenotaSchema.extend({
  _gotcha: honeypotFieldSchema,
});

export type PrenotaRequest = z.infer<typeof prenotaRequestSchema>;
