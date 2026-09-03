import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";
import { ContactForm } from "@/components/contatti/ContactForm";
import { ContactHero } from "@/components/contatti/ContactHero";
import { ContactAside } from "@/components/contatti/ContactAside";
import { ContactRoutes } from "@/components/contatti/ContactRoutes";
import { getSite } from "@/lib/data/site-store";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return withLocaleAlternates(locale, "/contatti", {
    title: meta.contactsTitle,
    description: meta.contactsDescription,
  });
}

/**
 * Three grounds in sequence — dark, paper, sunken — the same rhythm the home page reads
 * in, rather than the single flat panel this page used to be. The dark band carries the
 * channels a visitor reaches for first; the paper band is the form and the details you
 * need while filling it; the sunken band is everything that is an alternative to writing
 * a message at all.
 */
export default async function ContattiPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactsPage");
  const site = await getSite();

  return (
    <main className="flex flex-1 flex-col">
      <ContactHero site={site} />

      <section className="rule-gold relative overflow-hidden border-b border-line bg-page px-4 py-20 sm:px-6 md:py-24">
        <WatermarkWord>MODENA</WatermarkWord>

        <div className="relative mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
                {t("formLabel")}
              </p>
              <h2 className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl">
                {t("formTitle")}
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-ink-3">
                {t("formIntro")}
              </p>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div className="mt-9">
                <ContactForm />
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-5">
            <ContactAside site={site} locale={locale} />
          </div>
        </div>
      </section>

      <ContactRoutes site={site} locale={locale} />
    </main>
  );
}
