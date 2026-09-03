"use client";

import { Link } from "@/i18n/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ArrowRight, HardHat } from "lucide-react";
import { WatermarkGutter } from "@/components/decor/Watermark";

type Stat = { value: string; label: string };

type Props = {
  badge: string;
  titleLine1: string;
  titleHighlight: string;
  subtitle: string;
  ctaQuote: string;
  ctaBooking: string;
  townsLabel: string;
  towns: string[];
  stats: Stat[];
  children: ReactNode;
};

export function HeroClient({
  badge,
  titleLine1,
  titleHighlight,
  subtitle,
  ctaQuote,
  ctaBooking,
  townsLabel,
  towns,
  stats,
  children,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  /**
   * Background only. The foreground used to fade to `opacity: 0` by 55% of the hero's
   * height, which left roughly a full viewport of blank black between the last visible
   * hero element and the section below it.
   */
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[min(88svh,46rem)] items-center overflow-hidden bg-[#080808]"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        {children}
      </motion.div>

      <WatermarkGutter>K.K EDILIZIA — MODENA E PROVINCIA</WatermarkGutter>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/25 bg-[#c9a227]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#c9a227] backdrop-blur-sm"
        >
          <HardHat className="h-3.5 w-3.5" aria-hidden />
          {badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-4xl text-balance font-serif text-4xl leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          {titleLine1}{" "}
          <span className="bg-gradient-to-r from-[#e8d48b] to-[#c9a227] bg-clip-text text-transparent">
            {titleHighlight}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-6 flex max-w-3xl flex-wrap items-center gap-2 text-sm text-ink-3"
          aria-label={townsLabel}
        >
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink-4">
            {townsLabel}
          </span>
          {towns.map((town) => (
            <span
              key={town}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-ink-2"
            >
              {town}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            href="/preventivo"
            className="sweep group inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-7 py-3.5 text-sm font-semibold text-[#0a0a0a] shadow-lg shadow-[#c9a227]/25 transition hover:bg-[#ddb92e]"
          >
            {ctaQuote}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/prenota"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
          >
            {ctaBooking}
          </Link>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-6 border-t border-[#c9a227]/20 pt-8 sm:max-w-lg"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-serif text-2xl text-white sm:text-3xl">
                  {s.value}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-wider text-ink-4">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080808] to-transparent" />
    </section>
  );
}
