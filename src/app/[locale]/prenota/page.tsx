import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { PrenotaForm } from "./PrenotaForm";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const booking =
    locale === "en" ? enMessages.Booking : itMessages.Booking;
  return withLocaleAlternates(locale, "/prenota", {
    title: booking.metaTitle,
    description: booking.metaDescription,
  });
}

export default async function PrenotaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Booking");

  return (
    <main className="flex flex-1 flex-col bg-page px-4 py-20 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink-1 md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-ink-3">{t("intro")}</p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mt-12">
            <PrenotaForm />
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <p className="mt-8 text-center text-sm text-ink-4">
            {t("fallbackCta")}{" "}
            <Link
              href="/contatti"
              className="font-medium text-accent-ink underline hover:text-accent-deep"
            >
              {t("fallbackLink")}
            </Link>
          </p>
        </FadeIn>
      </div>
    </main>
  );
}
