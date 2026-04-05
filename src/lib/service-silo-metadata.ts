import type { Metadata } from "next";
import itMessages from "../../messages/it.json";
import enMessages from "../../messages/en.json";
import { serviceSiloPathForKey, type ServiceSiloKey } from "./service-silos";
import { withLocaleAlternates } from "./seo-metadata";

type SiloMeta = {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
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
