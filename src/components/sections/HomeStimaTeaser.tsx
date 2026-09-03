import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Calculator } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

export async function HomeStimaTeaser() {
  const t = await getTranslations("HomeStimaTeaser");

  return (
    <section className="scroll-mt-24 border-y border-line bg-page px-4 py-20 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
        <FadeIn className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-ink">
            <Calculator className="h-3.5 w-3.5" />
            {t("badge")}
          </div>
          <h2 className="mt-4 font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-ink-3">{t("body")}</p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <Link
            href="/stima-costi"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-on-accent transition hover:bg-accent-deep"
          >
            {t("cta")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
