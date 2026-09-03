import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Award,
  FileCheck,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { PhotoCardMedia } from "@/components/decor/PhotoCardMedia";
import { ABOUT_IMAGERY } from "@/lib/media/about-imagery";
import type { AboutImageKey } from "@/lib/media/about-imagery";

/**
 * The four commitments, as photo cards rather than an icon list.
 *
 * They were a stacked `<ul>` of icon-and-paragraph rows — the least designed thing on the
 * site. Each is now a `.photo-card` on the same terms as the Services row: the photograph
 * is a *ground*, dimmed under a scrim and carrying an empty `alt`, because the heading
 * already says everything the picture does. Two columns rather than four: the bodies here
 * are two or three lines, and four narrow columns made them towers.
 *
 * The fourth card no longer repeats the insurance and compliance wording verbatim — that
 * belongs to `AboutCredentials`, and the card links down to it instead.
 */
type Pillar = {
  icon: LucideIcon;
  titleKey: "p1t" | "p2t" | "p3t" | "p4t";
  descKey: "p1d" | "p2d" | "p3d" | "p4d";
  image: AboutImageKey;
};

const PILLARS: Pillar[] = [
  { icon: Users, titleKey: "p1t", descKey: "p1d", image: "bancoLavoro" },
  { icon: Shield, titleKey: "p2t", descKey: "p2d", image: "sicurezza" },
  { icon: Award, titleKey: "p3t", descKey: "p3d", image: "lavorazioneLegno" },
  { icon: FileCheck, titleKey: "p4t", descKey: "p4d", image: "progettoTavolo" },
];

export async function AboutPillars() {
  const t = await getTranslations("AboutPage");

  return (
    <section
      className="relative overflow-hidden border-y border-line bg-raised px-4 py-24 sm:px-6"
      aria-labelledby="about-pillars-heading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(201,162,39,0.07),transparent_55%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("pillarsLabel")}
          </p>
          <h2
            id="about-pillars-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl"
          >
            {t("pillarsTitle")}
          </h2>
        </FadeIn>

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <li key={p.titleKey}>
              <FadeIn delay={i * 0.07} className="h-full">
                <article className="photo-card group flex h-full min-h-[17rem] flex-col justify-end rounded-2xl border border-line p-7 transition duration-300 hover:border-accent/40 sm:p-8">
                  <PhotoCardMedia
                    image={ABOUT_IMAGERY[p.image]}
                    alt=""
                    sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-[3px] w-0 rounded-b bg-gradient-to-r from-accent to-accent-deep transition-all duration-500 group-hover:w-1/3"
                  />

                  <div className="mb-5 inline-flex w-fit rounded-xl bg-accent/15 p-3 text-accent-ink transition duration-300 group-hover:bg-accent/25">
                    <p.icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="font-serif text-xl text-ink-1 sm:text-2xl">
                    {t(p.titleKey)}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-3">
                    {t(p.descKey)}
                  </p>

                  {p.titleKey === "p4t" ? (
                    /* Same page: a plain anchor, so no client navigation is involved and
                       the browser's own smooth scrolling (globals.css) does the work. */
                    <a
                      href="#garanzie"
                      className="group/act mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent-ink underline-offset-4 hover:underline"
                    >
                      {t("p4Link")}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-300 group-hover/act:translate-x-0.5"
                      />
                    </a>
                  ) : null}
                </article>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
