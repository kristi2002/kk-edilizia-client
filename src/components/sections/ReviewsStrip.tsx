"use client";

import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

export function ReviewsStrip() {
  const t = useTranslations("Reviews");
  const items = [
    { text: t("r1"), author: t("a1") },
    { text: t("r2"), author: t("a2") },
    { text: t("r3"), author: t("a3") },
  ];

  return (
    <section className="border-y border-white/10 bg-[#0a0a0a] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("label")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-400">{t("intro")}</p>
        </FadeIn>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <FadeIn key={item.author} delay={i * 0.08}>
              <article className="relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 pt-10">
                <Quote className="absolute left-6 top-5 h-6 w-6 text-[#c9a227]/40" />
                <p className="text-sm leading-relaxed text-zinc-300">
                  &ldquo;{item.text}&rdquo;
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {item.author}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
