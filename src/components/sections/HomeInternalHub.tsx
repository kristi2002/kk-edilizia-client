import { getTranslations } from "next-intl/server";
import { isPortfolioEnabled } from "@/lib/features";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { ArrowUpRight } from "lucide-react";

const LINKS = [
  { href: "/impresa-edile-modena" as const, titleKey: "linkImpresa" as const, descKey: "descImpresa" as const },
  {
    href: "/ristrutturazioni-chiavi-in-mano" as const,
    titleKey: "linkChiavi" as const,
    descKey: "descChiavi" as const,
  },
  {
    href: "/impianti-elettrici-modena" as const,
    titleKey: "linkElettrico" as const,
    descKey: "descElettrico" as const,
  },
  {
    href: "/idraulico-modena" as const,
    titleKey: "linkIdraulico" as const,
    descKey: "descIdraulico" as const,
  },
  {
    href: "/cartongesso-isolamento" as const,
    titleKey: "linkCartongesso" as const,
    descKey: "descCartongesso" as const,
  },
  { href: "/preventivo" as const, titleKey: "linkPreventivo" as const, descKey: "descPreventivo" as const },
  { href: "/prenota" as const, titleKey: "linkPrenota" as const, descKey: "descPrenota" as const },
  ...(isPortfolioEnabled()
    ? [{ href: "/portfolio" as const, titleKey: "linkPortfolio" as const, descKey: "descPortfolio" as const }]
    : []),
  { href: "/contatti" as const, titleKey: "linkContatti" as const, descKey: "descContatti" as const },
];

/** Crawlable internal links for local / commercial intent (Modena, servizi, preventivo). */
export async function HomeInternalHub() {
  const t = await getTranslations("HomeInternalHub");
  return (
    <section
      className="border-y border-line bg-raised px-4 py-20 sm:px-6"
      aria-labelledby="home-internal-hub-heading"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2
            id="home-internal-hub-heading"
            className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-3">{t("intro")}</p>
        </FadeIn>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((item, i) => (
            <li key={item.href}>
              <FadeIn delay={i * 0.05}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-raised p-5 transition hover:border-accent/35 hover:bg-raised"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-medium text-ink-1">{t(item.titleKey)}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-accent-ink opacity-70 transition group-hover:opacity-100" />
                  </span>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-3">
                    {t(item.descKey)}
                  </p>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
