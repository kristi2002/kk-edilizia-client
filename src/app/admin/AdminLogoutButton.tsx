"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

export function AdminLogoutButton() {
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 bg-white/[0.07] px-6 py-3.5 text-base font-medium text-zinc-100 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <LogOut className="size-5" aria-hidden />
      {busy ? "Uscita…" : "Esci dall’area riservata"}
    </button>
  );
}
