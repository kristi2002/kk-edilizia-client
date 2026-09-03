import { getTranslations } from "next-intl/server";
import { Clock, MapPin, ShieldCheck, Star } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import type { SiteData } from "@/lib/site";

/**
 * The column beside the form.
 *
 * It deliberately does not repeat the phone number and the email — those are the tiles
 * at the top of the page. What is here is everything a visitor needs *while* writing:
 * where to send an official communication, when someone is there to answer, which
 * comuni we cover, and who they are actually writing to.
 *
 * Sticky from `lg` up, so on a tall viewport the details stay beside the message field
 * instead of scrolling away with the top of the form.
 */
export async function ContactAside({
  site,
  locale,
}: {
  site: SiteData;
  locale: string;
}) {
  const t = await getTranslations("ContactsPage");
  const area = locale === "en" ? site.serviceAreaEn : site.serviceArea;

  const rows = [
    {
      key: "pec",
      icon: ShieldCheck,
      label: t("pec"),
      value: (
        <a
          href={`mailto:${site.pec}`}
          className="break-words font-medium text-ink-1 underline decoration-accent/40 underline-offset-4 transition hover:text-accent-ink hover:decoration-accent"
        >
          {site.pec}
        </a>
      ),
      hint: t("pecHint"),
    },
    {
      key: "hours",
      icon: Clock,
      label: t("hours"),
      value: <span className="font-medium text-ink-1">{t("hoursValue")}</span>,
      hint: null,
    },
    {
      key: "area",
      icon: MapPin,
      label: t("area"),
      value: <span className="font-medium text-ink-1">{area}</span>,
      hint: null,
    },
  ];

  return (
    <div className="lg:sticky lg:top-24">
      <FadeIn delay={0.12}>
        <div className="rounded-3xl border border-line bg-raised p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("asideLabel")}
          </p>
          <h2 className="mt-3 font-serif text-2xl text-ink-1">
            {t("asideTitle")}
          </h2>
          <span
            aria-hidden="true"
            className="mt-5 block h-[2px] w-20 bg-gradient-to-r from-accent to-accent/10"
          />

          <dl className="mt-7 divide-y divide-line border-t border-line">
            {rows.map((row) => (
              <div key={row.key} className="flex gap-4 py-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-page text-accent-ink">
                  <row.icon className="h-[1.125rem] w-[1.125rem]" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-4">
                    {row.label}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed">
                    {row.value}
                    {row.hint ? (
                      <span className="mt-1 block text-xs text-ink-4">
                        {row.hint}
                      </span>
                    ) : null}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          {site.publicReviewUrl?.trim() ? (
            <a
              href={site.publicReviewUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent-ink transition hover:border-accent/60 hover:bg-accent/20"
            >
              <Star className="h-4 w-4" aria-hidden />
              <span>
                {t("reviewsPrefix")} {t("reviewsLink")}
              </span>
            </a>
          ) : null}
        </div>
      </FadeIn>

      {/*
        Who the message actually goes to. The footer carries the same identifiers, but a
        visitor about to hand over their name and phone number should not have to scroll
        past the form to find out which company is on the other end.
      */}
      <FadeIn delay={0.16}>
        <div className="mt-5 rounded-3xl border border-line bg-sunken p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("companyLabel")}
          </p>
          <p className="mt-3 font-medium text-ink-1">{site.legalName}</p>
          <dl className="mt-3 space-y-1 text-sm text-ink-3">
            <div className="flex gap-2">
              <dt className="text-ink-4">P.IVA</dt>
              <dd>{site.vatId}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-4">REA</dt>
              <dd>{site.rea}</dd>
            </div>
          </dl>
        </div>
      </FadeIn>
    </div>
  );
}
