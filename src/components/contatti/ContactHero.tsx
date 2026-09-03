import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Clock, Mail, Phone } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { WatermarkGutter } from "@/components/decor/Watermark";
import { WhatsAppGlyph } from "@/components/site/WhatsAppGlyph";
import type { SiteData } from "@/lib/site";

/**
 * The page opened as a flat two-column block on the paper ground: a heading, four icon
 * rows and the form. Nothing said "this is where you reach a builder" and the three
 * things a visitor actually wants — the number, the chat, the address to write to — were
 * list items indistinguishable from the opening hours.
 *
 * This is now the one dark band on the page, the same device the home page uses to open,
 * and the three direct channels are tiles inside it rather than rows. Everything that is
 * a *detail* rather than a channel (PEC, hours, area, company data) moved to the aside
 * beside the form.
 *
 * The ground is drawn rather than photographed. Every picture in the repo already
 * belongs to a page — the home set, the nine service silos, and `/chi-siamo`, whose
 * manifest states outright that nothing in it is reused, so a visitor never meets the
 * same photograph twice. Rather than break that, this band uses the CSS device the hero
 * falls back to when its video is unavailable (see `DesignedGround` in
 * `HeroBackgroundLayers`): the measured grid, two pools of warm light and an oversized
 * ring. It also leaves the h1 as the LCP element, with nothing to download first.
 */

/** Digits only — `wa.me` rejects spaces and a leading `+`. */
const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");

export async function ContactHero({ site }: { site: SiteData }) {
  const t = await getTranslations("ContactsPage");

  const channels = [
    {
      key: "phone",
      href: `tel:${site.phoneTel}`,
      external: false,
      icon: <Phone className="h-5 w-5" aria-hidden />,
      label: t("phone"),
      value: site.phoneDisplay,
      action: t("callAction"),
    },
    ...(waNumber
      ? [
          {
            key: "whatsapp",
            href: `https://wa.me/${waNumber}?text=${encodeURIComponent(
              t("whatsappPrefill"),
            )}`,
            external: true,
            icon: <WhatsAppGlyph />,
            label: t("whatsapp"),
            value: t("whatsappValue"),
            action: t("whatsappAction"),
          },
        ]
      : []),
    {
      key: "email",
      href: `mailto:${site.email}`,
      external: false,
      icon: <Mail className="h-5 w-5" aria-hidden />,
      label: t("email"),
      value: site.email,
      action: t("emailAction"),
    },
  ];

  return (
    <section className="on-dark relative overflow-hidden bg-inverse px-4 pb-20 pt-16 sm:px-6 md:pb-24 md:pt-20">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <span className="wm-grid" />
        {/* Two pools of raking light, warm at the top right and cooler where the tiles sit. */}
        <span className="absolute -right-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-accent/12 blur-3xl" />
        <span className="absolute -bottom-56 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent-deep/10 blur-3xl" />
        <span className="wm-ring -right-40 -top-32 hidden sm:block" />
        <span className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-inverse to-transparent" />
      </div>

      <WatermarkGutter>K.K EDILIZIA — MODENA E PROVINCIA</WatermarkGutter>

      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl leading-[1.08] tracking-tight text-ink-1 sm:text-5xl md:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-2">
            {t("intro")}
          </p>
          <p className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-raised px-4 py-2 text-sm text-ink-2 backdrop-blur-sm">
            <Clock className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden />
            <span className="sr-only">{t("hours")}: </span>
            {t("hoursValue")}
          </p>
        </FadeIn>

        {/*
          The three tiles are whole links rather than a value plus a separate "call"
          control: the label and the number are short enough to sit inside the link text,
          and it gives a thumb a card-sized target instead of a line of type.
        */}
        <ul
          className={`mt-12 grid gap-4 sm:grid-cols-2 ${
            channels.length > 2 ? "lg:grid-cols-3" : "lg:max-w-3xl"
          }`}
        >
          {channels.map((c, i) => (
            <li key={c.key}>
              <FadeIn delay={0.06 + i * 0.06} className="h-full">
                <a
                  href={c.href}
                  {...(c.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-raised p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-raised-2 hover:shadow-xl hover:shadow-black/25"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="inline-flex rounded-xl bg-accent/15 p-2.5 text-accent-ink transition duration-300 group-hover:bg-accent/30">
                      {c.icon}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-accent-ink opacity-50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden
                    />
                  </span>

                  <span className="mt-5 block text-xs font-semibold uppercase tracking-[0.2em] text-ink-4">
                    {c.label}
                  </span>
                  <span className="mt-2 block break-words font-serif text-xl text-ink-1 transition group-hover:text-accent-ink">
                    {c.value}
                  </span>

                  <span
                    aria-hidden="true"
                    className="mt-4 block h-px w-10 bg-accent/50 transition-all duration-300 group-hover:w-16 group-hover:bg-accent"
                  />
                  <span className="mt-auto pt-4 text-sm font-semibold text-accent-ink">
                    {c.action}
                  </span>
                </a>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
