import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, Clock } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/contatti/ContactForm";
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

export default async function ContattiPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ContactsPage");
  const site = await getSite();
  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        <div>
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-zinc-400">{t("intro")}</p>
          </FadeIn>

          <ul className="mt-12 space-y-6">
            <li>
              <FadeIn delay={0.05}>
                <div className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-[#c9a227]" />
                  <div>
                    <p className="text-sm text-zinc-500">{t("phone")}</p>
                    <a
                      href={`tel:${site.phoneTel}`}
                      className="text-lg font-medium text-white hover:text-[#c9a227]"
                    >
                      {site.phoneDisplay}
                    </a>
                  </div>
                </div>
              </FadeIn>
            </li>
            <li>
              <FadeIn delay={0.1}>
                <div className="flex gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-[#c9a227]" />
                  <div>
                    <p className="text-sm text-zinc-500">{t("email")}</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-lg font-medium text-white hover:text-[#c9a227]"
                    >
                      {site.email}
                    </a>
                  </div>
                </div>
              </FadeIn>
            </li>
            <li>
              <FadeIn delay={0.12}>
                <div className="flex gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-[#c9a227]" />
                  <div>
                    <p className="text-sm text-zinc-500">{t("pec")}</p>
                    <a
                      href={`mailto:${site.pec}`}
                      className="text-lg font-medium text-white hover:text-[#c9a227]"
                    >
                      {site.pec}
                    </a>
                  </div>
                </div>
              </FadeIn>
            </li>
            <li>
              <FadeIn delay={0.2}>
                <div className="flex gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-[#c9a227]" />
                  <div>
                    <p className="text-sm text-zinc-500">{t("hours")}</p>
                    <p className="text-white">{t("hoursValue")}</p>
                  </div>
                </div>
              </FadeIn>
            </li>
          </ul>

          {site.publicReviewUrl ? (
            <FadeIn delay={0.22}>
              <p className="mt-10 text-sm text-zinc-500">
                {t("reviewsPrefix")}{" "}
                <a
                  href={site.publicReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#c9a227] hover:underline"
                >
                  {t("reviewsLink")}
                </a>
              </p>
            </FadeIn>
          ) : null}

          <FadeIn delay={0.25}>
            <Link
              href="/preventivo"
              className="mt-12 inline-flex rounded-full bg-[#c9a227] px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
            >
              {t("ctaQuote")}
            </Link>
          </FadeIn>
        </div>

        <div className="flex flex-col gap-8">
          <FadeIn delay={0.08}>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
