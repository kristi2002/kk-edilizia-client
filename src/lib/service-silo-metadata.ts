import type { Metadata } from "next";
import itMessages from "../../messages/it.json";
import enMessages from "../../messages/en.json";
import { serviceSiloPathForKey, type ServiceSiloKey } from "./service-silos";
import { withLocaleAlternates } from "./seo-metadata";

/**
 * `metaKeywords` still exists in `messages` as editorial notes, but is deliberately not
 * read here: Next would emit `<meta name="keywords">`, which Google ignores and which
 * SEO-PATTERNS.md §1 already states this site does not output.
 */
type SiloMeta = {
  metaTitle: string;
  metaDescription: string;
};

function getSilo(locale: string, key: ServiceSiloKey): SiloMeta {
  const bundle = locale === "en" ? enMessages : itMessages;
  const silo = bundle.ServiceSilos[key];
  return silo as SiloMeta;
}

export async function buildServiceSiloMetadata(
  locale: string,
  siloKey: ServiceSiloKey,
): Promise<Metadata> {
  const silo = getSilo(locale, siloKey);
  const path = serviceSiloPathForKey(siloKey);
  return withLocaleAlternates(locale, path, {
    title: silo.metaTitle,
    description: silo.metaDescription,
    openGraph: {
      title: silo.metaTitle,
      description: silo.metaDescription,
    },
  });
}
