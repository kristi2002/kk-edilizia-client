"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import { adminAlertErr, adminBtnPrimary, adminInput, adminLabel } from "../admin-ui";

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
          "Accesso non ancora configurato sul server. Serve l’aiuto di chi gestisce il sito.",
        );
        return;
      }
      if (!res.ok) {
        setError("Password non corretta. Riprova con attenzione ai caratteri maiuscoli.");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Connessione assente. Controlla internet e riprova.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border-2 border-[#c9a227]/25 bg-gradient-to-b from-[#1a1610] to-[#0a0a0a] p-8 shadow-xl sm:p-10">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c9a227] text-[#0a0a0a]">
          <Lock className="size-6" aria-hidden />
        </span>
        <div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Accesso riservato</h1>
          <p className="mt-1 text-base text-zinc-500">
            Solo per chi gestisce i contenuti del sito.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-10 space-y-6">
        <div>
          <label className={adminLabel} htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={adminInput}
            placeholder="Inserisci la password"
          />
        </div>
        {error && (
          <div className={adminAlertErr} role="alert">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={busy}
          className={`${adminBtnPrimary} w-full`}
        >
          {busy ? "Accesso in corso…" : "Entra nel pannello"}
        </button>
      </form>
    </div>
  );
}
