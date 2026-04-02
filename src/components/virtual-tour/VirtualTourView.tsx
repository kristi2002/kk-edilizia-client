"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { getPannellumMultiSceneConfig } from "@/lib/virtual-tour/pannellum-config";

const PANORAMA_CSS = "/virtual-tour/pannellum/pannellum.css";

declare global {
  interface Window {
    pannellum?: {
      viewer: (
        container: string | HTMLElement,
        config: Record<string, unknown>
      ) => { destroy?: () => void };
    };
  }
}

const PANORAMA_CONTAINER_ID = "panorama";

/**
 * Carica Pannellum da `/virtual-tour/pannellum/*` (file copiati in public da
 * `node_modules/pannellum/build`). Inizializza la modalità multi-scena con
 * hotspot type "scene" per collegare le stanze.
 */
export function VirtualTourView() {
  const [scriptReady, setScriptReady] = useState(false);
  const viewerRef = useRef<{ destroy?: () => void } | null>(null);

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
    if (!scriptReady || typeof window === "undefined" || !window.pannellum) {
      return;
    }

    const el = document.getElementById(PANORAMA_CONTAINER_ID);
    if (!el) return;

    const config = getPannellumMultiSceneConfig();
    viewerRef.current = window.pannellum.viewer(PANORAMA_CONTAINER_ID, config);

    return () => {
      viewerRef.current?.destroy?.();
      viewerRef.current = null;
    };
  }, [scriptReady]);

  return (
    <>
      <Script
        src="/virtual-tour/pannellum/pannellum.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="vt-shell">
        <div
          id={PANORAMA_CONTAINER_ID}
          className="vt-panorama"
          aria-label="Tour virtuale 360 gradi, usa il mouse o il touch per guardarti intorno"
        />
      </div>
    </>
  );
}
