import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getProjectLocalized } from "@/lib/data/projects";
import { getProjectBySlug, getProjects } from "@/lib/data/projects-store";
import { getProjectTypes } from "@/lib/data/project-types-store";
import { FadeIn } from "@/components/motion/FadeIn";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { ProjectBeforeAfterBlock } from "@/components/sections/ProjectBeforeAfterBlock";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n-path";
import { withLocaleAlternates } from "@/lib/seo-metadata";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Progetto" };
  const projectTypes = await getProjectTypes();
  const loc = getProjectLocalized(project, locale, projectTypes);
  const path = `/portfolio/${project.slug}`;
  return withLocaleAlternates(locale, path, {
    title: loc.title,
    description: loc.excerpt,
    openGraph: { images: [{ url: project.coverImage }] },
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projectTypes = await getProjectTypes();
  const loc = getProjectLocalized(project, locale, projectTypes);
  const t = await getTranslations("ProjectDetail");
  const tNav = await getTranslations("Nav");
  const tPort = await getTranslations("PortfolioPage");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tNav("home"), path: localizedPath(locale, "/") },
          {
            name: tNav("portfolio"),
            path: localizedPath(locale, "/portfolio"),
          },
          {
            name: loc.title,
            path: localizedPath(locale, `/portfolio/${project.slug}`),
          },
        ]}
      />
      <main className="flex flex-1 flex-col bg-[#080808]">
        <div className="relative h-[min(55vh,520px)] w-full">
          <Image
            src={project.coverImage}
            alt={loc.title}
            fill
            priority
            fetchPriority="high"
            quality={72}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-12 sm:px-6">
            <FadeIn>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("back")}
              </Link>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
                {loc.category} · {project.year} · {loc.location}
              </p>
              <h1 className="mt-3 max-w-3xl font-serif text-4xl text-white md:text-5xl">
                {loc.title}
              </h1>
            </FadeIn>
          </div>
        </div>

        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <FadeIn>
            <div className="mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
                {tPort("beforeAfter")}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                {tPort("beforeAfterHint")}
              </p>
              <div className="mt-6">
                <ProjectBeforeAfterBlock
                  beforeSrc={project.beforeAfter.before}
                  afterSrc={project.beforeAfter.after}
                  beforeLabel={t("before")}
                  afterLabel={t("after")}
                  beforeAlt={`${loc.title} — ${t("before")}`}
                  afterAlt={`${loc.title} — ${t("after")}`}
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <p className="text-lg leading-relaxed text-zinc-300">
              {loc.description}
            </p>
          </FadeIn>

          <FadeIn>
            <div className="mt-12 rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/5 px-6 py-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div>
                <p className="text-sm font-medium text-white">
                  {t("virtualTourLabel")}
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {t("virtualTourCardHint")}
                </p>
              </div>
              <Link
                href={`/portfolio/${project.slug}/virtual-tour`}
                className="mt-4 inline-flex shrink-0 justify-center rounded-full border border-[#c9a227]/50 bg-[#c9a227]/15 px-6 py-2.5 text-sm font-semibold text-[#c9a227] transition hover:bg-[#c9a227]/25 sm:mt-0"
              >
                {t("virtualTourCta")}
              </Link>
            </div>
          </FadeIn>

          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <FadeIn key={src} delay={i * 0.06}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={src}
                    alt={t("galleryAlt", {
                      index: i + 1,
                      title: loc.title,
                    })}
                    fill
                    quality={72}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 384px"
                  />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-zinc-400">{t("similar")}</p>
              <Link
                href="/preventivo"
                className="mt-6 inline-flex rounded-full bg-[#c9a227] px-8 py-3 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
              >
                {t("cta")}
              </Link>
            </div>
          </FadeIn>
        </article>
      </main>
    </>
  );
}
