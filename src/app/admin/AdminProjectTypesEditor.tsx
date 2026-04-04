"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectTypeDef } from "@/lib/data/project-types";
import { messageFromAdminPutFailure } from "@/lib/admin-api-error";
import { adminField } from "./admin-ui";

type Props = {
  initialProjectTypes: ProjectTypeDef[];
  redisOk: boolean;
};

export function AdminProjectTypesEditor({
  initialProjectTypes,
  redisOk,
}: Props) {
  const router = useRouter();
  const [projectTypes, setProjectTypes] = useState<ProjectTypeDef[]>(() =>
    structuredClone(initialProjectTypes),
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const saveTypes = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/project-types", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectTypes),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setError(messageFromAdminPutFailure(res.status, data));
        return;
      }
      setMessage("Tipi di progetto salvati.");
      router.refresh();
    } catch {
      setError("Rete non disponibile.");
    } finally {
      setBusy(false);
    }
  };

  const seedTypes = async () => {
    if (!window.confirm("Ripristinare i tipi progetto dal codice?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/project-types/seed", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return;
      const refreshed = await fetch("/api/admin/project-types", {
        credentials: "include",
      });
      setProjectTypes((await refreshed.json()) as ProjectTypeDef[]);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const addProjectType = () => {
    const id = window.prompt("Id tipo (es. attico):", "nuovo-tipo");
    if (!id?.trim()) return;
    setProjectTypes((t) => [
      ...t,
      { id: id.trim().replace(/\s+/g, "-"), labelIt: "Nuovo tipo", labelEn: "New type" },
    ]);
  };

  const removeProjectType = (id: string) => {
    setProjectTypes((t) => t.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-black/20 p-4 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Elenco tipi
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Questi valori compaiono nel menu «Tipo» di ogni progetto nel portfolio. Modifica IT/EN e
          salva qui.
        </p>
        <div className="mt-4 space-y-2">
          {projectTypes.map((t) => (
            <div
              key={t.id}
              className="flex flex-wrap items-end gap-2 border-b border-white/5 pb-2"
            >
              <label className="text-xs text-zinc-500">
                id
                <input
                  className={adminField}
                  value={t.id}
                  onChange={(e) =>
                    setProjectTypes((pt) =>
                      pt.map((x) =>
                        x.id === t.id ? { ...x, id: e.target.value } : x,
                      ),
                    )
                  }
                />
              </label>
              <label className="min-w-[120px] flex-1 text-xs text-zinc-500">
                IT
                <input
                  className={adminField}
                  value={t.labelIt}
                  onChange={(e) =>
                    setProjectTypes((pt) =>
                      pt.map((x) =>
                        x.id === t.id ? { ...x, labelIt: e.target.value } : x,
                      ),
                    )
                  }
                />
              </label>
              <label className="min-w-[120px] flex-1 text-xs text-zinc-500">
                EN
                <input
                  className={adminField}
                  value={t.labelEn}
                  onChange={(e) =>
                    setProjectTypes((pt) =>
                      pt.map((x) =>
                        x.id === t.id ? { ...x, labelEn: e.target.value } : x,
                      ),
                    )
                  }
                />
              </label>
              <button
                type="button"
                onClick={() => removeProjectType(t.id)}
                className="text-xs text-red-400"
              >
                Rimuovi
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addProjectType}
            className="rounded border border-white/15 px-3 py-1.5 text-sm"
          >
            Aggiungi tipo
          </button>
          <button
            type="button"
            onClick={() => void seedTypes()}
            disabled={busy || !redisOk}
            className="rounded border border-white/15 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Tipi da codice
          </button>
          <button
            type="button"
            onClick={() => void saveTypes()}
            disabled={busy || !redisOk}
            className="rounded bg-[#c9a227]/90 px-4 py-1.5 text-sm font-semibold text-black disabled:opacity-40"
          >
            {busy ? "…" : "Salva tipi"}
          </button>
        </div>
      </section>

      {message && <p className="text-sm text-emerald-400/90">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
        Dopo aver salvato, in <strong className="text-zinc-200">Portfolio</strong> potrai
        assegnare ogni lavoro a un tipo dal menu a tendina.
      </p>
    </div>
  );
}
