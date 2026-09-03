import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";
import { Check } from "lucide-react";

export type SiloHeadingBlock = { title: string; body: string; bullets?: string[] };

type Props = {
  /** Paragraphs three through six: neighbourhoods, condominiums, permits, programme. */
  bodies: string[];
  headings: SiloHeadingBlock[];
};

/**
 * The long-form half of the page.
 *
 * This is the copy the silos were built for and it is unchanged — the same `messages`
 * keys, in the same order. What changed is that it no longer opens the page: a visitor
 * who wants the detail reaches it after the scope, the method and the process, and a
 * visitor who only wanted to know whether the firm does roofs has already been served.
 *
 * The heading blocks keep their gold rule and their bullet lists; the lists are the only
 * part of this section a scanner will read, so they sit outside the prose measure.
 */
export async function ServiceSiloDetail({ bodies, headings }: Props) {
  const t = await getTranslations("ServiceSilos");

  return (
    <section className="relative overflow-hidden border-y border-line bg-raised px-4 py-24 sm:px-6">
      <WatermarkWord>MODENA</WatermarkWord>
      <article className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("detailEyebrow")}
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl">
            {t("detailTitle")}
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-2">
            {bodies.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </FadeIn>

        {headings.length > 0 ? (
          <div className="mt-16 space-y-10">
            {headings.map((h, idx) => (
              <FadeIn key={`${idx}-${h.title}`} delay={0.04}>
                <div className="border-l-2 border-accent/30 pl-6">
                  <h3 className="font-serif text-2xl leading-tight text-ink-1">
                    {h.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-ink-2">{h.body}</p>
                  {Array.isArray(h.bullets) && h.bullets.length > 0 ? (
                    <ul className="mt-5 space-y-2.5">
                      {h.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex gap-3 text-sm leading-relaxed text-ink-3"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                            aria-hidden
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </FadeIn>
            ))}
          </div>
        ) : null}
      </article>
    </section>
  );
}
