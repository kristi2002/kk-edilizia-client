import { Link } from "@/i18n/navigation";
import { FaqPageJsonLd } from "@/components/seo/FaqPageJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkRing } from "@/components/decor/Watermark";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedPath } from "@/lib/i18n-path";
import { serviceSiloPathForKey, type ServiceSiloKey } from "@/lib/service-silos";
import { ArrowRight } from "lucide-react";
import { ServiceSiloHero } from "./ServiceSiloHero";
import { ServiceSiloScope, type ScopeItem } from "./ServiceSiloScope";
import { ServiceSiloIntro } from "./ServiceSiloIntro";
import { ServiceSiloProcess } from "./ServiceSiloProcess";
import { ServiceSiloGallery } from "./ServiceSiloGallery";
import { ServiceSiloDetail, type SiloHeadingBlock } from "./ServiceSiloDetail";
import { ServiceSiloZones } from "./ServiceSiloZones";
import { ServiceSiloFaq, type SiloFaq } from "./ServiceSiloFaq";
import { ServiceSiloSiblings } from "./ServiceSiloSiblings";
import itMessages from "../../../../messages/it.json";
import enMessages from "../../../../messages/en.json";

type Props = {
  locale: string;
  siloKey: ServiceSiloKey;
};

/**
 * Template for the nine service silos.
 *
 * These are the pages the entire search strategy points at. They used to render as a
 * single 768px column of grey paragraphs — no photography anywhere above or below the
 * fold, no scope list, one CTA pair, and the cross-links to the other eight silos set as
 * bare text rows.
 *
 * The copy is still the same `messages` keys; what is new is everything around it. The
 * page now runs the home page's own alternation of grounds — dark hero, white scope grid,
 * paper, sunken process, paper gallery, white long-form, sunken zones, paper FAQ, white
 * siblings, gold band — over four photographs unique to each silo
 * (`src/lib/media/service-imagery.ts`), and the long-form prose is split so that the two
 * paragraphs that answer "how do you work" sit near the top while the four that answer
 * "what about my condominium, my permits, my street" sit below the process.
 *
 * `StatsStrip` is reused rather than reimplemented, exactly as `/chi-siamo` does: the
 * figures come from one namespace so no page can drift from the home page.
 */
export async function ServiceSiloContent({ locale, siloKey }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("ServiceSilos");
  const tNav = await getTranslations("Nav");
  const bundle = locale === "en" ? enMessages : itMessages;

  const silo = bundle.ServiceSilos?.[siloKey] as
    | (Record<string, unknown> & {
        eyebrow?: string;
        h1?: string;
        lead?: string;
        metaDescription?: string;
        ctaPrimary?: string;
        ctaSecondary?: string;
        scope?: ScopeItem[];
        gallery?: string[];
        headings?: SiloHeadingBlock[];
        faqs?: SiloFaq[];
      })
    | undefined;

  const h1 = silo?.h1 ?? t(`${siloKey}.h1`);
  const eyebrow = silo?.eyebrow ?? t(`${siloKey}.eyebrow`);
  const ctaPrimary = silo?.ctaPrimary ?? t(`${siloKey}.ctaPrimary`);
  const ctaSecondary = silo?.ctaSecondary ?? t(`${siloKey}.ctaSecondary`);
  const path = serviceSiloPathForKey(siloKey);
  const metaDescription =
    silo?.metaDescription ?? t(`${siloKey}.metaDescription`);

  /** Six paragraphs, read off the bundle so a missing key falls back to `t()`. */
  const bodies = (
    ["body1", "body2", "body3", "body4", "body5", "body6"] as const
  ).map((key) => {
    const v = silo?.[key];
    return typeof v === "string" && v.trim().length > 0 ? v : t(`${siloKey}.${key}`);
  });

  const scope = Array.isArray(silo?.scope) ? silo!.scope! : [];
  const gallery = Array.isArray(silo?.gallery) ? silo!.gallery! : [];
  const headings = Array.isArray(silo?.headings) ? silo!.headings! : [];
  const faqs = Array.isArray(silo?.faqs) ? silo!.faqs! : [];

  return (
    <>
      <FaqPageJsonLd
        items={faqs.map((f) => ({ question: f.q, answer: f.a }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: tNav("home"), path: localizedPath(locale, "/") },
          { name: h1, path: localizedPath(locale, path) },
        ]}
      />
      {/* The type that ties this page to the business offering it. */}
      <ServiceJsonLd
        name={h1}
        description={metaDescription}
        path={localizedPath(locale, path)}
        serviceType={eyebrow}
        offers={scope.map((item) => item.title)}
      />

      <main className="flex flex-1 flex-col">
        <ServiceSiloHero
          siloKey={siloKey}
          eyebrow={eyebrow}
          h1={h1}
          lead={silo?.lead ?? t(`${siloKey}.lead`)}
          ctaPrimary={ctaPrimary}
          ctaSecondary={ctaSecondary}
        />
        <StatsStrip />
        <ServiceSiloScope items={scope} />
        <ServiceSiloIntro siloKey={siloKey} bodies={bodies.slice(0, 2)} />
        <ServiceSiloProcess />
        <ServiceSiloGallery siloKey={siloKey} captions={gallery} />
        <ServiceSiloDetail bodies={bodies.slice(2)} headings={headings} />
        <ServiceSiloZones />
        <ServiceSiloFaq items={faqs} eyebrow="FAQ" title={t("faqTitle")} />
        <ServiceSiloSiblings siloKey={siloKey} />

        {/* ---------- Closing CTA ---------- */}
        <section className="on-band relative overflow-hidden bg-[linear-gradient(120deg,#6b511d_0%,#75591f_55%,#806322_100%)] px-4 py-24 sm:px-6">
          <WatermarkRing position="bottom-left" />
          <div className="relative mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="text-balance font-serif text-3xl text-ink-1 sm:text-4xl">
                {t("closingTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-2">{t("closingBody")}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/preventivo"
                  className="sweep inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#6b511d] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {ctaPrimary}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/prenota"
                  className="inline-flex items-center justify-center rounded-full border border-line-2 px-8 py-3.5 text-sm font-semibold text-ink-1 transition hover:border-accent/50 hover:bg-raised"
                >
                  {tNav("booking")}
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
    </>
  );
}
