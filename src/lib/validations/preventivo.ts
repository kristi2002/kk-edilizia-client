import { z } from "zod";
import { honeypotFieldSchema } from "./spam";

export const preventivoSchema = z.object({
  workType: z.string().min(1, "Seleziona il tipo di lavoro"),
  sqm: z.string().max(32).optional(),
  budget: z.string().min(1, "Indica una fascia di budget"),
  timeline: z.string().min(1, "Indica i tempi desiderati"),
  name: z.string().trim().min(2, "Inserisci il nome").max(120),
  email: z.string().email("Email non valida").max(254),
  phone: z.string().min(6, "Telefono non valido").max(40),
  notes: z.string().max(4000).optional(),
});

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
