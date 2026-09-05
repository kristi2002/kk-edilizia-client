"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { OVERSCAN } from "./logo-mark-frame";
/**
 * Imported, not written as `src="/logo-mark.png"`. The bare path is a stable URL, so a
 * replaced crest never reaches a browser that already holds the old one — and with
 * `images.minimumCacheTTL` now set to a year, the optimizer would hold it that long too.
 * The import makes the bundler emit `logo-mark.<contenthash>.png`, so the URL moves when
 * the bytes do.
 */
import logoMark from "../../../public/logo-mark.png";

/**
 * The brand crest. Ships as the flat PNG and upgrades itself, in place, to the WebGL
 * mark in `LogoMarkScene` once the page is idle and the mark is on screen.
 *
 * The flat PNG is not a placeholder to be tolerated — it is what search engines, the
 * social card scrapers, every reduced-hardware visitor and the first paint all get, so
 * it renders on the server and the canvas cross-fades over it only after it has drawn a
 * real frame. If anything in that chain fails — no WebGL, a lost context, a texture that
 * 404s — the PNG is simply never faded out and nobody sees a hole.
 */

const LogoMarkScene = dynamic(() => import("./LogoMarkScene"), { ssr: false });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * Decides when the upgrade is worth making: on screen, past first paint, and on hardware
 * that can actually draw it. The idle wait matters most in the header, which is fixed and
 * therefore "in view" on every route — without it, three.js would land on the critical
 * path of every single navigation.
 */
function useUpgradeWhenIdle(target: React.RefObject<HTMLElement | null>) {
  const [upgrade, setUpgrade] = useState(false);

  useEffect(() => {
    const node = target.current;
    if (!node || !supportsWebGL()) return;

    let idle: number | undefined;
    const schedule = () => {
      const run = () => setUpgrade(true);
      // Safari only shipped requestIdleCallback in 18.4; the timer is the fallback.
      idle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(run, { timeout: 2500 })
          : window.setTimeout(run, 1200);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        schedule();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (idle === undefined) return;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [target]);

  return upgrade;
}

/** Reduced motion keeps the depth and drops the sway — it is a motion setting, not a 2D one. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function LogoMark({
  size,
  priority = false,
  className = "",
}: {
  /** Rendered size in px, for both the PNG and the crest inside the canvas. */
  size: number;
  priority?: boolean;
  className?: string;
}) {
  const host = useRef<HTMLSpanElement>(null);
  const upgrade = useUpgradeWhenIdle(host);
  const reducedMotion = usePrefersReducedMotion();
  const [drawn, setDrawn] = useState(false);

  return (
    <span
      ref={host}
      className={`relative isolate block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={logoMark}
        alt=""
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-contain transition-opacity duration-500"
        style={{ opacity: drawn ? 0 : 1 }}
      />
      {upgrade && (
        <SceneBoundary>
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500"
            style={{
              width: size * OVERSCAN,
              height: size * OVERSCAN,
              opacity: drawn ? 1 : 0,
            }}
          >
            <LogoMarkScene animated={!reducedMotion} onReady={() => setDrawn(true)} />
          </span>
        </SceneBoundary>
      )}
    </span>
  );
}
