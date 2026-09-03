"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { readConsent, writeConsent } from "@/lib/consent";

export function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // After mount, sync with localStorage (avoid SSR/client mismatch on first paint).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: read storage only in browser
    setVisible(readConsent() === "none");
  }, []);

  useEffect(() => {
    if (visible) acceptRef.current?.focus();
  }, [visible]);

  function choose(mode: "essential" | "all") {
    writeConsent(mode);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#0a0a0a]/95 p-4 shadow-2xl backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="text-sm text-ink-3">
          <p id="cookie-banner-title" className="font-medium text-white">
            {t("title")}
          </p>
          {/* Kept to two lines: the previous copy filled an entire phone viewport. */}
          <p id="cookie-banner-desc" className="mt-1 leading-relaxed">
            {t("text")}{" "}
            <Link
              href="/privacy#cookie"
              className="text-[#c9a227] underline underline-offset-2 hover:text-[#ddb92e]"
            >
              {t("privacyLink")}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="flex-1 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-ink-2 transition hover:bg-white/10 sm:flex-none"
          >
            {t("essentialOnly")}
          </button>
          <button
            ref={acceptRef}
            type="button"
            onClick={() => choose("all")}
            className="sweep flex-1 rounded-full bg-[#c9a227] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e] sm:flex-none"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
