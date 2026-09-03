"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

export type SiloFaq = { q: string; a: string };

type Props = {
  items: SiloFaq[];
  eyebrow: string;
  title: string;
};

/**
 * The silo FAQ, as the same accordion the home page uses.
 *
 * It was a stack of always-open cards here, which is why three questions took a full
 * screen. The mechanics are `FaqSection`'s, for the same reason they are written that way
 * there: every answer is in the served HTML and collapsed with a `0fr → 1fr` grid row, so
 * the `FAQPage` schema this page emits mirrors markup a crawler can actually see, and
 * `visibility` takes the closed panels out of the tab order without removing them.
 *
 * Only three questions per silo, so the first opens by default — there is no long list to
 * scroll past and an open answer shows what the control does.
 */
export function ServiceSiloFaq({ items, eyebrow, title }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  if (items.length === 0) return null;

  return (
    <section className="relative bg-page px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(201,162,39,0.05),transparent_45%)]" />
      <div className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl">{title}</h2>
        </FadeIn>

        <ul className="mt-12 space-y-3">
          {items.map((item, i) => {
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
                    <p className="px-5 pb-5 text-sm leading-relaxed text-ink-3">
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
