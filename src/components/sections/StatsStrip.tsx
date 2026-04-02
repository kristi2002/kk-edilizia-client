"use client";

import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";

export function StatsStrip() {
  const t = useTranslations("StatsStrip");
  const stats = [
    { value: t("v1"), label: t("years") },
    { value: t("v2"), label: t("projects") },
    { value: t("v3"), label: t("referent") },
    { value: t("v4"), label: t("quotes") },
  ];

  return (
    <section className="border-y border-white/10 bg-[#0c0c0c] px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <FadeIn key={s.label}>
            <div className="text-center lg:text-left">
              <p className="font-serif text-4xl text-[#c9a227] sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-zinc-500">
                {s.label}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
