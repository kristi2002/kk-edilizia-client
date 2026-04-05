import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPreventivoFormOptions } from "@/lib/data/preventivo-options-store";
import { PreventivoForm } from "./PreventivoForm";
import { FadeIn } from "@/components/motion/FadeIn";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const meta =
    locale === "en"
      ? enMessages.PreventivoPage
      : itMessages.PreventivoPage;
  return withLocaleAlternates(locale, "/preventivo", {
    title: meta.metaTitle,
    description: meta.metaDescription,
  });
}

export default async function PreventivoPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PreventivoPage");
  const preventivoOptions = await getPreventivoFormOptions();

  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-zinc-400">{t("intro")}</p>
        </FadeIn>

        <div className="mt-12">
          <PreventivoForm initialOptions={preventivoOptions} />
        </div>
      </div>
    </main>
  );
}
