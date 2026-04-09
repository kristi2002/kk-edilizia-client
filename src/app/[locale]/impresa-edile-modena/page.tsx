import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import { localizedPath } from "@/lib/i18n-path";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

const PATH = "/impresa-edile-modena";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = locale === "en" ? enMessages.Metadata : itMessages.Metadata;
  return withLocaleAlternates(locale, PATH, {
    title: meta.impresaEdileModenaTitle,
    description: meta.impresaEdileModenaDescription,
    openGraph: {
      title: meta.impresaEdileModenaTitle,
      description: meta.impresaEdileModenaDescription,
    },
  });
}

export default async function ImpresaEdileModenaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ImpresaEdileModenaPage");
  const tNav = await getTranslations("Nav");

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5") },
  ];

  const internals = [
    { href: "/ristrutturazioni-chiavi-in-mano" as const, label: t("internalChiavi") },
    { href: "/preventivo" as const, label: t("internalPreventivo") },
    { href: "/prenota" as const, label: t("internalPrenota") },
    { href: "/portfolio" as const, label: t("internalPortfolio") },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tNav("home"), path: localizedPath(locale, "/") },
          { name: t("title"), path: localizedPath(locale, PATH) },
        ]}
      />
      <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
        <article className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">{t("title")}</h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-400">{t("intro")}</p>
          </FadeIn>

          <div className="mt-12 space-y-6 text-base leading-relaxed text-zinc-400">
            {[t("p1"), t("p2"), t("p3"), t("p4")].map((p, i) => (
              <FadeIn key={i} delay={0.04 * (i + 1)}>
                <p>{p}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a227]">
                {t("internalTitle")}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {internals.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#c9a227] underline-offset-2 hover:text-[#ddb92e] hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <section className="mt-16" aria-labelledby="impresa-faq-heading">
            <FadeIn delay={0.24}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
                {t("faqLabel")}
              </p>
              <h2
                id="impresa-faq-heading"
                className="mt-3 font-serif text-2xl text-white sm:text-3xl"
              >
                {t("faqTitle")}
              </h2>
            </FadeIn>
            <dl className="mt-8 space-y-6">
              {faqs.map((item, i) => (
                <FadeIn key={item.q} delay={0.06 * i}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
                    <dt className="font-medium text-white">{item.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-zinc-400">{item.a}</dd>
                  </div>
                </FadeIn>
              ))}
            </dl>
          </section>
        </article>
      </main>
    </>
  );
}
