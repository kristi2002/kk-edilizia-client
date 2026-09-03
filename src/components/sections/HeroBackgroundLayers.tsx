"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hero backdrop.
 *
 * Was a hotlinked Unsplash photograph of a stranger's face, reused on two other pages
 * and sitting on the LCP path behind a third-party DNS + TLS handshake. Now self-hosted:
 * a locked-off shot of a facade restoration from scaffolding — stock footage standing in
 * until the company's own site photography exists.
 *
 * Source: Pexels #32228167 (Pexels License — commercial use, no attribution required).
 * Re-cut from the 1080p original: 1280x720, silent, and looped seamlessly by crossfading
 * the tail back over the head, so the 7.3s repeat has no visible seam (endpoints match at
 * ~39 dB PSNR). No face is identifiable in frame.
 *
 * To swap the media, replace the files in `public/media/` keeping these constraints:
 *   hero-poster.jpg   the still (must be the video's own first frame)
 *   hero.webm/.mp4    8-12s silent loop, 1280x720, webm under ~2.5 MB
 * Setting either field back to null restores the CSS-only <DesignedGround /> below.
 *
 * The poster stays mounted underneath so it — not the video — remains the LCP
 * candidate, and the video fades in only once it is genuinely playing, so there is no
 * black frame between the two.
 */
const HERO_MEDIA = {
  poster: "/media/hero-poster.jpg" as string | null,
  video: { webm: "/media/hero.webm", mp4: "/media/hero.mp4" } as {
    webm: string;
    mp4: string;
  } | null,
};

export function HeroBackgroundLayers() {
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  /** Reading a browser API, not deriving state — so no effect and no cascading render. */
  const allowVideo = useSyncExternalStore(
    subscribeNever,
    () =>
      !(navigator as Navigator & { connection?: { saveData?: boolean } })
        .connection?.saveData,
    () => false,
  );

  const showVideo =
    HERO_MEDIA.video && HERO_MEDIA.poster && allowVideo && !reduceMotion;

  return (
    <>
      {HERO_MEDIA.poster ? (
        <Image
          src={HERO_MEDIA.poster}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={72}
          className="object-cover opacity-55"
          sizes="100vw"
        />
      ) : (
        <DesignedGround />
      )}

      {showVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={HERO_MEDIA.poster ?? undefined}
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-55" : "opacity-0"
          }`}
        >
          <source src={HERO_MEDIA.video!.webm} type="video/webm" />
          <source src={HERO_MEDIA.video!.mp4} type="video/mp4" />
        </video>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-b from-inverse/30 via-inverse/75 to-inverse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent" />
    </>
  );
}

const subscribeNever = () => () => {};

/** CSS-only backdrop: blueprint grid, a warm pool of light, and two oversized rings. */
function DesignedGround() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-inverse">
      <span className="wm-grid opacity-90" />
      <span className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl" />
      <span className="absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-accent-deep/10 blur-3xl" />
      <span className="wm-ring -right-40 top-10 hidden sm:block" />
      <span className="wm-ring -bottom-52 left-1/3 hidden lg:block" />
    </div>
  );
}
