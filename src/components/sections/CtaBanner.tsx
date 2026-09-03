"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { WatermarkRing } from "@/components/decor/Watermark";

/**
 * Closing band. On a light page this is the one saturated surface: a gold-brown
 * ground that stops the scroll before the footer, rather than another pale panel.
 * Tokens come from `.on-band` (see globals.css) so the type contrast is handled.
 */
export function CtaBanner() {
  const t = useTranslations("CtaBanner");

  return (
    <section className="on-band relative overflow-hidden bg-[linear-gradient(120deg,#6b511d_0%,#75591f_55%,#806322_100%)] px-4 py-24 sm:px-6">
      <WatermarkRing position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <h2 className="text-balance font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-2">{t("subtitle")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/preventivo"
            className="sweep inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#6b511d] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {t("cta")}
          </Link>
          <Link
            href="/contatti"
            className="inline-flex rounded-full border border-line-2 px-8 py-3.5 text-sm font-semibold text-ink-1 transition hover:bg-raised-2"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
