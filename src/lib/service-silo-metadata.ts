import type { Metadata } from "next";
import itMessages from "../../messages/it.json";
import enMessages from "../../messages/en.json";
import type { ServiceSiloKey } from "./service-silos";

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

export function buildServiceSiloMetadata(
  locale: string,
  siloKey: ServiceSiloKey,
): Metadata {
  const silo = getSilo(locale, siloKey);
  return {
    title: silo.metaTitle,
    description: silo.metaDescription,
    keywords: silo.metaKeywords,
    openGraph: {
      title: silo.metaTitle,
      description: silo.metaDescription,
    },
  };
}
