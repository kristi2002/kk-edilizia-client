import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Ruler,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  WatermarkGrid,
  WatermarkGutter,
  WatermarkRing,
} from "@/components/decor/Watermark";
import { HOME_IMAGERY } from "@/lib/media/home-imagery";
import { getSite } from "@/lib/data/site-store";
import { PrenotaForm } from "./PrenotaForm";
import { withLocaleAlternates } from "@/lib/seo-metadata";
import enMessages from "../../../../messages/en.json";
import itMessages from "../../../../messages/it.json";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const booking = locale === "en" ? enMessages.Booking : itMessages.Booking;
  return withLocaleAlternates(locale, "/prenota", {
    title: booking.metaTitle,
    description: booking.metaDescription,
  });
}

/**
 * `/prenota`.
 *
 * This was a form on an empty sheet: one `max-w-3xl` column, a heading, the form card,
 * and a line of small print. It asked for a name, an email, a phone number, a date and
 * a set of photographs without saying anything about what the visitor gets back, and it
 * shared no vocabulary with the rest of the site — a page a visitor lands on straight
 * from the home page's "Prenota il sopralluogo" button.
 *
 * It now reads as three movements, in the same grounds the home page alternates through:
 * a dark band carrying the promise and the claims we can actually make, a paper ground
 * where the form sits beside what happens after it is sent, and a sunken close offering
 * the two routes that are not a site visit.
 *
 * The three trust chips in the band are deliberately narrow. The site says "preventivo
 * gratuito dopo sopralluogo" and "un solo referente" in a dozen places, and states its
 * area as Modena and province — so those are the three. It does not promise a response
 * time anywhere, so neither does this page.
 */
export default async function PrenotaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Booking");
  /** Labels for the contact rows already exist on `/contatti`; no reason to fork them. */
  const tContacts = await getTranslations("ContactsPage");
  const site = await getSite();

  const trust = [t("trust1"), t("trust2"), t("trust3")];

  const nextSteps = [
    { title: t("next1t"), body: t("next1d"), icon: Mail },
    { title: t("next2t"), body: t("next2d"), icon: Phone },
    { title: t("next3t"), body: t("next3d"), icon: Ruler },
  ];

  const alternatives = [
    {
      href: "/preventivo" as const,
      title: t("altQuoteTitle"),
      body: t("altQuoteDesc"),
      icon: Ruler,
    },
    {
      href: "/contatti" as const,
      title: t("altContactTitle"),
      body: t("altContactDesc"),
      icon: MessageSquare,
    },
  ];

  return (
    <main className="flex flex-1 flex-col">
      {/* ── The promise ─────────────────────────────────────────────────── */}
      <section className="on-dark relative overflow-hidden bg-inverse px-4 py-20 sm:px-6 lg:py-24">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={HOME_IMAGERY.progetto.src}
            alt=""
            fill
            priority
            quality={72}
            sizes="100vw"
            className="object-cover object-center opacity-30 [filter:grayscale(0.5)_sepia(0.3)_saturate(0.9)_brightness(0.8)]"
          />
          {/* Clears to solid ink across the copy and lets the drawing show at the edge. */}
          <span className="absolute inset-0 bg-[linear-gradient(105deg,rgba(20,23,26,0.97)_0%,rgba(20,23,26,0.93)_42%,rgba(20,23,26,0.66)_100%)]" />
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_22%,rgba(201,162,39,0.18),transparent_58%)]" />
        </div>
        <WatermarkGrid />
        <WatermarkGutter>K.K EDILIZIA — MODENA E PROVINCIA</WatermarkGutter>

        <div className="relative mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
              {t("label")}
            </p>
            <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl leading-[1.08] text-ink-1 sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>
            <span
              aria-hidden="true"
              className="mt-7 block h-[2px] w-24 bg-gradient-to-r from-accent to-accent/10"
            />
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-2">
              {t("intro")}
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <ul className="mt-9 flex flex-wrap gap-2.5">
              {trust.map((claim) => (
                <li
                  key={claim}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-ink-2 backdrop-blur-sm"
                >
                  <Check
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 text-accent-ink"
                    strokeWidth={2.5}
                  />
                  {claim}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#modulo"
                className="sweep group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-on-accent shadow-lg shadow-accent/25 transition hover:bg-accent-deep"
              >
                {t("heroCtaForm")}
                {/* It scrolls down the page, so the mark points down. */}
                <ArrowDown
                  aria-hidden
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </a>
              <a
                href={`tel:${site.phoneTel}`}
                className="inline-flex items-center gap-2 rounded-full border border-line-2 px-7 py-3.5 text-sm font-semibold text-ink-1 transition hover:border-accent/60 hover:bg-raised"
              >
                <Phone aria-hidden className="h-4 w-4" />
                {t("heroCtaCall", { phone: site.phoneDisplay })}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── The form, and what follows it ───────────────────────────────── */}
      <section
        id="modulo"
        className="rule-gold relative scroll-mt-20 bg-page px-4 py-20 sm:px-6 lg:py-24"
      >
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <FadeIn>
              <PrenotaForm />
            </FadeIn>
          </div>

          {/*
            Sticky, but only where it fits. The column runs about 700px tall; pinning it
            in a window shorter than that would park its foot — the phone number and the
            service area — permanently below the fold, since a pinned element never
            scrolls back into view. Below 53rem of viewport height it simply scrolls.
          */}
          <aside className="lg:col-span-5 [@media(min-width:64rem)_and_(min-height:53rem)]:sticky [@media(min-width:64rem)_and_(min-height:53rem)]:top-24">
            <FadeIn delay={0.08}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
                {t("nextLabel")}
              </p>
              <h2 className="mt-3 font-serif text-2xl text-ink-1 sm:text-3xl">
                {t("nextTitle")}
              </h2>

              {/*
                An ordered list, because it is a sequence — same numerals as the process
                section on the home page, at the smaller size a supporting column wants.
              */}
              <ol className="mt-7 space-y-px overflow-hidden rounded-2xl border border-line bg-raised">
                {nextSteps.map((step, i) => (
                  <li
                    key={step.title}
                    className="flex gap-4 border-b border-line p-5 last:border-b-0"
                  >
                    <span
                      aria-hidden="true"
                      className="font-serif text-3xl leading-none text-accent-ink"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 font-medium text-ink-1">
                        <step.icon
                          aria-hidden
                          className="h-4 w-4 shrink-0 text-accent-ink"
                        />
                        {step.title}
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-ink-3">
                        {step.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </FadeIn>

            <FadeIn delay={0.14}>
              <div className="mt-6 rounded-2xl border border-line bg-sunken p-6">
                <h3 className="font-serif text-xl text-ink-1">
                  {t("asideContactTitle")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-3">
                  {t("asideContactIntro")}
                </p>

                <dl className="mt-5 space-y-4 border-t border-line pt-5 text-sm">
                  <div className="flex gap-3">
                    <Phone
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                    />
                    <div className="min-w-0">
                      <dt className="text-xs uppercase tracking-wider text-ink-4">
                        {tContacts("phone")}
                      </dt>
                      <dd>
                        <a
                          href={`tel:${site.phoneTel}`}
                          className="font-medium text-ink-1 hover:text-accent-ink"
                        >
                          {site.phoneDisplay}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                    />
                    <div className="min-w-0">
                      <dt className="text-xs uppercase tracking-wider text-ink-4">
                        {tContacts("email")}
                      </dt>
                      <dd>
                        <a
                          href={`mailto:${site.email}`}
                          className="break-all font-medium text-ink-1 hover:text-accent-ink"
                        >
                          {site.email}
                        </a>
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Clock
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                    />
                    <div className="min-w-0">
                      <dt className="text-xs uppercase tracking-wider text-ink-4">
                        {tContacts("hours")}
                      </dt>
                      <dd className="text-ink-2">{tContacts("hoursValue")}</dd>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                    />
                    <div className="min-w-0">
                      <dt className="text-xs uppercase tracking-wider text-ink-4">
                        {t("asideAreaTitle")}
                      </dt>
                      <dd className="text-ink-2">
                        {locale === "en" ? site.serviceAreaEn : site.serviceArea}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </FadeIn>
          </aside>
        </div>
      </section>

      {/* ── The two routes that are not a site visit ────────────────────── */}
      <section className="relative overflow-hidden border-t border-line bg-sunken px-4 py-20 sm:px-6">
        <WatermarkRing position="bottom-right" />

        <div className="relative mx-auto max-w-6xl lg:grid lg:grid-cols-12 lg:gap-14">
          <FadeIn className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
              {t("altLabel")}
            </p>
            <h2 className="mt-3 text-balance font-serif text-2xl text-ink-1 sm:text-3xl">
              {t("altTitle")}
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-ink-3">
              {t("altIntro")}
            </p>
          </FadeIn>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:mt-0">
            {alternatives.map((item, i) => (
              <li key={item.href}>
                <FadeIn delay={0.06 + i * 0.06} className="h-full">
                  <Link
                    href={item.href}
                    className="group flex h-full flex-col rounded-2xl border border-line bg-raised p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span className="inline-flex rounded-xl bg-accent/12 p-2.5 text-accent-ink transition duration-300 group-hover:bg-accent/25">
                        <item.icon className="h-5 w-5" aria-hidden />
                      </span>
                      {/* The card is the link; the title says where it goes, so this is a mark. */}
                      <ArrowUpRight
                        aria-hidden
                        className="h-5 w-5 shrink-0 text-accent-ink opacity-50 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-5 block h-px w-10 bg-accent/50 transition-all duration-300 group-hover:w-16 group-hover:bg-accent"
                    />
                    <span className="mt-4 font-serif text-xl text-ink-1 transition group-hover:text-accent-ink">
                      {item.title}
                    </span>
                    <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-3">
                      {item.body}
                    </span>
                  </Link>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
