"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { isCostEstimateEnabled } from "@/lib/features";

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", labelKey: "home" as const },
    // Portfolio / «Lavori»: hidden until site photos are ready (restore nav tab).
    // { href: "/portfolio", labelKey: "portfolio" as const },
    { href: "/chi-siamo", labelKey: "about" as const },
    ...(isCostEstimateEnabled()
      ? [{ href: "/stima-costi", labelKey: "estimate" as const }]
      : []),
    { href: "/contatti", labelKey: "contacts" as const },
    { href: "/prenota", labelKey: "booking" as const },
    { href: "/preventivo", labelKey: "quote" as const },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-baseline gap-2">
          <span className="font-serif text-xl tracking-tight text-white sm:text-2xl">
            K.K
          </span>
          <span className="hidden text-sm font-medium uppercase tracking-[0.2em] text-[#c9a227] sm:inline">
            Edilizia
          </span>
        </Link>

        <nav className="hidden flex-wrap items-center justify-end gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.labelKey}
                href={l.href}
                className={`relative z-0 rounded-full px-2.5 py-2 text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {active && (
                  <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/10" />
                )}
                {t(l.labelKey)}
              </Link>
            );
          })}
          <LocaleSwitcher />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 bg-[#0a0a0a] lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.labelKey}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-3 py-3 text-base ${
                      active ? "bg-white/10 text-white" : "text-zinc-400"
                    }`}
                  >
                    {t(l.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LocaleSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("Nav");
  const other = locale === "it" ? "en" : "it";
  return (
    <Link
      href={pathname}
      locale={other}
      aria-label={
        other === "en" ? t("switchToEnglish") : t("switchToItalian")
      }
      className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition hover:border-[#c9a227]/50 hover:text-white"
    >
      {other === "en" ? t("langEn") : t("langIt")}
    </Link>
  );
}
