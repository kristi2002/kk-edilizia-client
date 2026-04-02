import { z } from "zod";
import { honeypotFieldSchema, httpUrlCount } from "./spam";

export const contattiSchema = z.object({
  name: z.string().trim().min(2, "Inserisci il nome").max(120),
  email: z.string().email("Email non valida").max(254),
  phone: z.string().max(40).optional(),
  message: z
    .string()
    .min(10, "Il messaggio è troppo breve")
    .max(5000, "Massimo 5000 caratteri")
    .refine((s) => httpUrlCount(s) <= 25, {
      message: "Troppi link nel messaggio",
    }),
});

export type ContattiInput = z.infer<typeof contattiSchema>;

/** API + forms: includes honeypot `_gotcha` (must stay empty). */
export const contattiRequestSchema = contattiSchema.extend({
  _gotcha: honeypotFieldSchema,
});

export type ContattiRequest = z.infer<typeof contattiRequestSchema>;
