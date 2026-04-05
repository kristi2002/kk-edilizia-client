import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ServiceSiloContent } from "@/components/sections/service-silo/ServiceSiloContent";
import { buildServiceSiloMetadata } from "@/lib/service-silo-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return await buildServiceSiloMetadata(locale, "bagno");
}

export default async function RistrutturazioniBagnoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServiceSiloContent locale={locale} siloKey="bagno" />;
}
