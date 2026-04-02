"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { faqByLocale } from "@/lib/data/faq";
import { FadeIn } from "@/components/motion/FadeIn";

export function FaqSection() {
  const t = useTranslations("FaqSection");
  const locale = useLocale();
  const faqItems =
    faqByLocale[locale === "en" ? "en" : "it"] ?? faqByLocale.it;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative bg-[#080808] px-4 py-24 sm:px-6"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(201,162,39,0.05),transparent_45%)]" />
      <div className="relative mx-auto max-w-3xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("label")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-zinc-400">{t("intro")}</p>
        </FadeIn>

        <ul className="mt-12 space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-[#c9a227]/35 hover:bg-white/[0.05]"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-white">{item.q}</span>
                  <ChevronDown
                    className={`mt-0.5 h-5 w-5 shrink-0 text-[#c9a227] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 pt-1 text-sm leading-relaxed text-zinc-400">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
