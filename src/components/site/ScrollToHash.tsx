"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

function scrollToHashTarget() {
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) return;
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const run = () => {
      scrollToHashTarget();
    };
    run();
    const t1 = window.setTimeout(run, 50);
    const t2 = window.setTimeout(run, 200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => scrollToHashTarget();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
