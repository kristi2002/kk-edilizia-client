"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import type { HeroVideoSources } from "@/lib/media/hero-media";
import heroPoster from "../../../public/media/hero-poster.jpg";

/**
 * Hero backdrop.
 *
 * Was a hotlinked Unsplash photograph of a stranger's face, reused on two other pages
 * and sitting on the LCP path behind a third-party DNS + TLS handshake. Now self-hosted:
 * an angle grinder cutting a steel window frame inside a gutted brick building — stock
 * footage standing in until the company's own site photography exists.
 *
 * It replaced a locked-off facade shot (Pexels #32228167) that read as a still image
 * behind the headline. This one carries constant motion of its own, and the sparks are
 * gold — the brand `--accent` — against an otherwise near-black frame, so it lifts the
 * hero without competing with the copy on top of it.
 *
 * Source: Pexels #16921102 (Pexels License — commercial use, no attribution required).
 * Cut from 63.5s of the 720p original, denoised, silent, and looped seamlessly by
 * crossfading the tail back over the head: the 9.8s repeat joins two frames that were
 * adjacent in the source, so the seam measures 23.8 dB PSNR against a 24.2 dB baseline
 * for any two consecutive frames — i.e. indistinguishable from ordinary playback (sparks
 * are high-frequency, so no pair of frames here scores high). Only gloved hands and a
 * sleeve are in shot; no face is identifiable.
 *
 * To swap the media, replace the files in `public/media/` keeping these constraints:
 *   hero-poster.jpg   the still (must be the video's own first frame)
 *   hero.webm/.mp4    8-12s silent loop, 1280x720, webm under ~2.5 MB
 * Setting POSTER or the `video` prop back to null restores the CSS-only
 * <DesignedGround /> below.
 *
 * Both are fingerprinted by content so a swap actually reaches browsers that already
 * hold the previous file — the poster by importing it, which makes the bundler emit
 * `/_next/static/media/hero-poster.<contenthash>.jpg`, and the video through
 * `heroVideoSources()`. See `@/lib/media/hero-media` for why the two differ.
 *
 * The poster stays mounted underneath so it — not the video — remains the LCP
 * candidate, and the video fades in only once it is genuinely playing, so there is no
 * black frame between the two.
 */
const POSTER: StaticImageData | null = heroPoster;

export function HeroBackgroundLayers({
  video,
}: {
  video: HeroVideoSources | null;
}) {
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

  const showVideo = video && POSTER && allowVideo && !reduceMotion;

  return (
    <>
      {POSTER ? (
        <Image
          src={POSTER}
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
          poster={POSTER?.src}
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-55" : "opacity-0"
          }`}
        >
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
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
