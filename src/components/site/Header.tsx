"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { isCostEstimateEnabled } from "@/lib/features";
import { SERVICE_SILO_ROUTES, type ServiceSiloKey } from "@/lib/service-silos";

export function Header() {
  const t = useTranslations("Nav");
  const tFooter = useTranslations("Footer");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const menuId = useId();
  const servicesId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  /**
   * The nine service silos are the pages the whole search strategy points at, and they
   * used to appear in no navigation at all — footer links only.
   */
  const siloLabels: Record<ServiceSiloKey, string> = {
    chiaviInMano: tFooter("linkChiaviInMano"),
    bagno: tFooter("linkBagno"),
    cucina: tFooter("linkCucina"),
    elettrico: tFooter("linkElettrico"),
    idraulico: tFooter("linkIdraulico"),
    murarie: tFooter("linkMurarie"),
    cartongessoIsolamento: tFooter("linkCartongessoIsolamento"),
    pavimentiRivestimenti: tFooter("linkPavimentiRivestimenti"),
    tettoFacciate: tFooter("linkTettoFacciate"),
  };
  const siloPaths = SERVICE_SILO_ROUTES.map((r) => r.path) as string[];

  const links = [
    { href: "/", labelKey: "home" as const },
    { href: "/chi-siamo", labelKey: "about" as const },
    ...(isCostEstimateEnabled()
      ? [{ href: "/stima-costi", labelKey: "estimate" as const }]
      : []),
    { href: "/contatti", labelKey: "contacts" as const },
    { href: "/prenota", labelKey: "booking" as const },
  ];

  /** A sub-page should light up its parent; this used to be an exact-match test. */
  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname],
  );
  const servicesActive = siloPaths.some((p) => pathname.startsWith(p));

  const closeAll = useCallback(() => {
    setOpen(false);
    setServicesOpen(false);
  }, []);

  /**
   * Close both menus when the route changes. Adjusting state during render is React's
   * documented alternative to an effect here, and avoids the cascading re-render.
   */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setServicesOpen(false);
  }

  /** Escape closes, and the mobile panel locks the page behind it. */
  useEffect(() => {
    if (!open && !servicesOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      closeAll();
      toggleRef.current?.focus();
    }
    function onPointer(e: PointerEvent) {
      const target = e.target as Node;
      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, servicesOpen, closeAll]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /** Keep tabbing inside the open mobile panel. */
  function trapTab(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          {/* The brand mark existed only as an 8 MB favicon; it now appears on screen. */}
          <Image
            src="/logo-mark.png"
            alt=""
            width={32}
            height={32}
            priority
            className="h-8 w-8 shrink-0 object-contain"
          />
          <span className="flex min-w-0 items-baseline gap-2">
            <span className="font-serif text-xl tracking-tight text-white sm:text-2xl">
              K.K
            </span>
            <span className="hidden text-sm font-medium uppercase tracking-[0.2em] text-[#c9a227] sm:inline">
              Edilizia
            </span>
          </span>
        </Link>

        <nav className="hidden items-center justify-end gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.labelKey} href={l.href} active={isActive(l.href)}>
              {t(l.labelKey)}
            </NavLink>
          ))}

          <div ref={servicesRef} className="relative">
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-controls={servicesId}
              onClick={() => setServicesOpen((v) => !v)}
              className={`relative z-0 inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-medium transition-colors ${
                servicesActive ? "text-white" : "text-ink-3 hover:text-white"
              }`}
            >
              {servicesActive && (
                <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/10" />
              )}
              {t("services")}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  id={servicesId}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] p-2 shadow-2xl shadow-black/60"
                >
                  <ul>
                    {SERVICE_SILO_ROUTES.map((route) => (
                      <li key={route.path}>
                        <Link
                          href={route.path}
                          className="block rounded-lg px-3 py-2 text-sm text-ink-2 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          {siloLabels[route.key]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <LocaleSwitcher />

          <Link
            href="/preventivo"
            className="sweep ml-2 inline-flex items-center rounded-full bg-[#c9a227] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e]"
          >
            {t("quote")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LocaleSwitcher />
          <button
            ref={toggleRef}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            ref={panelRef}
            onKeyDown={trapTab}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-[#0a0a0a] lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <Link
                  key={l.labelKey}
                  href={l.href}
                  onClick={closeAll}
                  className={`rounded-lg px-3 py-3 text-base ${
                    isActive(l.href)
                      ? "bg-white/10 text-white"
                      : "text-ink-3"
                  }`}
                >
                  {t(l.labelKey)}
                </Link>
              ))}

              <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
                {t("services")}
              </p>
              {SERVICE_SILO_ROUTES.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={closeAll}
                  className={`rounded-lg px-3 py-2.5 text-sm ${
                    pathname.startsWith(route.path)
                      ? "bg-white/10 text-white"
                      : "text-ink-3"
                  }`}
                >
                  {siloLabels[route.key]}
                </Link>
              ))}

              <Link
                href="/preventivo"
                onClick={closeAll}
                className="mt-4 rounded-full bg-[#c9a227] px-5 py-3 text-center text-sm font-semibold text-[#0a0a0a]"
              >
                {t("quote")}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative z-0 rounded-full px-2.5 py-2 text-sm font-medium transition-colors ${
        active ? "text-white" : "text-ink-3 hover:text-white"
      }`}
    >
      {active && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/10" />
      )}
      {children}
    </Link>
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
      aria-label={other === "en" ? t("switchToEnglish") : t("switchToItalian")}
      className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3 transition hover:border-[#c9a227]/50 hover:text-white"
    >
      {other === "en" ? t("langEn") : t("langIt")}
    </Link>
  );
}
