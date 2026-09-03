import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { PhotoGleam } from "@/components/decor/PhotoGleam";
import { SERVICE_IMAGERY } from "@/lib/media/service-imagery";
import type { ServiceSiloKey } from "@/lib/service-silos";
import { MapPin, ShieldCheck } from "lucide-react";

type Props = {
  siloKey: ServiceSiloKey;
  /** The first two paragraphs of the silo copy: method, then materials. */
  bodies: string[];
};

/**
 * The opening two paragraphs, set beside a vertical photograph.
 *
 * The whole page used to be one 768px measure — nine sections of grey text with no
 * change of rhythm. Here the copy keeps a comfortable measure but the column no longer
 * runs the width of the page alone: the 4:5 frame beside it holds the eye, and the two
 * panels underneath carry the area and compliance statements that used to sit above the
 * fold competing with the CTAs.
 *
 * The photograph is described (its `alt` is a real `ServiceMedia` key) because it is
 * shown at full strength and carries information the copy does not.
 */
export async function ServiceSiloIntro({ siloKey, bodies }: Props) {
  const t = await getTranslations("ServiceSilos");
  const tMedia = await getTranslations("ServiceMedia");
  const image = SERVICE_IMAGERY[siloKey].aside;

  return (
    <section className="rule-gold relative overflow-hidden bg-page px-4 py-24 sm:px-6">
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
              {t("methodEyebrow")}
            </p>
            <h2 className="mt-3 max-w-xl text-balance font-serif text-3xl text-ink-1 sm:text-4xl">
              {t("methodTitle")}
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-2">
              {bodies.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <FadeIn delay={0.06}>
              <div className="h-full rounded-2xl border border-accent/25 bg-accent/[0.07] p-6">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {t("areaPanelTitle")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {t("modenaArea")}
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="h-full rounded-2xl border border-line bg-raised p-6">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-3">
                  <ShieldCheck className="h-4 w-4 text-accent-ink" aria-hidden />
                  {t("compliancePanelTitle")}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-3">
                  {t("complianceModena")}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>

        <FadeIn delay={0.12}>
          {/* The frame is a second element offset behind the picture, not a border on it:
              a border would crop with the image and lose the gold at the corners. */}
          <div className="relative lg:sticky lg:top-28">
            <span
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 hidden rounded-2xl border border-accent/40 sm:block sm:inset-y-6 sm:left-6"
            />
            <div className="photo-card relative aspect-[4/5] overflow-hidden rounded-2xl border border-line">
              <Image
                src={image.src}
                alt={tMedia(image.alt)}
                fill
                quality={76}
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
              />
              <PhotoGleam />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
