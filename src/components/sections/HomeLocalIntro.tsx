import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";

/** Extra crawlable copy for local intent (Modena, servizi edili) without keyword stuffing. */
export async function HomeLocalIntro() {
  const t = await getTranslations("HomeLocalIntro");
  return (
    <section
      className="relative overflow-hidden border-b border-line bg-page px-4 py-24 sm:px-6"
      aria-labelledby="home-local-heading"
    >
      <WatermarkWord>MODENA</WatermarkWord>

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2
            id="home-local-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl"
          >
            {t("title")}
          </h2>
        </FadeIn>

        <FadeIn delay={0.08}>
          {/* Asymmetric two-column: the page ran nine identical centred stacks in a row. */}
          <div className="space-y-4 text-base leading-relaxed text-ink-2">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
            <p>{t("p4")}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
