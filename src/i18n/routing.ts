import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en"],
  defaultLocale: "it",
  localePrefix: "as-needed",
  /** Italian at `/` for everyone; English only at `/en` (no Accept-Language redirect). */
  localeDetection: false,
});
