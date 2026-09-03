import { Link } from "@/i18n/navigation";
import { FaqPageJsonLd } from "@/components/seo/FaqPageJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  WatermarkGrid,
  WatermarkGutter,
  WatermarkRing,
  WatermarkWord,
} from "@/components/decor/Watermark";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedPath } from "@/lib/i18n-path";
import {
  SERVICE_SILO_ROUTES,
  serviceSiloPathForKey,
  type ServiceSiloKey,
} from "@/lib/service-silos";
import { ArrowRight, Check, MapPin, ShieldCheck } from "lucide-react";
import itMessages from "../../../../messages/it.json";
import enMessages from "../../../../messages/en.json";

type Props = {
  locale: string;
  siloKey: ServiceSiloKey;
};

type SiloFaq = { q: string; a: string };
type SiloHeadingBlock = { title: string; body: string; bullets?: string[] };

/**
 * Template for the nine service silos.
 *
 * These are the pages the entire search strategy points at, and they used to render as a
 * single 768px column of grey paragraphs with no structure a visitor could scan: no
 * scope list, no compliance framing beyond a bare paragraph, no breadcrumb, no sibling
 * links, and one CTA pair right at the bottom. The copy is unchanged — it is the same
 * `messages` keys — but it is now laid out as a landing page rather than a document.
 */
export async function ServiceSiloContent({ locale, siloKey }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("ServiceSilos");
  const tNav = await getTranslations("Nav");
  const tFooter = await getTranslations("Footer");
  const bundle = locale === "en" ? enMessages : itMessages;

  const silo = bundle.ServiceSilos?.[siloKey] as
    | (Record<string, unknown> & {
        eyebrow?: string;
        h1?: string;
        lead?: string;
        body1?: string;
        body2?: string;
        body3?: string;
        body4?: string;
        body5?: string;
        body6?: string;
        ctaPrimary?: string;
        ctaSecondary?: string;
        headings?: SiloHeadingBlock[];
        faqs?: SiloFaq[];
      })
    | undefined;

  const faqLd =
    Array.isArray(silo?.faqs) && silo!.faqs!.length > 0
      ? silo!.faqs!.map((f) => ({ question: f.q, answer: f.a }))
      : [];

  const h1 = silo?.h1 ?? t(`${siloKey}.h1`);
  const path = serviceSiloPathForKey(siloKey);

  const bodies = (
    ["body1", "body2", "body3", "body4", "body5", "body6"] as const
  ).map((key) => {
    const v = silo?.[key];
    return typeof v === "string" && v.trim().length > 0
      ? v
      : t(`${siloKey}.${key}`);
  });

  const siloLabels: Record<ServiceSiloKey, string> = {
    chiaviInMano: tFooter("linkChiaviInMano"),
    bagno: tFooter("linkBagno"),
    cucina: tFooter("linkCucina"),
    elettrico: tFooter("linkElettrico"),
    idraulico: tFooter("linkIdraulico"),
    murarie: tFooter("linkMurarie"),
    cartongessoIsolamento: tFooter("linkCartongessoIsolamento"),
    pavimentiRivestimenti: tFooter("linkPavimentiRivestimenti"),
    tettoFacciate: tFooter("linkTettoFacciate"),
  };
  const siblings = SERVICE_SILO_ROUTES.filter((r) => r.key !== siloKey);

  return (
    <>
      <FaqPageJsonLd items={faqLd} />
      <BreadcrumbJsonLd
        items={[
          { name: tNav("home"), path: localizedPath(locale, "/") },
          { name: h1, path: localizedPath(locale, path) },
        ]}
      />

      <main className="flex flex-1 flex-col">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-[#080808] px-4 py-20 sm:px-6">
          <WatermarkGrid />
          <WatermarkRing position="top-right" />
          <WatermarkGutter>K.K EDILIZIA — MODENA E PROVINCIA</WatermarkGutter>

          <div className="relative mx-auto max-w-3xl">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
                {silo?.eyebrow ?? t(`${siloKey}.eyebrow`)}
              </p>
              <h1 className="mt-3 text-balance font-serif text-4xl text-white md:text-5xl">
                {h1}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-2">
                {silo?.lead ?? t(`${siloKey}.lead`)}
              </p>
            </FadeIn>

            <FadeIn delay={0.08}>
              {/* CTAs moved above the fold: they used to sit only after ~2.000 words. */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/preventivo"
                  className="sweep inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
                >
                  {silo?.ctaPrimary ?? t(`${siloKey}.ctaPrimary`)}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/contatti"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-[#c9a227]/50 hover:text-[#c9a227]"
                >
                  {silo?.ctaSecondary ?? t(`${siloKey}.ctaSecondary`)}
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ---------- Area + compliance, as two labelled panels ---------- */}
        <section className="rule-gold border-b border-white/[0.06] bg-surface-warm px-4 py-14 sm:px-6">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            <FadeIn>
              <div className="h-full rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/[0.07] p-6">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c9a227]">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {t("areaPanelTitle")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {t("modenaArea")}
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-3">
                  <ShieldCheck className="h-4 w-4 text-[#c9a227]" aria-hidden />
                  {t("compliancePanelTitle")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-3">
                  {t("complianceModena")}
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ---------- Body copy ---------- */}
        <section className="relative overflow-hidden bg-surface-base px-4 py-20 sm:px-6">
          <WatermarkWord>MODENA</WatermarkWord>
          <article className="relative mx-auto max-w-3xl">
            <FadeIn>
              <div className="space-y-5 text-base leading-relaxed text-ink-2">
                {bodies.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </FadeIn>

            {Array.isArray(silo?.headings) && silo!.headings.length > 0 ? (
              <div className="mt-16 space-y-10">
                {silo!.headings.map((h, idx) => (
                  <FadeIn key={`${idx}-${h.title}`} delay={0.04}>
                    <div className="border-l-2 border-[#c9a227]/30 pl-6">
                      <h2 className="font-serif text-2xl text-white">
                        {h.title}
                      </h2>
                      <p className="mt-3 text-base leading-relaxed text-ink-2">
                        {h.body}
                      </p>
                      {Array.isArray(h.bullets) && h.bullets.length > 0 ? (
                        <ul className="mt-5 space-y-2.5">
                          {h.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex gap-3 text-sm leading-relaxed text-ink-3"
                            >
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227]"
                                aria-hidden
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </FadeIn>
                ))}
              </div>
            ) : null}
          </article>
        </section>

        {/* ---------- FAQ ---------- */}
        {Array.isArray(silo?.faqs) && silo!.faqs.length > 0 ? (
          <section className="rule-gold bg-surface-warm px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <FadeIn>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
                  FAQ
                </p>
                <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">
                  {t("faqTitle")}
                </h2>
              </FadeIn>
              <dl className="mt-9 space-y-3">
                {silo!.faqs.map((f, i) => (
                  <FadeIn key={f.q} delay={i * 0.04}>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                      <dt className="font-semibold text-white">{f.q}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-ink-3">
                        {f.a}
                      </dd>
                    </div>
                  </FadeIn>
                ))}
              </dl>
            </div>
          </section>
        ) : null}

        {/* ---------- Sibling services: spreads link equity across the silo set ---------- */}
        <section className="rule-gold relative overflow-hidden bg-surface-base px-4 py-20 sm:px-6">
          <WatermarkRing position="bottom-left" />
          <div className="relative mx-auto max-w-5xl">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
                {tNav("services")}
              </p>
              <h2 className="mt-3 font-serif text-2xl text-white sm:text-3xl">
                {t("siblingsTitle")}
              </h2>
            </FadeIn>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {siblings.map((r, i) => (
                <FadeIn key={r.path} delay={i * 0.03}>
                  <Link
                    href={r.path}
                    className="group flex h-full items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#c9a227]/35 hover:bg-white/[0.06]"
                  >
                    <span className="text-sm font-medium text-ink-2 group-hover:text-white">
                      {siloLabels[r.key]}
                    </span>
                    <ArrowRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227] opacity-60 transition group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </FadeIn>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Closing CTA ---------- */}
        <section className="relative overflow-hidden bg-surface-deep px-4 py-20 sm:px-6">
          <div className="pointer-events-none absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#c9a227]/15 blur-3xl" />
          <div className="relative mx-auto max-w-3xl text-center">
            <FadeIn>
              <h2 className="text-balance font-serif text-3xl text-white sm:text-4xl">
                {t("closingTitle")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-ink-2">
                {t("closingBody")}
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/preventivo"
                  className="sweep inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
                >
                  {silo?.ctaPrimary ?? t(`${siloKey}.ctaPrimary`)}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/prenota"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-[#c9a227]/50 hover:text-[#c9a227]"
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
