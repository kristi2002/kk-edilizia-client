import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/motion/FadeIn";
import { PhotoGleam } from "@/components/decor/PhotoGleam";
import { SERVICE_IMAGERY } from "@/lib/media/service-imagery";
import type { ServiceSiloKey } from "@/lib/service-silos";

type Props = {
  siloKey: ServiceSiloKey;
  /** Two captions from the silo copy, in the order the frames run. */
  captions: string[];
};

/**
 * The gallery pair.
 *
 * Two 3:2 frames, offset vertically so the row does not read as a strip of thumbnails,
 * each with a caption naming what it shows. These are stock photographs standing in
 * until the firm's own site pictures exist — the caption describes the *work*, never
 * "one of our projects", because that is a claim the photograph cannot support. When
 * real photography lands, the captions are already the right shape for it.
 */
export async function ServiceSiloGallery({ siloKey, captions }: Props) {
  const t = await getTranslations("ServiceSilos");
  const tMedia = await getTranslations("ServiceMedia");
  const frames = [SERVICE_IMAGERY[siloKey].a, SERVICE_IMAGERY[siloKey].b];

  return (
    <section className="relative overflow-hidden bg-page px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_78%,rgba(201,162,39,0.06),transparent_48%)]" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-ink">
            {t("galleryEyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink-1 sm:text-4xl">
            {t("galleryTitle")}
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 sm:gap-8">
          {frames.map((image, i) => (
            <FadeIn key={image.pexels} delay={i * 0.08}>
              <figure className={i === 1 ? "sm:mt-14" : undefined}>
                <div className="photo-card group relative aspect-[3/2] overflow-hidden rounded-2xl border border-line">
                  <Image
                    src={image.src}
                    alt={tMedia(image.alt)}
                    fill
                    quality={72}
                    sizes="(min-width: 640px) 46vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <PhotoGleam />
                </div>
                <figcaption className="mt-4 flex gap-3 text-sm leading-relaxed text-ink-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-6 shrink-0 bg-accent/60"
                  />
                  {captions[i] ?? ""}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <p className="mt-12 max-w-2xl text-xs leading-relaxed text-ink-4">
            {t("galleryNote")}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
