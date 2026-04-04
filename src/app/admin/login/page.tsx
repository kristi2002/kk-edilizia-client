"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 503) {
        setError(
          "Admin non configurato: imposta ADMIN_PASSWORD e ADMIN_SESSION_SECRET nel server.",
        );
        return;
      }
      if (!res.ok) {
        setError("Password non valida.");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Errore di rete.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-white">Accesso admin</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Area riservata. Nessun link pubblico punta qui.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm text-zinc-400">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-white focus:border-[#c9a227] focus:outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-[#c9a227] px-6 py-2.5 text-sm font-semibold text-[#0a0a0a] disabled:opacity-50"
        >
          {busy ? "Accesso…" : "Entra"}
        </button>
      </form>
    </div>
  );
}
