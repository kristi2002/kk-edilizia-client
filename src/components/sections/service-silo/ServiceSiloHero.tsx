import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkGrid, WatermarkGutter, WatermarkRing } from "@/components/decor/Watermark";
import { SERVICE_IMAGERY } from "@/lib/media/service-imagery";
import type { ServiceSiloKey } from "@/lib/service-silos";
import { ArrowRight, ChevronRight, MapPin, ShieldCheck, UserCheck } from "lucide-react";

type Props = {
  siloKey: ServiceSiloKey;
  eyebrow: string;
  h1: string;
  lead: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

/**
 * The photographic hero.
 *
 * The silo pages used to open on the paper ground with a wordmark watermark and nothing
 * else — the only entry points on the site with no image above the fold, on the pages
 * search traffic actually lands on. This is the same dark band the home hero and the
 * closing CTA use, so the sequence of grounds down the page still alternates.
 *
 * The picture is a real `next/image` with `priority`, not a CSS background: it is the
 * LCP element on every one of these routes. Its `alt` is empty because the heading
 * beside it already names the work — it is a ground, not content — and the gallery
 * further down carries the described photographs.
 */
export async function ServiceSiloHero({
  siloKey,
  eyebrow,
  h1,
  lead,
  ctaPrimary,
  ctaSecondary,
}: Props) {
  const t = await getTranslations("ServiceSilos");
  const tNav = await getTranslations("Nav");
  const image = SERVICE_IMAGERY[siloKey].hero;

  const chips = [
    { icon: UserCheck, label: t("chipReferent") },
    { icon: ShieldCheck, label: t("chipCompliance") },
    { icon: MapPin, label: t("chipArea") },
  ];

  return (
    <section className="on-dark relative isolate overflow-hidden bg-inverse px-4 py-24 sm:px-6 lg:py-32">
      <Image
        src={image.src}
        alt=""
        fill
        priority
        quality={72}
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/*
       * Two scrims, not one. The linear pass keeps the left column dark enough for AA
       * body copy at every viewport; the radial pass lifts the right side back up so the
       * photograph is still legible as a picture rather than a texture.
       */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(12,14,16,0.95)_0%,rgba(12,14,16,0.88)_38%,rgba(12,14,16,0.62)_66%,rgba(12,14,16,0.5)_100%)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_88%_18%,rgba(201,162,39,0.16),transparent_46%)]"
      />
      <WatermarkGrid />
      <WatermarkRing position="bottom-right" />
      <WatermarkGutter>K.K EDILIZIA — MODENA E PROVINCIA</WatermarkGutter>

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          {/* Visible breadcrumb: the JSON-LD one existed, the readable one did not. */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-ink-3">
              <li>
                <Link href="/" className="transition hover:text-accent-ink">
                  {tNav("home")}
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
              <li aria-current="page" className="text-ink-2">
                {eyebrow}
              </li>
            </ol>
          </nav>
        </FadeIn>

        <div className="max-w-2xl">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-balance font-serif text-4xl leading-[1.08] text-ink-1 sm:text-5xl lg:text-6xl">
              {h1}
            </h1>
            <span
              aria-hidden="true"
              className="mt-7 block h-[3px] w-24 rounded bg-gradient-to-r from-accent to-transparent"
            />
            <p className="mt-7 text-lg leading-relaxed text-ink-2">{lead}</p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/preventivo"
                className="sweep inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-on-accent transition hover:bg-accent-deep"
              >
                {ctaPrimary}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center rounded-full border border-line-2 px-8 py-3.5 text-sm font-semibold text-ink-1 transition hover:border-accent/60 hover:bg-raised"
              >
                {ctaSecondary}
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {chips.map((chip) => (
                <li
                  key={chip.label}
                  className="flex items-center gap-2 text-sm font-medium text-ink-3"
                >
                  <chip.icon className="h-4 w-4 text-accent-ink" aria-hidden />
                  {chip.label}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
