"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const STORAGE_KEY = "kk-edilizia-cookie-consent";

function readStored(): "none" | "essential" | "all" {
  try {
    if (typeof window === "undefined") return "none";
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "all" || v === "1") return "all";
    if (v === "essential") return "essential";
    return "none";
  } catch {
    return "none";
  }
}

function writeStored(mode: "essential" | "all") {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("kk-cookie-consent"));
}

export function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readStored() === "none");
  }, []);

  function acceptAll() {
    writeStored("all");
    setVisible(false);
  }

  function essentialOnly() {
    writeStored("essential");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#0a0a0a]/95 p-4 shadow-2xl backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-400">
          <p id="cookie-banner-title" className="font-medium text-white">
            {t("title")}
          </p>
          <p id="cookie-banner-desc" className="mt-1 leading-relaxed">
            {t("text")}{" "}
            <Link
              href="/privacy#cookie"
              className="text-[#c9a227] underline underline-offset-2 hover:text-[#ddb92e]"
            >
              {t("privacyLink")}
            </Link>
            . {t("hint")}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={essentialOnly}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
          >
            {t("essentialOnly")}
          </button>
          <button
            type="button"
            onClick={acceptAll}
            className="rounded-full bg-[#c9a227] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
