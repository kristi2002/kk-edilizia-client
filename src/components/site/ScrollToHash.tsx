"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useSyncExternalStore } from "react";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function getHashSnapshot() {
  return typeof window !== "undefined" ? window.location.hash : "";
}

function scrollToHashTarget(): boolean {
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) return true;
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return true;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function ScrollToHash() {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeHash, getHashSnapshot, () => "");

  useEffect(() => {
    let cancelled = false;
    let frames = 0;
    const maxFrames = 90;

    const tryScroll = () => {
      if (cancelled) return;
      if (scrollToHashTarget()) return;
      frames += 1;
      if (frames < maxFrames) {
        requestAnimationFrame(tryScroll);
      }
    };

    tryScroll();
    const t1 = window.setTimeout(() => {
      if (!cancelled) scrollToHashTarget();
    }, 0);
    const t2 = window.setTimeout(() => {
      if (!cancelled) scrollToHashTarget();
    }, 50);
    const t3 = window.setTimeout(() => {
      if (!cancelled) scrollToHashTarget();
    }, 200);
    const t4 = window.setTimeout(() => {
      if (!cancelled) scrollToHashTarget();
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [pathname, hash]);

  return null;
}
