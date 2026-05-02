import { getTranslations } from "next-intl/server";

/** Official manufacturer sites (editorial reference; we are not affiliated). */
const BRANDS = [
  { key: "mapei" as const, href: "https://www.mapei.com/it/it/" },
  { key: "kerakoll" as const, href: "https://www.kerakoll.com/it" },
  { key: "knauf" as const, href: "https://www.knauf.it/" },
  { key: "fassa" as const, href: "https://www.fassabortolo.it/" },
  { key: "bticino" as const, href: "https://www.bticino.it/" },
  { key: "vimar" as const, href: "https://www.vimar.eu/it" },
];

/**
 * Crawlable outbound links to established building brands (trust / topical context).
 * Copy makes clear materials are chosen per project; links are for user research.
 */
export async function BrandEcosystemStrip() {
  const t = await getTranslations("BrandEcosystem");
  return (
    <section
      className="border-y border-white/[0.06] bg-[#0a0a0a] px-4 py-16 sm:px-6"
      aria-labelledby="brand-ecosystem-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
          {t("label")}
        </p>
        <h2
          id="brand-ecosystem-heading"
          className="mt-3 font-serif text-2xl text-white sm:text-3xl"
        >
          {t("title")}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{t("intro")}</p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {BRANDS.map((b) => (
            <li key={b.key}>
              <a
                href={b.href}
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-[#c9a227]/40 hover:text-[#c9a227] sm:text-sm"
              >
                {t(`brands.${b.key}`)}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs leading-relaxed text-zinc-600">{t("disclaimer")}</p>
      </div>
    </section>
  );
}
