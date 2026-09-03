import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkRing } from "@/components/decor/Watermark";
import { HOME_IMAGERY } from "@/lib/media/home-imagery";

/**
 * Materials strip.
 *
 * This absorbed the separate `BrandEcosystemStrip`, which sat four sections further down
 * and said the same thing twice: both blocks led with a "we are not an official dealer,
 * the quote lists equivalents" caveat, in slightly different words.
 *
 * The names are set as text, not logos, on purpose: reproducing manufacturer marks is a
 * trademark question, and the copy keeps the claim accurate ("or certified equivalents")
 * rather than implying a partnership that does not exist. The trailing disclaimer stays
 * for the same reason — the marquee still names the marks.
 */
export async function MaterialsMarquee() {
  const t = await getTranslations("Materials");
  const items = t("items")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      className="rule-gold relative isolate overflow-hidden bg-sunken px-4 py-16 sm:px-6"
      aria-labelledby="materials-heading"
    >
      {/*
       * Gold leaf, heavily dimmed: the one literally reflective surface on the page, and
       * the reason this band reads as metal rather than another pale panel.
       */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={HOME_IMAGERY.sheen.src}
          alt=""
          fill
          quality={70}
          sizes="100vw"
          className="object-cover opacity-[0.13] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sunken/70 via-sunken/40 to-sunken" />
      </div>

      <WatermarkRing position="top-right" />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2
            id="materials-heading"
            className="mt-3 max-w-2xl font-serif text-2xl text-ink-1 sm:text-3xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-3">
            {t("intro")}
          </p>
        </FadeIn>

        <div className="marq mt-10">
          {/* The list is duplicated so the -50% keyframe loops seamlessly. */}
          <ul className="marq-track" aria-hidden="true">
            {[...items, ...items].map((name, i) => (
              <li
                key={`${name}-${i}`}
                className="whitespace-nowrap px-7 font-sans text-lg font-semibold uppercase tracking-[0.14em] text-ink-3 sm:text-xl"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
        {/* Readable, non-animated copy of the same list for assistive tech. */}
        <p className="sr-only">{items.join(", ")}</p>

        <FadeIn delay={0.08}>
          <p className="mt-8 text-xs leading-relaxed text-ink-4">
            {t("disclaimer")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
