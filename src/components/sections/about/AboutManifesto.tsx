import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";
import { PhotoGleam } from "@/components/decor/PhotoGleam";
import { ABOUT_IMAGERY } from "@/lib/media/about-imagery";

/**
 * The page's main prose block: what "one site, one point of contact" actually means.
 *
 * Two photographs rather than one, overlapping: a 4:5 vertical of a wall being skimmed,
 * with a 1:1 detail of a brick going down on mortar sitting over its lower corner. The
 * overlap is what stops the column reading as a stock-photo slot — and both are shown at
 * full strength with real `alt`, because unlike the pillar grounds they are content.
 */
export async function AboutManifesto() {
  const t = await getTranslations("AboutPage");
  const tMedia = await getTranslations("AboutMedia");
  const main = ABOUT_IMAGERY.intonaco;
  const inset = ABOUT_IMAGERY.muraturaDettaglio;

  return (
    <section
      className="relative overflow-hidden border-b border-line bg-page px-4 py-24 sm:px-6"
      aria-labelledby="about-craft-heading"
    >
      <WatermarkWord>MESTIERE</WatermarkWord>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-5">
          {/* The padding is what the inset overhangs into; without it the shadow clips. */}
          <div className="relative pb-12 pr-6 sm:pb-16 sm:pr-10">
            <figure className="relative overflow-hidden rounded-3xl border border-line shadow-xl shadow-black/5">
              <div className="photo-card relative aspect-[4/5]">
                <Image
                  src={main.src}
                  alt={tMedia(main.alt)}
                  fill
                  quality={72}
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 85vw"
                  className="object-cover"
                />
                <PhotoGleam />
              </div>
            </figure>

            <figure className="absolute bottom-0 right-0 w-32 overflow-hidden rounded-2xl border-4 border-page shadow-xl shadow-black/10 sm:w-44 lg:w-48">
              <div className="photo-card relative aspect-square">
                <Image
                  src={inset.src}
                  alt={tMedia(inset.alt)}
                  fill
                  quality={72}
                  sizes="(min-width: 1024px) 200px, 180px"
                  className="object-cover"
                />
                <PhotoGleam />
              </div>
            </figure>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("craftLabel")}
          </p>
          <h2
            id="about-craft-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl"
          >
            {t("craftTitle")}
          </h2>
          <span
            aria-hidden="true"
            className="mt-6 block h-[2px] w-20 bg-gradient-to-r from-accent to-accent/10"
          />

          <div className="mt-7 space-y-5 text-base leading-relaxed text-ink-2">
            <p className="text-lg">{t("craftP1")}</p>
            <p>{t("craftP2")}</p>
            <p>{t("craftP3")}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
