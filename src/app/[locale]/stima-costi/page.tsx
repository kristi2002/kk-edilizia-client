import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CostEstimator } from "@/components/sections/CostEstimator";
import { toEstimatorCategory } from "@/lib/data/cost-estimator";
import { getEstimatorRows } from "@/lib/data/estimator-store";
import { isCostEstimateEnabled } from "@/lib/features";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isCostEstimateEnabled()) notFound();
  const { locale } = await params;
  const meta =
    locale === "en" ? enMessages.StimaCostiPage : itMessages.StimaCostiPage;
  return withLocaleAlternates(locale, "/stima-costi", {
    title: meta.metaTitle,
    description: meta.metaDescription,
  });
}

export default async function StimaCostiPage({ params }: Props) {
  if (!isCostEstimateEnabled()) notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const rows = await getEstimatorRows();
  const categories = rows.map((r) => toEstimatorCategory(locale, r));

  return (
    <main className="flex flex-1 flex-col bg-[#080808]">
      <CostEstimator categories={categories} />
    </main>
  );
}
