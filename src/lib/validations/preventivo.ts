import { z } from "zod";
import {
  createHoneypotFieldSchema,
  honeypotFieldSchema,
  honeypotMessages,
} from "./spam";

export type PreventivoLocale = "it" | "en";

/**
 * Validation copy, per locale.
 *
 * The schema carried Italian strings only, so an English visitor was told "Email non
 * valida" on a form that is otherwise English. `/contatti` and `/prenota` already solved
 * this with a schema factory; this mirrors `createPrenotaSchema`. The server keeps
 * parsing with the Italian instance exported below — the request shape is identical
 * either way, and the messages a visitor actually reads are produced client-side.
 */
const MESSAGES: Record<
  PreventivoLocale,
  {
    workTypeRequired: string;
    budgetRequired: string;
    timelineRequired: string;
    nameMin: string;
    emailInvalid: string;
    phoneMin: string;
  }
> = {
  it: {
    workTypeRequired: "Seleziona il tipo di lavoro",
    budgetRequired: "Indica una fascia di budget",
    timelineRequired: "Indica i tempi desiderati",
    nameMin: "Inserisci il nome",
    emailInvalid: "Email non valida",
    phoneMin: "Telefono non valido",
  },
  en: {
    workTypeRequired: "Select the type of work",
    budgetRequired: "Choose a budget range",
    timelineRequired: "Tell us your preferred timing",
    nameMin: "Enter your name",
    emailInvalid: "Invalid email",
    phoneMin: "Invalid phone number",
  },
};

export function createPreventivoSchema(locale: PreventivoLocale) {
  const m = MESSAGES[locale];
  return z.object({
    workType: z.string().min(1, m.workTypeRequired),
    sqm: z.string().max(32).optional(),
    budget: z.string().min(1, m.budgetRequired),
    timeline: z.string().min(1, m.timelineRequired),
    name: z.string().trim().min(2, m.nameMin).max(120),
    email: z.string().email(m.emailInvalid).max(254),
    phone: z.string().min(6, m.phoneMin).max(40),
    notes: z.string().max(4000).optional(),
    locale: z.enum(["it", "en"]).optional(),
  });
}

export function createPreventivoRequestSchema(locale: PreventivoLocale) {
  return createPreventivoSchema(locale).extend({
    _gotcha: createHoneypotFieldSchema(honeypotMessages[locale]),
  });
}

/** Per-step slices, so "Avanti" validates only what is on screen. */
export function createPreventivoStepSchemas(locale: PreventivoLocale) {
  const base = createPreventivoSchema(locale);
  return {
    step1: base.pick({ workType: true, sqm: true }),
    step2: base.pick({ budget: true, timeline: true }),
    step3: base.pick({ name: true, email: true, phone: true, notes: true }),
  };
}

/** Italian instance. The API route parses with this; the client uses the factory. */
export const preventivoSchema = createPreventivoSchema("it");

export type PreventivoInput = z.infer<typeof preventivoSchema>;

export const preventivoRequestSchema = preventivoSchema.extend({
  _gotcha: honeypotFieldSchema,
});

export type PreventivoRequest = z.infer<typeof preventivoRequestSchema>;

export const step1Schema = preventivoSchema.pick({ workType: true, sqm: true });
export const step2Schema = preventivoSchema.pick({
  budget: true,
  timeline: true,
});
export const step3Schema = preventivoSchema.pick({
  name: true,
  email: true,
  phone: true,
  notes: true,
});
