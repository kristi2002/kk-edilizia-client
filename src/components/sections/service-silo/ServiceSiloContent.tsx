import { Link } from "@/i18n/navigation";
import { FaqPageJsonLd } from "@/components/seo/FaqPageJsonLd";
import { FadeIn } from "@/components/motion/FadeIn";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ServiceSiloKey } from "@/lib/service-silos";
import { ArrowRight } from "lucide-react";
import itMessages from "../../../../messages/it.json";
import enMessages from "../../../../messages/en.json";

type Props = {
  locale: string;
  siloKey: ServiceSiloKey;
};

type SiloFaq = { q: string; a: string };
type SiloHeadingBlock = { title: string; body: string; bullets?: string[] };

export async function ServiceSiloContent({ locale, siloKey }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("ServiceSilos");
  const bundle = locale === "en" ? enMessages : itMessages;
  const silo = bundle.ServiceSilos?.[siloKey] as
    | (Record<string, unknown> & {
        eyebrow?: string;
        h1?: string;
        lead?: string;
        body1?: string;
        body2?: string;
        body3?: string;
        body4?: string;
        body5?: string;
        body6?: string;
        ctaPrimary?: string;
        ctaSecondary?: string;
        headings?: SiloHeadingBlock[];
        faqs?: SiloFaq[];
      })
    | undefined;

  const faqLd =
    Array.isArray(silo?.faqs) && silo!.faqs!.length > 0
      ? silo!.faqs!.map((f) => ({ question: f.q, answer: f.a }))
      : [];

  return (
    <>
      <FaqPageJsonLd items={faqLd} />
      <main className="flex flex-1 flex-col bg-[#080808] px-4 py-20 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {silo?.eyebrow ?? t(`${siloKey}.eyebrow`)}
          </p>
          <h1 className="mt-3 font-serif text-4xl text-white md:text-5xl">
            {silo?.h1 ?? t(`${siloKey}.h1`)}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            {silo?.lead ?? t(`${siloKey}.lead`)}
          </p>
        </FadeIn>

        <FadeIn delay={0.06}>
          <p className="mt-8 rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/10 px-5 py-4 text-sm leading-relaxed text-zinc-300">
            {t("modenaArea")}
          </p>
        </FadeIn>

        <FadeIn delay={0.07}>
          <p className="mt-6 border-l-2 border-[#c9a227]/40 pl-4 text-sm leading-relaxed text-zinc-400">
            {t("complianceModena")}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 space-y-5 text-base leading-relaxed text-zinc-400">
            {(["body1", "body2", "body3", "body4", "body5", "body6"] as const).map(
              (key) => {
                const v = silo?.[key];
                if (typeof v === "string" && v.trim().length > 0) {
                  return <p key={key}>{v}</p>;
                }
                return <p key={key}>{t(`${siloKey}.${key}`)}</p>;
              },
            )}
          </div>
        </FadeIn>

        {Array.isArray(silo?.headings) && silo!.headings.length > 0 ? (
          <FadeIn delay={0.12}>
            <section className="mt-14 space-y-8">
              {silo!.headings.map((h, idx) => (
                <div key={`${idx}-${h.title}`}>
                  <h2 className="font-serif text-2xl text-white">{h.title}</h2>
                  <p className="mt-3 text-base leading-relaxed text-zinc-400">
                    {h.body}
                  </p>
                  {Array.isArray(h.bullets) && h.bullets.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-400">
                      {h.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>
          </FadeIn>
        ) : null}

        {Array.isArray(silo?.faqs) && silo!.faqs.length > 0 ? (
          <FadeIn delay={0.13}>
            <section className="mt-14">
              <h2 className="font-serif text-2xl text-white">FAQ</h2>
              <dl className="mt-6 space-y-6">
                {silo!.faqs.map((f) => (
                  <div key={f.q} className="rounded-2xl border border-white/10 p-5">
                    <dt className="font-semibold text-white">{f.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </FadeIn>
        ) : null}

        <FadeIn delay={0.14}>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/preventivo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
            >
              {silo?.ctaPrimary ?? t(`${siloKey}.ctaPrimary`)}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contatti"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-[#c9a227]/50 hover:text-[#c9a227]"
            >
              {silo?.ctaSecondary ?? t(`${siloKey}.ctaSecondary`)}
            </Link>
          </div>
        </FadeIn>
      </article>
    </main>
    </>
  );
}
