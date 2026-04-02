import { z } from "zod";
import { honeypotFieldSchema, httpUrlCount } from "./spam";

export const prenotaSchema = z.object({
  name: z.string().trim().min(2, "Inserisci il nome").max(120),
  email: z.string().email("Email non valida").max(254),
  phone: z.string().min(6, "Telefono non valido").max(40),
  address: z.string().max(500).optional(),
  preferredSlot: z
    .string()
    .min(1, "Indica quando preferisci il sopralluogo")
    .max(2000)
    .refine((s) => httpUrlCount(s) <= 10, {
      message: "Troppi link nel testo",
    }),
  notes: z.string().max(4000).optional(),
  locale: z.enum(["it", "en"]).optional(),
});

export type PrenotaInput = z.infer<typeof prenotaSchema>;

export const prenotaRequestSchema = prenotaSchema.extend({
  _gotcha: honeypotFieldSchema,
});

export type PrenotaRequest = z.infer<typeof prenotaRequestSchema>;
