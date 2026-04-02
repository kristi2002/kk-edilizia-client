"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function CtaBanner() {
  const t = useTranslations("CtaBanner");

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[#c9a227]/[0.07]" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#c9a227]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-600/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent px-8 py-16 text-center sm:px-12"
      >
        <h2 className="font-serif text-3xl text-white sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">{t("subtitle")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/preventivo"
            className="inline-flex rounded-full bg-[#c9a227] px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] shadow-lg shadow-[#c9a227]/20 transition hover:bg-[#ddb92e]"
          >
            {t("cta")}
          </Link>
          <Link
            href="/contatti"
            className="inline-flex rounded-full border border-white/25 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
