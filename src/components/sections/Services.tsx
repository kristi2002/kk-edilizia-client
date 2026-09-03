"use client";

import { motion } from "framer-motion";
import { Hammer, Home, Building2, Paintbrush } from "lucide-react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVar = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Services() {
  const t = useTranslations("Services");
  const items = [
    { icon: Home, title: t("r1t"), text: t("r1d") },
    { icon: Building2, title: t("r2t"), text: t("r2d") },
    { icon: Hammer, title: t("r3t"), text: t("r3d") },
    { icon: Paintbrush, title: t("r4t"), text: t("r4d") },
  ];

  return (
    <section className="rule-gold relative overflow-hidden bg-surface-base px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,162,39,0.06),transparent_50%)]" />
      <WatermarkWord>EDILIZIA</WatermarkWord>
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            {t("label")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-ink-3">{t("intro")}</p>
        </FadeIn>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((it) => (
            <motion.li
              key={it.title}
              variants={itemVar}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#c9a227]/40 hover:bg-white/[0.06]"
            >
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-[3px] w-0 -translate-x-1/2 rounded-b bg-gradient-to-r from-[#c9a227] to-[#a9822f] transition-all duration-400 group-hover:w-1/2"
              />
              <div className="mb-4 inline-flex rounded-xl bg-[#c9a227]/15 p-3 text-[#c9a227] transition group-hover:scale-105">
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-white">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-4">{it.text}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
