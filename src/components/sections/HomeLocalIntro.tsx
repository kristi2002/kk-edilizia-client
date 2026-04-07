import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";

/** Extra crawlable copy for local intent (Modena, servizi edili) without keyword stuffing. */
export async function HomeLocalIntro() {
  const t = await getTranslations("HomeLocalIntro");
  return (
    <section
      className="relative border-y border-white/[0.06] bg-[#0c0c0c] px-4 py-20 sm:px-6"
      aria-labelledby="home-local-heading"
    >
      <div className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("label")}
          </p>
          <h2
            id="home-local-heading"
            className="mt-3 font-serif text-2xl text-white sm:text-3xl"
          >
            {t("title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-400">{t("p1")}</p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">{t("p2")}</p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">{t("p3")}</p>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">{t("p4")}</p>
        </FadeIn>
      </div>
    </section>
  );
}
