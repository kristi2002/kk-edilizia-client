import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight, HardHat } from "lucide-react";
import { WatermarkGutter } from "@/components/decor/Watermark";
import { ABOUT_IMAGERY } from "@/lib/media/about-imagery";
import type { SiteData } from "@/lib/site";

/**
 * Opening band of `/chi-siamo`, and the page's LCP.
 *
 * The page used to start with an `<h1>` on the paper ground, which made it read as a
 * document rather than as part of the site — the home page opens on a dark band, the
 * closing CTA is a dark band, and this was neither. It is now the same dark plate,
 * carrying the one photograph on the site that is genuinely of Modena.
 *
 * The identity row is the reason this is a server component taking `site`: registered
 * name, VAT and REA are the first things a visitor checking up on a builder looks for,
 * and they are already in the footer — repeating them at the top of the page that
 * *is* the "who are you" answer costs nothing and saves a scroll.
 */
export async function AboutHero({
  site,
  locale,
}: {
  site: SiteData;
  locale: string;
}) {
  const t = await getTranslations("AboutPage");
  const tMedia = await getTranslations("AboutMedia");
  const image = ABOUT_IMAGERY.modenaSkyline;
  /** Same rule as the footer and the contacts aside: the area is stored per locale. */
  const area = locale === "en" ? site.serviceAreaEn : site.serviceArea;

  const identity = [
    { label: t("identityLegal"), value: site.legalName },
    { label: t("identityVat"), value: site.vatId },
    { label: t("identityRea"), value: site.rea },
  ];

  return (
    <section className="on-dark relative isolate overflow-hidden bg-inverse px-4 py-24 sm:px-6 lg:py-32">
      {/*
        The photograph is the ground, not an illustration: it sits under a scrim that is
        near-opaque where the type runs and clears toward the top right, so the skyline
        is legible without ever deciding the contrast of the heading.
      */}
      <Image
        src={image.src}
        alt={tMedia(image.alt)}
        fill
        priority
        quality={70}
        sizes="100vw"
        className="-z-10 object-cover object-top"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,#14171a_18%,rgba(20,23,26,0.92)_46%,rgba(20,23,26,0.62)_100%)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-inverse to-transparent"
      />

      <WatermarkGutter>K.K EDILIZIA — MODENA E PROVINCIA</WatermarkGutter>

      <div className="relative mx-auto max-w-6xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent-ink backdrop-blur-sm">
          <HardHat className="h-3.5 w-3.5" aria-hidden />
          {t("heroBadge")}
        </p>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl leading-[1.08] tracking-tight text-ink-1 sm:text-5xl md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          {t("intro", { brand: site.brand })}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/preventivo"
            className="sweep group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-on-accent shadow-lg shadow-black/25 transition hover:-translate-y-0.5"
          >
            {t("heroCta")}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
          <Link
            href="/prenota"
            className="inline-flex items-center rounded-full border border-line-2 px-7 py-3.5 text-sm font-semibold text-ink-1 backdrop-blur-sm transition hover:bg-raised-2"
          >
            {t("heroCtaSecondary")}
          </Link>
        </div>

        <dl className="mt-14 grid gap-x-8 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {identity.map((row) => (
            <div key={row.label}>
              <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent-ink">
                {row.label}
              </dt>
              <dd className="mt-1.5 text-sm text-ink-2">{row.value}</dd>
            </div>
          ))}
          <div>
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {t("identityArea")}
            </dt>
            <dd className="mt-1.5 text-sm text-ink-2">{area}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
