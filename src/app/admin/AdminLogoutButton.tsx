"use client";

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
      className="rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
    >
      {busy ? "Uscita…" : "Esci"}
    </button>
  );
}
