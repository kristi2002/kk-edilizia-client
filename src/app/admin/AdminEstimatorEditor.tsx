"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { EstimatorCategoryRow } from "@/lib/data/cost-estimator";
import { messageFromAdminPutFailure } from "@/lib/admin-api-error";
import {
  adminAlertWarn,
  adminBtnPrimary,
  adminBtnSecondary,
  adminField,
} from "./admin-ui";

type Props = {
  initialRows: EstimatorCategoryRow[];
  redisOk: boolean;
};

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
    <div className="space-y-6">
      {!redisOk && (
        <div className={adminAlertWarn} role="alert">
          Salvataggio disattivato: manca la memoria Redis sul server. Contatta chi gestisce
          il sito.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !redisOk}
          className={adminBtnPrimary}
        >
          {busy ? "Salvataggio…" : "Salva stima costi"}
        </button>
        <button
          type="button"
          onClick={addRow}
          disabled={busy}
          className={adminBtnSecondary}
        >
          Aggiungi fascia
        </button>
        <button
          type="button"
          onClick={() => void seed()}
          disabled={busy || !redisOk}
          className={adminBtnSecondary}
        >
          Ripristina valori originali
        </button>
      </div>

      {message && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-base text-emerald-100">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-base text-red-100">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-zinc-400">
              <th className="px-3 py-3 pr-2 font-semibold">Codice</th>
              <th className="py-3 pr-2 font-semibold">Min €/m²</th>
              <th className="py-3 pr-2 font-semibold">Max €/m²</th>
              <th className="py-3 pr-2 font-semibold">Titolo IT</th>
              <th className="py-3 pr-2 font-semibold">Testo IT</th>
              <th className="py-3 pr-2 font-semibold">Titolo EN</th>
              <th className="py-3 pr-2 font-semibold">Testo EN</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 align-top">
                <td className="p-2 pr-2">
                  <input
                    className={adminField}
                    value={row.id}
                    onChange={(e) => setRow(row.id, { id: e.target.value })}
                  />
                </td>
                <td className="p-2 pr-2">
                  <input
                    type="number"
                    className={adminField}
                    value={row.minPerSqm}
                    onChange={(e) =>
                      setRow(row.id, { minPerSqm: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="p-2 pr-2">
                  <input
                    type="number"
                    className={adminField}
                    value={row.maxPerSqm}
                    onChange={(e) =>
                      setRow(row.id, { maxPerSqm: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="p-2 pr-2">
                  <input
                    className={adminField}
                    value={row.labelIt}
                    onChange={(e) => setRow(row.id, { labelIt: e.target.value })}
                  />
                </td>
                <td className="p-2 pr-2">
                  <textarea
                    className={`${adminField} min-h-[52px]`}
                    value={row.descriptionIt}
                    onChange={(e) =>
                      setRow(row.id, { descriptionIt: e.target.value })
                    }
                  />
                </td>
                <td className="p-2 pr-2">
                  <input
                    className={adminField}
                    value={row.labelEn}
                    onChange={(e) => setRow(row.id, { labelEn: e.target.value })}
                  />
                </td>
                <td className="p-2 pr-2">
                  <textarea
                    className={`${adminField} min-h-[52px]`}
                    value={row.descriptionEn}
                    onChange={(e) =>
                      setRow(row.id, { descriptionEn: e.target.value })
                    }
                  />
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="rounded-lg px-2 py-1 text-sm font-medium text-red-300 hover:bg-red-500/15 hover:underline"
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
