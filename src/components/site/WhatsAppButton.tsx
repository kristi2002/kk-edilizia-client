"use client";

import { useLocale } from "next-intl";
import { WhatsAppGlyph } from "./WhatsAppGlyph";

const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

/** Label and prefilled text were hardcoded Italian on an otherwise bilingual site. */
const COPY = {
  it: {
    label: "Scrivici su WhatsApp",
    message:
      "Buongiorno, vorrei informazioni su un intervento di ristrutturazione.",
  },
  en: {
    label: "Message us on WhatsApp",
    message: "Hello, I would like information about a renovation project.",
  },
} as const;

export function WhatsAppButton() {
  const locale = useLocale();
  const copy = locale === "en" ? COPY.en : COPY.it;

  if (!number) return null;

  const href = `https://wa.me/${number}?text=${encodeURIComponent(copy.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-28 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition hover:scale-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-page sm:bottom-6"
      aria-label={copy.label}
      title={copy.label}
    >
      <WhatsAppGlyph className="h-8 w-8" />
    </a>
  );
}
