"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hero backdrop.
 *
 * Was a hotlinked Unsplash photograph of a stranger's face, reused on two other pages
 * and sitting on the LCP path behind a third-party DNS + TLS handshake. Until the
 * company's own media exists this renders a designed, self-contained ground.
 *
 * To switch media on, drop the files into `public/media/` and flip HERO_MEDIA:
 *   hero-poster.jpg   the still (must be the video's own first frame)
 *   hero.webm/.mp4    8-12s silent loop, 1280x720, webm under ~2.5 MB
 *
 * The poster stays mounted underneath so it — not the video — remains the LCP
 * candidate, and the video fades in only once it is genuinely playing, so there is no
 * black frame between the two.
 */
const HERO_MEDIA = {
  poster: null as string | null,
  video: null as { webm: string; mp4: string } | null,
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

      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/30 via-[#080808]/75 to-[#080808]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c9a227]/12 via-transparent to-transparent" />
    </>
  );
}

const subscribeNever = () => () => {};

/** CSS-only backdrop: blueprint grid, a warm pool of light, and two oversized rings. */
function DesignedGround() {
  return (
    <div aria-hidden="true" className="absolute inset-0 bg-[#080808]">
      <span className="wm-grid opacity-90" />
      <span className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-[#c9a227]/[0.07] blur-3xl" />
      <span className="absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[#a9822f]/[0.06] blur-3xl" />
      <span className="wm-ring -right-40 top-10 hidden sm:block" />
      <span className="wm-ring -bottom-52 left-1/3 hidden lg:block" />
    </div>
  );
}
