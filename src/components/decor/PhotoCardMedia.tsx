import Image from "next/image";
import type { CSSProperties } from "react";
import type { HomeImage } from "@/lib/media/home-imagery";

/**
 * The photographic ground of a `.photo-card`, plus its specular gleam.
 *
 * Drop it as the first child of an element carrying `photo-card`; the CSS in
 * `globals.css` handles the scrim and the hover behaviour. Sizes are declared narrow on
 * purpose — these render as card grounds a few hundred pixels wide, never full-bleed,
 * so Next serves an AVIF a fraction of the source's weight.
 *
 * `image.tone` arrives as custom properties rather than a class: the correction is a
 * property of the individual photograph (see `scripts/compute-image-tone.mjs`), and
 * without it the pale pictures in the set — white drawings, a cream wall — washed out
 * completely at the opacity that suited the darker ones.
 */
export function PhotoCardMedia({
  image,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw",
}: {
  image: HomeImage;
  /** Empty string for purely decorative grounds, which are then hidden from AT. */
  alt: string;
  priority?: boolean;
  /**
   * Override for grids wider than the four-up Services row this was written for — the
   * About page's pillars are two-up, so the default 320px would be served upscaled.
   */
  sizes?: string;
}) {
  const tone = image.tone
    ? ({
        "--photo-brightness": String(image.tone.brightness),
        "--photo-contrast": String(image.tone.contrast),
      } as CSSProperties)
    : undefined;

  return (
    <>
      <span
        className="photo-card__media"
        style={tone}
        aria-hidden={alt === "" || undefined}
      >
        <Image
          src={image.src}
          alt={alt}
          fill
          quality={72}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes={sizes}
        />
      </span>
      <span className="photo-card__gleam" aria-hidden="true" />
    </>
  );
}
