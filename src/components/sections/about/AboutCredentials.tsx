import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Award, FileCheck, ShieldCheck, type LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { PhotoGleam } from "@/components/decor/PhotoGleam";
import { ABOUT_IMAGERY } from "@/lib/media/about-imagery";
import type { SiteData } from "@/lib/site";

/**
 * Insurance, site obligations and qualifications — the three paragraphs a client
 * actually checks — read straight from the admin-editable company record.
 *
 * The old version rendered `certificationsHint`, which appended "update this text with
 * real SOA categories, classifications and expiry dates when available" to the public
 * page: a note to the site's owner, shown to visitors in both languages. The reminder
 * now lives in CHECKLIST.md where it belongs, and the panel renders only the record.
 *
 * `id="garanzie"` is the target of the fourth pillar card, which is why it carries
 * `scroll-mt` for the sticky header.
 */
export async function AboutCredentials({ site }: { site: SiteData }) {
  const t = await getTranslations("AboutPage");
  const tMedia = await getTranslations("AboutMedia");
  const image = ABOUT_IMAGERY.documenti;

  const entries: { icon: LucideIcon; title: string; body: string }[] = [
    { icon: ShieldCheck, title: t("insuranceTitle"), body: site.insurance },
    { icon: FileCheck, title: t("complianceTitle"), body: site.compliance },
    { icon: Award, title: t("certificationsTitle"), body: site.certifications },
  ];

  return (
    <section
      id="garanzie"
      className="scroll-mt-24 border-t border-line bg-raised px-4 py-24 sm:px-6"
      aria-labelledby="about-credentials-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("credentialsLabel")}
          </p>
          <h2
            id="about-credentials-heading"
            className="mt-3 text-balance font-serif text-3xl text-ink-1 sm:text-4xl"
          >
            {t("credentialsTitle")}
          </h2>
          <span
            aria-hidden="true"
            className="mt-6 block h-[2px] w-20 bg-gradient-to-r from-accent to-accent/10"
          />

          <figure className="mt-9 overflow-hidden rounded-3xl border border-line shadow-xl shadow-black/5">
            <div className="photo-card relative aspect-[3/2]">
              <Image
                src={image.src}
                alt={tMedia(image.alt)}
                fill
                quality={72}
                sizes="(min-width: 1024px) 460px, 100vw"
                className="object-cover"
              />
              <PhotoGleam />
            </div>
          </figure>
        </FadeIn>

        <FadeIn delay={0.08} className="lg:col-span-7">
          <dl className="divide-y divide-line border-y border-line">
            {entries.map((entry) => (
              <div key={entry.title} className="flex gap-5 py-7">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent-ink">
                  <entry.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="font-serif text-xl text-ink-1">
                    {entry.title}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-3">
                    {entry.body}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
