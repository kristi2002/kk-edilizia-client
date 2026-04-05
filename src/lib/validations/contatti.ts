import { z } from "zod";
import { createHoneypotFieldSchema, httpUrlCount, honeypotMessages } from "./spam";

export type ContattiLocale = "it" | "en";

const MESSAGES: Record<
  ContattiLocale,
  {
    nameMin: string;
    emailInvalid: string;
    messageShort: string;
    messageMax: string;
    tooManyLinks: string;
  }
> = {
  it: {
    nameMin: "Inserisci il nome",
    emailInvalid: "Email non valida",
    messageShort: "Il messaggio è troppo breve",
    messageMax: "Massimo 5000 caratteri",
    tooManyLinks: "Troppi link nel messaggio",
  },
  en: {
    nameMin: "Enter your name",
    emailInvalid: "Invalid email",
    messageShort: "Message is too short",
    messageMax: "Maximum 5000 characters",
    tooManyLinks: "Too many links in the message",
  },
};

export function createContattiSchema(locale: ContattiLocale) {
  const m = MESSAGES[locale];
  return z.object({
    name: z.string().trim().min(2, m.nameMin).max(120),
    email: z.string().email(m.emailInvalid).max(254),
    phone: z.string().max(40).optional(),
    message: z
      .string()
      .min(10, m.messageShort)
      .max(5000, m.messageMax)
      .refine((s) => httpUrlCount(s) <= 25, {
        message: m.tooManyLinks,
      }),
    locale: z.enum(["it", "en"]).optional(),
  });
}

export function createContattiRequestSchema(locale: ContattiLocale) {
  const hp = createHoneypotFieldSchema(honeypotMessages[locale]);
  return createContattiSchema(locale).extend({
    _gotcha: hp,
  });
}

const _schemaIt = createContattiSchema("it");
export type ContattiInput = z.infer<typeof _schemaIt>;

const _reqIt = createContattiRequestSchema("it");
export type ContattiRequest = z.infer<typeof _reqIt>;
