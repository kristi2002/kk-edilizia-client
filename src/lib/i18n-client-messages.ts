type Messages = Record<string, unknown>;

/**
 * Namespaces that `"use client"` components read via `useTranslations`.
 *
 * Everything else is server-only and must NOT be handed to `NextIntlClientProvider`:
 * the provider serialises whatever it receives into the RSC payload of *every* page.
 * Passing the whole bundle put ~68 KB of JSON on each response, of which `ServiceSilos`
 * alone was ~42 KB — silo body copy that no client component ever reads.
 *
 * Keep this list in sync when a client component starts using a new namespace; a missing
 * entry surfaces immediately as a next-intl "namespace not found" error in that component.
 */
export const CLIENT_MESSAGE_NAMESPACES = [
  "Booking",
  "ContactForm",
  "CookieBanner",
  "CostEstimator",
  "CtaBanner",
  "FaqSection",
  "FeaturedProjects",
  "Footer",
  "FormErrors",
  "Nav",
  "PreventivoForm",
  "Services",
  "VirtualTour",
] as const;

export function pickClientMessages(messages: Messages): Messages {
  const out: Messages = {};
  for (const ns of CLIENT_MESSAGE_NAMESPACES) {
    if (ns in messages) out[ns] = messages[ns];
  }
  return out;
}
