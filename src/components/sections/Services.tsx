"use client";

import { motion } from "framer-motion";
import { Hammer, Home, Building2, Paintbrush } from "lucide-react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkWord } from "@/components/decor/Watermark";
import { PhotoCardMedia } from "@/components/decor/PhotoCardMedia";
import { HOME_IMAGERY } from "@/lib/media/home-imagery";

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

/**
 * The photographs here are grounds, not content: they sit at 15% behind a scrim and
 * carry no information the heading does not already give, so they take an empty `alt`
 * and stay out of the accessibility tree. The silo grid below shows its pictures at full
 * strength and describes them properly.
 */
export function Services() {
  const t = useTranslations("Services");
  const items = [
    { icon: Home, title: t("r1t"), text: t("r1d"), image: HOME_IMAGERY.ristrutturazioni },
    { icon: Building2, title: t("r2t"), text: t("r2d"), image: HOME_IMAGERY.edilizia },
    { icon: Hammer, title: t("r3t"), text: t("r3d"), image: HOME_IMAGERY.progetto },
    { icon: Paintbrush, title: t("r4t"), text: t("r4d"), image: HOME_IMAGERY.finiture },
  ];

  return (
    <section className="relative overflow-hidden border-y border-line bg-raised px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,162,39,0.06),transparent_50%)]" />
      <WatermarkWord>EDILIZIA</WatermarkWord>
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl">
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
              className="photo-card group flex min-h-[15rem] flex-col justify-end rounded-2xl border border-line p-6 transition hover:border-accent/40"
            >
              <PhotoCardMedia image={it.image} alt="" />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-[3px] w-0 -translate-x-1/2 rounded-b bg-gradient-to-r from-accent to-accent-deep transition-all duration-400 group-hover:w-1/2"
              />
              <div className="mb-4 inline-flex w-fit rounded-xl bg-accent/15 p-3 text-accent-ink transition group-hover:scale-105">
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl text-ink-1">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">{it.text}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
