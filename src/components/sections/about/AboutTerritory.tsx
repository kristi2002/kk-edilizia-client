import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, MapPin } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkGrid } from "@/components/decor/Watermark";
import { PhotoGleam } from "@/components/decor/PhotoGleam";
import { ABOUT_IMAGERY } from "@/lib/media/about-imagery";
import { AREA_SERVED_CITY_NAMES } from "@/lib/constants/service-area";

/**
 * Where the firm works, and why that is a claim worth making on an about page.
 *
 * These are the only two photographs on the site that show Modena itself — arcades and
 * the Ghirlandina — and they are the honest kind of stock: a picture of a place we do
 * operate in, not a picture of work we are implying we did. Both are shown at full
 * strength with real `alt` for that reason.
 *
 * The town chips read from the same `AREA_SERVED_CITY_NAMES` constant as the hero and the
 * LocalBusiness schema, so the list cannot drift from the structured data.
 */
export async function AboutTerritory() {
  const t = await getTranslations("AboutPage");
  const tMedia = await getTranslations("AboutMedia");
  const tall = ABOUT_IMAGERY.ghirlandina;
  const wide = ABOUT_IMAGERY.porticiModena;

  return (
    <section
      className="rule-gold relative overflow-hidden bg-sunken px-4 py-24 sm:px-6"
      aria-labelledby="about-territory-heading"
    >
      <WatermarkGrid />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("territoryLabel")}
          </p>
          <h2
            id="about-territory-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl"
          >
            {t("territoryTitle")}
          </h2>

          <div className="mt-7 space-y-5 text-base leading-relaxed text-ink-2">
            <p>{t("territoryP1")}</p>
            <p>{t("territoryP2")}</p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2">
            {AREA_SERVED_CITY_NAMES.slice(0, 8).map((town) => (
              <li
                key={town}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3.5 py-1.5 text-xs font-medium text-ink-3"
              >
                <MapPin className="h-3.5 w-3.5 text-accent-ink" aria-hidden />
                {town}
              </li>
            ))}
          </ul>

          <Link
            href="/impresa-edile-modena"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent-ink transition hover:border-accent/60 hover:bg-accent/20"
          >
            {t("territoryLink")}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </FadeIn>

        <FadeIn delay={0.08} className="lg:col-span-6">
          <div className="grid grid-cols-5 items-end gap-4">
            <figure className="col-span-3 overflow-hidden rounded-3xl border border-line shadow-xl shadow-black/5">
              <div className="photo-card relative aspect-[4/5]">
                <Image
                  src={tall.src}
                  alt={tMedia(tall.alt)}
                  fill
                  quality={72}
                  sizes="(min-width: 1024px) 340px, 55vw"
                  className="object-cover"
                />
                <PhotoGleam />
              </div>
            </figure>

            <figure className="col-span-2 overflow-hidden rounded-3xl border border-line shadow-xl shadow-black/5">
              <div className="photo-card relative aspect-[3/4]">
                <Image
                  src={wide.src}
                  alt={tMedia(wide.alt)}
                  fill
                  quality={72}
                  sizes="(min-width: 1024px) 220px, 36vw"
                  className="object-cover"
                />
                <PhotoGleam />
              </div>
            </figure>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
