"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { extractPanoramaUrlsFromPannellumConfig } from "@/lib/virtual-tour/extract-panorama-urls";
import { preloadPanoramaImages } from "@/lib/virtual-tour/preload-panoramas";
import "./virtual-tour-shell.css";

const PANORAMA_CSS = "/virtual-tour/pannellum/pannellum.css";

declare global {
  interface Window {
    pannellum?: {
      viewer: (
        container: string | HTMLElement,
        config: Record<string, unknown>,
      ) => { destroy?: () => void };
    };
  }
}

type InitError = "images" | "generic" | null;

export type VirtualTourViewProps = {
  /** Full Pannellum JSON (`default` + `scenes`). Use `buildPannellumConfigFromProjectVirtualTour()`. */
  config: Record<string, unknown>;
};

/**
 * Self-hosted Pannellum from `/virtual-tour/pannellum/*`.
 * Hardened for: client-side revisits (Script `onLoad` often does not re-fire),
 * Strict Mode remounts (destroy + clear container), and missing panoramas.
 */
export function VirtualTourView({ config }: VirtualTourViewProps) {
  const t = useTranslations("VirtualTour");
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<{ destroy?: () => void } | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [error, setError] = useState<InitError>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = PANORAMA_CSS;
    document.head.appendChild(link);
    return () => {
      link.parentNode?.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.pannellum) {
      setScriptReady(true);
      return;
    }
    const interval = window.setInterval(() => {
      if (window.pannellum) {
        setScriptReady(true);
        window.clearInterval(interval);
      }
    }, 50);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 20_000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  const onScriptLoad = useCallback(() => {
    setScriptReady(true);
  }, []);

  useEffect(() => {
    if (!scriptReady || typeof window === "undefined" || !window.pannellum) {
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    async function run() {
      setError(null);
      setIsLoading(true);

      const urls = extractPanoramaUrlsFromPannellumConfig(config);
      const preload = await preloadPanoramaImages(urls);
      if (cancelled) return;
      if (!preload.ok) {
        setError("images");
        setIsLoading(false);
        return;
      }

      const mount = containerRef.current;
      if (!mount || cancelled) return;

      try {
        viewerRef.current?.destroy?.();
        viewerRef.current = null;
        mount.innerHTML = "";
        viewerRef.current = window.pannellum!.viewer(mount, config);
      } catch {
        if (!cancelled) setError("generic");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void run();

    return () => {
      cancelled = true;
      viewerRef.current?.destroy?.();
      viewerRef.current = null;
      el.innerHTML = "";
    };
  }, [scriptReady, retryKey, config]);

  return (
    <>
      <Script
        src="/virtual-tour/pannellum/pannellum.js"
        strategy="afterInteractive"
        onLoad={onScriptLoad}
      />
      <div className="vt-shell">
        {isLoading && !error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0a] text-sm text-zinc-500">
            {t("viewerLoading")}
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#0a0a0a] p-6 text-center">
            <p className="text-sm text-zinc-300">{t("viewerError")}</p>
            <p className="max-w-md text-xs text-zinc-500">
              {error === "images"
                ? t("viewerErrorImages")
                : t("viewerErrorGeneric")}
            </p>
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/10"
              onClick={() => {
                setError(null);
                setRetryKey((k) => k + 1);
              }}
            >
              {t("retry")}
            </button>
          </div>
        )}
        <div
          ref={containerRef}
          className="vt-panorama"
          aria-label="Tour virtuale 360 gradi, usa il mouse o il touch per guardarti intorno"
        />
      </div>
    </>
  );
}
