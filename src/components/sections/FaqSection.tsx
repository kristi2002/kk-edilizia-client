"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { visibleFaqByLocale } from "@/lib/data/faq";
import { FadeIn } from "@/components/motion/FadeIn";

/**
 * Accordion.
 *
 * Every answer is rendered into the HTML and collapsed with CSS. It previously mounted
 * only the open panel (`{isOpen && <motion.div>}`), so the served markup carried every
 * question and exactly one answer — hundreds of words of CILA/SCIA, bonus and Modena
 * copy that no crawler could ever see, and that the page's own FAQPage schema is
 * supposed to mirror.
 *
 * The collapse is a `0fr → 1fr` grid row rather than an animated height, so nothing has
 * to be measured and the panel keeps its place in the document at every frame.
 * `visibility` is what closes it for assistive tech: it drops the panel out of the
 * accessibility tree and out of the tab order while leaving it in the markup, which
 * `overflow: hidden` alone would not do.
 */
export function FaqSection() {
  const t = useTranslations("FaqSection");
  const locale = useLocale();
  const faqItems =
    visibleFaqByLocale[locale === "en" ? "en" : "it"] ?? visibleFaqByLocale.it;
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section id="faq" className="relative bg-page px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(201,162,39,0.05),transparent_45%)]" />
      <div className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-ink-3">{t("intro")}</p>
        </FadeIn>

        <ul className="mt-12 space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            return (
              <li
                key={item.q}
                className="overflow-hidden rounded-2xl border border-line bg-raised transition hover:border-accent/35"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="font-medium text-ink-1">{item.q}</span>
                    <ChevronDown
                      aria-hidden
                      className={`mt-0.5 h-5 w-5 shrink-0 text-accent-ink transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen
                      ? "visible grid-rows-[1fr] opacity-100"
                      : "invisible grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 pt-0 text-sm leading-relaxed text-ink-3">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
