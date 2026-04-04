"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EstimatorCategoryRow } from "@/lib/data/cost-estimator";
import { messageFromAdminPutFailure } from "@/lib/admin-api-error";

type Props = {
  initialRows: EstimatorCategoryRow[];
  redisOk: boolean;
};

const inp =
  "mt-1 w-full rounded border border-white/10 bg-[#0a0a0a] px-2 py-1.5 text-xs text-white";

export function AdminEstimatorEditor({ initialRows, redisOk }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<EstimatorCategoryRow[]>(() =>
    structuredClone(initialRows),
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/estimator", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rows),
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
      setMessage("Fasce salvate.");
      router.refresh();
    } catch {
      setError("Rete non disponibile.");
    } finally {
      setBusy(false);
    }
  };

  const seed = async () => {
    if (!window.confirm("Ripristinare le fasce dal codice (cost-estimator)?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/estimator/seed", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        setError(messageFromAdminPutFailure(res.status, data));
        return;
      }
      const refreshed = await fetch("/api/admin/estimator", {
        credentials: "include",
      });
      setRows((await refreshed.json()) as EstimatorCategoryRow[]);
      setMessage("Ripristinato dal codice.");
      router.refresh();
    } catch {
      setError("Rete non disponibile.");
    } finally {
      setBusy(false);
    }
  };

  const addRow = () => {
    setRows((r) => [
      ...r,
      {
        id: `nuova-${Date.now()}`,
        minPerSqm: 100,
        maxPerSqm: 200,
        labelIt: "Nuova fascia",
        descriptionIt: "Descrizione IT",
        labelEn: "New band",
        descriptionEn: "EN description",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const setRow = (id: string, patch: Partial<EstimatorCategoryRow>) => {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  return (
    <div className="space-y-4">
      {!redisOk && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Redis non configurato: impossibile salvare le fasce da qui.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void seed()}
          disabled={busy || !redisOk}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40"
        >
          Ripristina da codice
        </button>
        <button
          type="button"
          onClick={addRow}
          disabled={busy}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-zinc-200 disabled:opacity-40"
        >
          Aggiungi fascia
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !redisOk}
          className="rounded-lg bg-[#c9a227] px-3 py-1.5 text-xs font-semibold text-[#0a0a0a] disabled:opacity-40"
        >
          {busy ? "…" : "Salva stima costi"}
        </button>
      </div>

      {message && <p className="text-sm text-emerald-400/90">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-zinc-500">
              <th className="py-2 pr-2">id</th>
              <th className="py-2 pr-2">min €/m²</th>
              <th className="py-2 pr-2">max €/m²</th>
              <th className="py-2 pr-2">Label IT</th>
              <th className="py-2 pr-2">Descr. IT</th>
              <th className="py-2 pr-2">Label EN</th>
              <th className="py-2 pr-2">Descr. EN</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 align-top">
                <td className="py-2 pr-2">
                  <input
                    className={inp}
                    value={row.id}
                    onChange={(e) => setRow(row.id, { id: e.target.value })}
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className={inp}
                    value={row.minPerSqm}
                    onChange={(e) =>
                      setRow(row.id, { minPerSqm: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="number"
                    className={inp}
                    value={row.maxPerSqm}
                    onChange={(e) =>
                      setRow(row.id, { maxPerSqm: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className={inp}
                    value={row.labelIt}
                    onChange={(e) => setRow(row.id, { labelIt: e.target.value })}
                  />
                </td>
                <td className="py-2 pr-2">
                  <textarea
                    className={`${inp} min-h-[52px]`}
                    value={row.descriptionIt}
                    onChange={(e) =>
                      setRow(row.id, { descriptionIt: e.target.value })
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className={inp}
                    value={row.labelEn}
                    onChange={(e) => setRow(row.id, { labelEn: e.target.value })}
                  />
                </td>
                <td className="py-2 pr-2">
                  <textarea
                    className={`${inp} min-h-[52px]`}
                    value={row.descriptionEn}
                    onChange={(e) =>
                      setRow(row.id, { descriptionEn: e.target.value })
                    }
                  />
                </td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="text-red-400 hover:underline"
                  >
                    Rimuovi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
