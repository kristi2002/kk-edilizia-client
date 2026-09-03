import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { isPortfolioEnabled } from "@/lib/features";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  FileText,
  Hammer,
  Images,
  Phone,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkGrid } from "@/components/decor/Watermark";

/**
 * How we work, and how to enter it.
 *
 * This used to be two sections: the four process steps, and a `HomeInternalHub` block
 * headed "Da dove iniziare" carrying four link cards. They described the same journey
 * twice — step 1 *is* "prenota sopralluogo", step 2 *is* the preventivo, and the process
 * block closed with a CTA pointing at /preventivo, which was also the hub's primary
 * card. A visitor read the sequence, then read it again as a list of links.
 *
 * They are one block now. The first two steps are the ones a visitor triggers, so those
 * two cards carry the action; the pages that are not steps sit in a closing index. Every
 * URL the hub linked is still linked from here, and every one of them is in the footer
 * besides, so no crawl path depended on the block that went away.
 */
type Step = {
  icon: LucideIcon;
  titleKey: "s1t" | "s2t" | "s3t" | "s4t";
  descKey: "s1d" | "s2d" | "s3d" | "s4d";
  /** Only the steps a visitor starts themselves get a link. */
  action?: {
    href: "/prenota" | "/preventivo";
    labelKey: "s1Action" | "s2Action";
  };
};

const STEPS: Step[] = [
  {
    icon: ClipboardCheck,
    titleKey: "s1t",
    descKey: "s1d",
    action: { href: "/prenota", labelKey: "s1Action" },
  },
  {
    icon: Ruler,
    titleKey: "s2t",
    descKey: "s2d",
    action: { href: "/preventivo", labelKey: "s2Action" },
  },
  { icon: FileText, titleKey: "s3t", descKey: "s3d" },
  { icon: Hammer, titleKey: "s4t", descKey: "s4d" },
];

type StartLink = {
  href: "/impresa-edile-modena" | "/portfolio" | "/contatti";
  titleKey: "linkImpresa" | "linkPortfolio" | "linkContatti";
  descKey: "descImpresa" | "descPortfolio" | "descContatti";
  icon: LucideIcon;
};

const START_LINKS: StartLink[] = [
  {
    href: "/impresa-edile-modena",
    titleKey: "linkImpresa",
    descKey: "descImpresa",
    icon: Building2,
  },
  ...(isPortfolioEnabled()
    ? ([
        {
          href: "/portfolio",
          titleKey: "linkPortfolio",
          descKey: "descPortfolio",
          icon: Images,
        },
      ] satisfies StartLink[])
    : []),
  {
    href: "/contatti",
    titleKey: "linkContatti",
    descKey: "descContatti",
    icon: Phone,
  },
];

export async function ProcessSteps() {
  const t = await getTranslations("ProcessSteps");

  return (
    <section
      id="come-lavoriamo"
      className="rule-gold relative scroll-mt-24 overflow-hidden bg-sunken px-4 py-24 sm:px-6"
    >
      <WatermarkGrid />

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("label")}
          </p>
          <h2
            id="process-steps-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl md:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-ink-2">
            {t("intro")}
          </p>
        </FadeIn>

        {/*
          The steps used to be four columns of loose copy carrying two markers each — a
          numbered disc and an icon chip — with a connecting rule that ran straight
          through the chips. Each step is now a single card on the sunken ground, and the
          sequence is carried by one marker: the set numeral, which is also the largest
          thing in the card.
        */}
        <ol
          aria-labelledby="process-steps-heading"
          className="mt-14 grid gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((s, i) => (
            <li key={s.titleKey} className="relative">
              <FadeIn delay={i * 0.06} className="h-full">
                <article className="group flex h-full flex-col rounded-2xl border border-line bg-raised p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    {/* The <ol> already carries the order; the numeral is its picture. */}
                    <span
                      aria-hidden="true"
                      className="font-serif text-5xl leading-none text-accent-ink"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-flex rounded-xl bg-accent/12 p-2.5 text-accent-ink transition duration-300 group-hover:bg-accent/25"
                    >
                      <s.icon className="h-5 w-5" />
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mt-5 block h-px w-10 bg-accent/50 transition-all duration-300 group-hover:w-16 group-hover:bg-accent"
                  />

                  <h3 className="mt-4 font-serif text-xl text-ink-1">
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-3">
                    {t(s.descKey)}
                  </p>

                  {/*
                    The action belongs to the step it starts, rather than to a separate
                    list of links further down. It is a link inside the card and not a
                    linked card, so the numeral and the step title stay out of the link
                    text, and steps 3 and 4 — which nobody can trigger — carry none.
                  */}
                  {s.action ? (
                    <div className="mt-auto pt-6">
                      <Link
                        href={s.action.href}
                        className="group/act inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent-ink transition hover:border-accent/60 hover:bg-accent/20"
                      >
                        {t(s.action.labelKey)}
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-300 group-hover/act:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  ) : null}
                </article>
              </FadeIn>

              {/*
                Between-card arrow, wide layouts only: it is the one thing that says the
                cards are a sequence rather than a set. It lives in the grid gap, so the
                last card has none.
              */}
              {i < STEPS.length - 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="absolute -right-[1.15rem] top-1/2 hidden h-4 w-4 -translate-y-1/2 text-accent/60 lg:block"
                />
              ) : null}
            </li>
          ))}
        </ol>

        {/*
          The coda: rows on a raised panel rather than a second grid of cards, so it
          reads as an index closing the section instead of a rival to the four steps.
        */}
        <FadeIn delay={0.15}>
          <div className="mt-16 rounded-3xl border border-line bg-raised p-6 sm:p-10">
            <div className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
                  {t("startLabel")}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-ink-1 sm:text-3xl">
                  {t("startTitle")}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-5 block h-[2px] w-20 bg-gradient-to-r from-accent to-accent/10"
                />
                <p className="mt-5 text-sm leading-relaxed text-ink-3">
                  {t("startIntro")}
                </p>
              </div>

              <ul className="mt-8 divide-y divide-line border-t border-line lg:col-span-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12">
                {START_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-4 py-5"
                    >
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-page text-accent-ink transition group-hover:border-accent/50 group-hover:bg-accent/10">
                        <item.icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink-1 transition group-hover:text-accent-ink">
                          {t(item.titleKey)}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-ink-3">
                          {t(item.descKey)}
                        </span>
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-accent-ink opacity-50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
