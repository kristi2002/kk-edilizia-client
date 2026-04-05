"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Calculator,
  ClipboardList,
  Images,
  Info,
  LayoutDashboard,
  Layers,
} from "lucide-react";

const items: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Panoramica", icon: LayoutDashboard, exact: true },
  { href: "/admin/company", label: "Dati azienda", icon: Building2 },
  { href: "/admin/project-types", label: "Tipi di progetto", icon: Layers },
  { href: "/admin/portfolio", label: "Portfolio", icon: Images },
  { href: "/admin/preventivo", label: "Modulo preventivo", icon: ClipboardList },
  { href: "/admin/estimator", label: "Stima costi", icon: Calculator },
  { href: "/admin/info", label: "Info & FAQ", icon: Info },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href || pathname === `${href}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <aside className="flex shrink-0 flex-col border-white/10 bg-[#0a0a0a] md:h-screen md:w-72 md:border-r">
      <div className="border-b border-white/10 px-4 py-4 sm:px-5 sm:py-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a227]">
          K.K Edilizia
        </p>
        <p className="mt-1 font-serif text-lg text-white">Pannello</p>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-1 md:flex-col md:gap-0.5 md:overflow-y-auto md:p-3 [&::-webkit-scrollbar]:hidden"
        aria-label="Sezioni"
      >
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition sm:gap-3 sm:py-3 sm:text-base md:w-full ${
                active
                  ? "bg-[#c9a227]/15 text-[#f0e6c8] ring-1 ring-[#c9a227]/40"
                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${active ? "text-[#c9a227]" : "text-zinc-500"}`}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
