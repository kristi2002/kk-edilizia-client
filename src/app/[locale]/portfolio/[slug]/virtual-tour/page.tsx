import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { VirtualTourView } from "@/components/virtual-tour/VirtualTourView";
import { FadeIn } from "@/components/motion/FadeIn";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { getProjectLocalized } from "@/lib/data/projects";
import { getProjectBySlug, getProjects } from "@/lib/data/projects-store";
import { getProjectTypes } from "@/lib/data/project-types-store";
import { buildPannellumConfigFromProjectVirtualTour } from "@/lib/virtual-tour/project-virtual-tour";
import { routing } from "@/i18n/routing";
import { localizedPath } from "@/lib/i18n-path";

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
  if (!project) return { title: "360°" };
  const projectTypes = await getProjectTypes();
  const loc = getProjectLocalized(project, locale, projectTypes);
  return {
    title: `${loc.title} — 360°`,
    description: loc.excerpt,
    openGraph: { images: [{ url: project.coverImage }] },
  };
}

export default async function ProjectVirtualTourPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projectTypes = await getProjectTypes();
  const loc = getProjectLocalized(project, locale, projectTypes);
  const t = await getTranslations("ProjectDetail");
  const tNav = await getTranslations("Nav");
  const breadcrumb360 = t("virtualTourBreadcrumbShort");
  const vtConfig = buildPannellumConfigFromProjectVirtualTour(
    project.virtualTour,
    locale,
  );

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
          {
            name: breadcrumb360,
            path: localizedPath(
              locale,
              `/portfolio/${project.slug}/virtual-tour`,
            ),
          },
        ]}
      />
      <main className="flex flex-1 flex-col bg-[#080808] px-4 py-16 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <FadeIn>
            <Link
              href={`/portfolio/${project.slug}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("virtualTourBack")}
            </Link>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              {t("virtualTourLabel")}
            </p>
            <h1 className="mt-3 font-serif text-3xl text-white md:text-4xl">
              {loc.title}
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-400">{t("virtualTourIntro")}</p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="mt-10">
              <VirtualTourView config={vtConfig} />
            </div>
          </FadeIn>
        </div>
      </main>
    </>
  );
}
