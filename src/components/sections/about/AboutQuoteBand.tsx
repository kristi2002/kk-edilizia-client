import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ABOUT_IMAGERY } from "@/lib/media/about-imagery";

/**
 * A single sentence on a dark, full-bleed plate, between the prose block and the pillars.
 *
 * It exists as pacing: without it the page runs four text-and-picture layouts in a row.
 * The photograph is decorative — a bench, a tape measure, shavings — so it takes an empty
 * `alt` and stays out of the accessibility tree; the sentence is the content.
 */
export async function AboutQuoteBand() {
  const t = await getTranslations("AboutPage");
  const image = ABOUT_IMAGERY.utensili;

  return (
    <section className="rule-gold on-dark relative isolate overflow-hidden bg-inverse px-4 py-24 sm:px-6">
      {/*
        `quality` has to be one of `images.qualities` in next.config.ts — 75, 72 or 70.
        This was 65, which the optimiser refuses outright ("q" parameter of 65 is not
        allowed), so the band rendered as flat ink with no photograph behind it. 70 is
        the floor of that list, and the value `AboutHero` already uses for its own
        full-bleed ground.
      */}
      <Image
        src={image.src}
        alt=""
        aria-hidden="true"
        fill
        quality={70}
        loading="lazy"
        sizes="100vw"
        className="-z-10 object-cover opacity-80"
      />
      {/*
        The source is already a dark frame (luma 63 of 255), so it needs far less scrim
        than a normal photograph: at the 45% opacity a mid-toned picture wants, this one
        went to flat black and the band stopped being a photograph at all. The vignette
        is strongest behind the sentence and clears at the edges.
      */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_115%_at_50%_50%,rgba(20,23,26,0.86),rgba(20,23,26,0.55))]"
      />

      <figure className="relative mx-auto max-w-3xl text-center">
        <span
          aria-hidden="true"
          className="block font-serif text-6xl leading-none text-accent/70"
        >
          &ldquo;
        </span>
        <blockquote className="mt-2 text-balance font-serif text-2xl leading-snug text-ink-1 sm:text-3xl md:text-4xl">
          {t("quote")}
        </blockquote>
        <figcaption className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
          {t("quoteSource")}
        </figcaption>
      </figure>
    </section>
  );
}
