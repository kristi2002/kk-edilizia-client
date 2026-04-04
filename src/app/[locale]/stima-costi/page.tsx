import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CostEstimator } from "@/components/sections/CostEstimator";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta =
    locale === "en" ? enMessages.StimaCostiPage : itMessages.StimaCostiPage;
  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
  };
}

export default async function StimaCostiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col bg-[#080808]">
      <CostEstimator />
    </main>
  );
}
