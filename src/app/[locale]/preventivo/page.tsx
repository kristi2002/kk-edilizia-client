import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPreventivoFormOptions } from "@/lib/data/preventivo-options-store";
import { PreventivoForm } from "./PreventivoForm";
import { FadeIn } from "@/components/motion/FadeIn";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { localizedPath } from "@/lib/i18n-path";
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
  const tNav = await getTranslations("Nav");
  const tCrumb = tNav;
  const t = await getTranslations("PreventivoPage");
  const preventivoOptions = await getPreventivoFormOptions();

  return (
    <main className="flex flex-1 flex-col bg-page px-4 py-20 sm:px-6">
      {/* Breadcrumbs: the silos and the portfolio already emit these. */}
      <BreadcrumbJsonLd
        items={[
          { name: tNav("home"), path: localizedPath(locale, "/") },
          { name: tCrumb("quote"), path: localizedPath(locale, "/preventivo") },
        ]}
      />
      <div className="mx-auto w-full max-w-2xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink-1 md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-ink-3">{t("intro")}</p>
        </FadeIn>

        <div className="mt-12">
          <PreventivoForm initialOptions={preventivoOptions} />
        </div>
      </div>
    </main>
  );
}
