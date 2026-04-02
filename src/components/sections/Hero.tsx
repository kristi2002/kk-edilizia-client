"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const t = useTranslations("Hero");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const stats = [
    { k: "15+", v: t("statYears") },
    { k: "120+", v: t("statProjects") },
    { k: "100%", v: t("statCommitment") },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-[92vh] overflow-hidden bg-[#080808]"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=85"
          alt=""
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/30 via-[#080808]/75 to-[#080808]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c9a227]/12 via-transparent to-transparent" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 pb-24 pt-12 sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#c9a227]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t("badge")}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-4xl font-serif text-4xl leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          {t("titleLine1")}{" "}
          <span className="bg-gradient-to-r from-[#e8d48b] to-[#c9a227] bg-clip-text text-transparent">
            {t("titleHighlight")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/preventivo"
            className="group inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] shadow-lg shadow-[#c9a227]/25 transition hover:bg-[#ddb92e]"
          >
            {t("ctaQuote")}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
          >
            {t("ctaWorks")}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-6 border-t border-white/10 pt-10 sm:max-w-lg"
        >
          {stats.map((s) => (
            <div key={s.k}>
              <p className="font-serif text-2xl text-white sm:text-3xl">{s.k}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                {s.v}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />
    </section>
  );
}
