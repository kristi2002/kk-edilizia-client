"use client";

import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data/projects";
import { getProjectLocalized } from "@/lib/data/projects";
import type { ProjectTypeDef } from "@/lib/data/project-types";
import { FadeIn } from "@/components/motion/FadeIn";

type Props = { projects: Project[]; projectTypes?: ProjectTypeDef[] };

export function FeaturedProjects({ projects, projectTypes }: Props) {
  const featured = projects.slice(0, 3);
  const t = useTranslations("FeaturedProjects");
  const locale = useLocale();

  return (
    <section className="bg-[#080808] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              {t("label")}
            </p>
            <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-lg text-zinc-400">{t("intro")}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9a227] hover:underline"
            >
              {t("cta")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {featured.map((p, i) => {
            const loc = getProjectLocalized(p, locale, projectTypes);
            return (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <Link href={`/portfolio/${p.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={p.coverImage}
                      alt={loc.title}
                      fill
                      quality={72}
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 767px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs font-medium uppercase tracking-wider text-[#c9a227]">
                        {loc.category} · {p.year}
                      </p>
                      <h3 className="mt-2 font-serif text-xl text-white">
                        {loc.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                        {loc.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
