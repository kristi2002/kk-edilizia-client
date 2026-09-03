import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Info } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";
import { PhotoGleam } from "@/components/decor/PhotoGleam";
import { ABOUT_IMAGERY, type AboutImageKey } from "@/lib/media/about-imagery";

/**
 * Six photographs in build order — open the site, masonry, scaffold, facade, shell,
 * handover — as an asymmetric mosaic rather than a two-up grid of placeholders.
 *
 * What was here before were two empty tiles with a camera glyph and copy addressed to
 * whoever maintains the repo ("upload files to public/images/ and update the paths"),
 * rendered to visitors in both languages. That is gone. These are real photographs, and
 * the note at the foot says plainly what they are: reference images under the Pexels
 * licence, not this company's own sites. The captions describe the *phase*, never a
 * project, because a stock photograph cannot be evidence of work we did.
 *
 * The `col-span` values are the whole design: three different tile widths across three
 * rows, so the eye moves rather than scanning a checkerboard. Below `lg` it collapses to
 * one and then two columns and the spans stop applying.
 */
type Tile = {
  image: AboutImageKey;
  captionKey: "g1" | "g2" | "g3" | "g4" | "g5" | "g6";
  /** Column span at `lg` and up, out of six. */
  span: string;
  ratio: string;
  /** Rendered width at `lg`, for the `sizes` hint. */
  width: string;
};

const TILES: Tile[] = [
  {
    image: "cantiereInterno",
    captionKey: "g1",
    span: "lg:col-span-4",
    ratio: "aspect-[3/2]",
    width: "740px",
  },
  /* Portrait at `lg` on purpose: at 2/6 of the row it has to reach the same height as the
     4-column tile beside it, or the grid stretches its caption into a white slab. */
  {
    image: "posaMattoni",
    captionKey: "g2",
    span: "lg:col-span-2",
    ratio: "aspect-[3/2] lg:aspect-[3/4]",
    width: "370px",
  },
  {
    image: "ponteggio",
    captionKey: "g3",
    span: "lg:col-span-2",
    ratio: "aspect-[4/3]",
    width: "370px",
  },
  {
    image: "facciataStorica",
    captionKey: "g4",
    span: "lg:col-span-2",
    ratio: "aspect-[4/3]",
    width: "370px",
  },
  {
    image: "mansarda",
    captionKey: "g5",
    span: "lg:col-span-2",
    ratio: "aspect-[4/3]",
    width: "370px",
  },
  {
    image: "consegna",
    captionKey: "g6",
    span: "lg:col-span-6",
    ratio: "aspect-[3/2] lg:aspect-[21/9]",
    width: "1120px",
  },
];

export async function AboutGallery() {
  const t = await getTranslations("AboutPage");
  const tMedia = await getTranslations("AboutMedia");

  return (
    <section
      className="relative overflow-hidden bg-page px-4 py-24 sm:px-6"
      aria-labelledby="about-gallery-heading"
    >
      <WatermarkWord>CANTIERE</WatermarkWord>

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("galleryEyebrow")}
          </p>
          <h2
            id="about-gallery-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl"
          >
            {t("galleryTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2">
            {t("galleryIntro")}
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {TILES.map((tile, i) => {
            const image = ABOUT_IMAGERY[tile.image];
            return (
              <FadeIn
                key={tile.captionKey}
                delay={(i % 3) * 0.06}
                className={`${tile.span} ${tile.captionKey === "g6" ? "sm:col-span-2" : ""}`}
              >
                <figure className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-raised transition duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10">
                  <div className={`photo-card relative ${tile.ratio}`}>
                    <Image
                      src={image.src}
                      alt={tMedia(image.alt)}
                      fill
                      quality={72}
                      sizes={`(min-width: 1024px) ${tile.width}, (min-width: 640px) 50vw, 100vw`}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <PhotoGleam />
                  </div>
                  <figcaption className="flex-1 border-t border-line px-5 py-4 text-sm leading-relaxed text-ink-3">
                    {t(tile.captionKey)}
                  </figcaption>
                </figure>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.1}>
          <p className="mt-8 flex items-start gap-2.5 text-xs leading-relaxed text-ink-4">
            <Info
              className="mt-px h-4 w-4 shrink-0 text-accent-ink"
              aria-hidden
            />
            {t("galleryNote")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
