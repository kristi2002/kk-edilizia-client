"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { notifyNavHashChanged } from "@/hooks/useDocumentHash";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  /** DOM id of the target section on the home page (no `#`). */
  sectionId: string;
};

/**
 * Links to `/#sectionId` on the home page. When the user is already on `/`,
 * scrolls in place instead of relying on client navigation (which often does not
 * run hash scroll for same-route updates).
 */
export function HomeSectionLink({ sectionId, onClick, ...props }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={{ pathname: "/", hash: sectionId }}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (pathname !== "/") return;
        e.preventDefault();
        const el = document.getElementById(sectionId);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        const { pathname: p, search } = window.location;
        window.history.replaceState(null, "", `${p}${search}#${sectionId}`);
        notifyNavHashChanged();
      }}
    />
  );
}
