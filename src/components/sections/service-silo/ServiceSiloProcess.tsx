import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkRing } from "@/components/decor/Watermark";

type Step = { title: string; text: string };

/**
 * The five stages, as a timeline rather than a paragraph.
 *
 * `body1` on every silo already describes this sequence — survey, written quote, permits,
 * site, handover — but describes it in a block of running text a visitor has to parse.
 * The copy stays where it is; this restates the spine of it as five stops so the shape of
 * the engagement is legible in three seconds.
 *
 * Shared across all nine silos on purpose: the process genuinely does not change between
 * a bathroom and a roof, and nine near-identical rewrites would only invite drift.
 */
export async function ServiceSiloProcess() {
  const t = await getTranslations("ServiceSilos");
  const steps = t.raw("process") as Step[];
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-line bg-sunken px-4 py-24 sm:px-6">
      <WatermarkRing position="top-right" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("processEyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl">
            {t("processTitle")}
          </h2>
        </FadeIn>

        <ol className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {/* The rail runs behind the discs; on narrow viewports the steps stack and it
              would only cut across the copy, so it is drawn from `lg` up. */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-accent/45 to-transparent lg:block"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <FadeIn delay={i * 0.07}>
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/35 bg-raised font-serif text-lg text-accent-ink shadow-sm"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-serif text-lg leading-tight text-ink-1">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">{step.text}</p>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
