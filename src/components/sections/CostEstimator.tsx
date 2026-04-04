"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Calculator, Info } from "lucide-react";
import { getEstimatorCategories } from "@/lib/data/cost-estimator";
import { FadeIn } from "@/components/motion/FadeIn";

export function CostEstimator() {
  const t = useTranslations("CostEstimator");
  const locale = useLocale();
  const categories = useMemo(
    () => getEstimatorCategories(locale),
    [locale],
  );
  const [sqm, setSqm] = useState("85");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "completa");

  useEffect(() => {
    setCategoryId(categories[0]?.id ?? "completa");
  }, [categories]);

  const eur = useMemo(
    () =>
      new Intl.NumberFormat(locale === "en" ? "en-GB" : "it-IT", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const range = useMemo(() => {
    const n = Math.max(0, parseFloat(sqm.replace(",", ".")) || 0);
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat || n <= 0) return null;
    return {
      min: n * cat.minPerSqm,
      max: n * cat.maxPerSqm,
      cat,
    };
  }, [sqm, categoryId, categories]);

  return (
    <section className="scroll-mt-24 border-y border-white/10 bg-[#0a0a0a] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c9a227]">
              <Calculator className="h-3.5 w-3.5" />
              {t("badge")}
            </div>
            <h2 className="mt-4 font-serif text-3xl text-white sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-zinc-400">{t("intro")}</p>
            <ul className="mt-8 space-y-3 text-sm text-zinc-500">
              <li className="flex gap-2">
                <span className="text-[#c9a227]">—</span>
                {t("li1")}
              </li>
              <li className="flex gap-2">
                <span className="text-[#c9a227]">—</span>
                {t("li2")}
              </li>
            </ul>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <label className="block text-sm font-medium text-zinc-400">
                {t("sqm")}
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={sqm}
                onChange={(e) => setSqm(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                placeholder={t("sqmPh")}
              />

              <p className="mt-6 text-sm font-medium text-zinc-400">
                {t("typeLabel")}
              </p>
              <div className="mt-3 space-y-2">
                {categories.map((c) => (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer flex-col rounded-xl border px-4 py-3 text-sm transition ${
                      categoryId === c.id
                        ? "border-[#c9a227] bg-[#c9a227]/10 text-white"
                        : "border-white/15 text-zinc-400 hover:border-white/25"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="est-cat"
                        value={c.id}
                        checked={categoryId === c.id}
                        onChange={() => setCategoryId(c.id)}
                        className="mt-1"
                      />
                      <span>
                        <span className="font-medium text-white">{c.label}</span>
                        <span className="mt-0.5 block text-xs text-zinc-500">
                          {c.description}
                        </span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/5 px-5 py-6">
                {range ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#c9a227]">
                      {t("rangeLabel")}
                    </p>
                    <p className="mt-3 font-serif text-2xl text-white sm:text-3xl">
                      {eur.format(range.min)} — {eur.format(range.max)}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">{t("rangeEmpty")}</p>
                )}
              </div>

              <div className="mt-4 flex gap-2 text-xs text-zinc-500">
                <Info className="h-4 w-4 shrink-0 text-zinc-600" />
                <span>{t("disclaimer")}</span>
              </div>

              <Link
                href="/preventivo"
                className="mt-8 flex w-full items-center justify-center rounded-full bg-[#c9a227] py-3.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
              >
                {t("cta")}
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
