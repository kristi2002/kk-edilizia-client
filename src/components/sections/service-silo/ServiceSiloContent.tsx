import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ServiceSiloKey } from "@/lib/service-silos";
import { ArrowRight } from "lucide-react";

type Props = {
  locale: string;
  siloKey: ServiceSiloKey;
};

export async function ServiceSiloContent({ locale, siloKey }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("ServiceSilos");

  return (
    <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t(`${siloKey}.eyebrow`)}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
            {t(`${siloKey}.h1`)}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            {t(`${siloKey}.lead`)}
          </p>
        </FadeIn>

        <FadeIn delay={0.06}>
          <p className="mt-8 rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/10 px-5 py-4 text-sm leading-relaxed text-zinc-300">
            {t("modenaArea")}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 space-y-5 text-base leading-relaxed text-zinc-400">
            <p>{t(`${siloKey}.body1`)}</p>
            <p>{t(`${siloKey}.body2`)}</p>
            <p>{t(`${siloKey}.body3`)}</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.14}>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/preventivo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
            >
              {t(`${siloKey}.ctaPrimary`)}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-[#c9a227]/50 hover:text-[#c9a227]"
            >
              {t(`${siloKey}.ctaSecondary`)}
            </Link>
          </div>
        </FadeIn>
      </article>
    </main>
  );
}
