import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";
import { HOME_IMAGERY } from "@/lib/media/home-imagery";

/**
 * Local-intent copy for Modena. Still the page's main crawlable prose block.
 *
 * It used to run four dense paragraphs — 266 words — stacked against the heading, which
 * is where most of the "too much text" came from. Two short paragraphs now carry the
 * claim and `p3`/`p4` sit inside a `<details>`.
 *
 * That disclosure is a plain `<details>`, not a JS toggle, precisely so the copy is in
 * the served HTML whether or not it is open: collapsed text is indexed, text that never
 * renders is not. Every term the block was carrying — CILA, SCIA, Regolamento edilizio
 * del Comune di Modena, Sassuolo/Carpi/Formigine, Mapei/Kerakoll/Knauf — is still there.
 */
export async function HomeLocalIntro() {
  const t = await getTranslations("HomeLocalIntro");
  const tMedia = await getTranslations("HomeMedia");
  const image = HOME_IMAGERY.edilizia;

  return (
    <section
      className="relative overflow-hidden border-b border-line bg-page px-4 py-24 sm:px-6"
      aria-labelledby="home-local-heading"
    >
      <WatermarkWord>MODENA</WatermarkWord>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <figure className="relative overflow-hidden rounded-3xl border border-line shadow-xl shadow-black/5">
            <div className="photo-card relative aspect-[4/3]">
              <Image
                src={image.src}
                alt={tMedia(image.alt)}
                fill
                quality={72}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
              <span className="photo-card__gleam" aria-hidden="true" />
            </div>
            {/* Polished reflection under the plate, echoing the floors we lay. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent"
            />
          </figure>
        </FadeIn>

        <FadeIn delay={0.08}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2
            id="home-local-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl"
          >
            {t("title")}
          </h2>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-2">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>

          <details className="group mt-6 border-t border-line pt-4">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent-ink marker:content-none [&::-webkit-details-marker]:hidden">
              {t("moreLabel")}
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="h-4 w-4 transition-transform duration-300 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-3">
              <p>{t("p3")}</p>
              <p>{t("p4")}</p>
            </div>
          </details>
        </FadeIn>
      </div>
    </section>
  );
}
