"use client";

import { Link } from "@/i18n/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";
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
      className="on-dark relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-inverse"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        {children}
      </motion.div>

      <WatermarkGutter>K.K EDILIZIA — MODENA E PROVINCIA</WatermarkGutter>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-[clamp(1.5rem,4svh,5rem)] sm:px-6">
        <div className="rise inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/15 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent-ink backdrop-blur-sm"
        >
          <HardHat className="h-3.5 w-3.5" aria-hidden />
          {badge}
        </div>

        <h1
          style={{ animationDelay: "0.08s", "--rise-from": "32px" } as CSSProperties}
          className="rise mt-[clamp(1rem,3svh,2rem)] max-w-4xl text-balance font-serif text-4xl leading-[1.08] tracking-tight text-ink-1 sm:text-5xl md:text-6xl lg:text-7xl [@media(min-width:40rem)_and_(max-height:46rem)]:text-5xl"
        >
          {titleLine1}{" "}
          <span className="bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
            {titleHighlight}
          </span>
        </h1>

        <p
          style={{ animationDelay: "0.18s" }}
          className="rise mt-[clamp(0.75rem,2svh,1.5rem)] max-w-xl text-lg leading-relaxed text-ink-2 sm:text-xl"
        >
          {subtitle}
        </p>

        <div
          style={{ animationDelay: "0.22s", "--rise-from": "18px" } as CSSProperties}
          className="rise mt-[clamp(0.75rem,2svh,1.5rem)] flex max-w-3xl flex-wrap items-center gap-2 text-sm text-ink-3"
          aria-label={townsLabel}
        >
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-ink-4">
            {townsLabel}
          </span>
          {towns.map((town) => (
            <span
              key={town}
              className="rounded-full border border-line bg-raised px-3 py-1 text-xs text-ink-2"
            >
              {town}
            </span>
          ))}
        </div>

        <div
          style={{ animationDelay: "0.28s", "--rise-from": "20px" } as CSSProperties}
          className="rise mt-[clamp(1.25rem,3svh,2.5rem)] flex flex-wrap gap-4"
        >
          <Link
            href="/preventivo"
            className="sweep group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-on-accent shadow-lg shadow-accent/25 transition hover:bg-accent-deep"
          >
            {ctaQuote}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/prenota"
            className="inline-flex items-center gap-2 rounded-full border border-line-2 px-7 py-3.5 text-sm font-semibold text-ink-1 transition hover:bg-raised-2"
          >
            {ctaBooking}
          </Link>
        </div>

        <dl
          style={{ animationDelay: "0.6s", "--rise-from": "0px" } as CSSProperties}
          className="rise mt-[clamp(1.5rem,4svh,4rem)] grid grid-cols-3 gap-6 border-t border-accent/20 pt-[clamp(1rem,2.5svh,2rem)] sm:max-w-lg"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-serif text-2xl text-ink-1 sm:text-3xl">
                  {s.value}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-wider text-ink-4">
                  {s.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-inverse to-transparent" />
    </section>
  );
}
