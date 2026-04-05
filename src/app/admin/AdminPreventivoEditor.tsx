"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  PreventivoFormOption,
  PreventivoFormOptions,
} from "@/lib/data/preventivo-form-options";
import {
  AdminActionFailedError,
  messageFromAdminPutFailure,
} from "@/lib/admin-api-error";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import {
  adminAlertWarn,
  adminBtnPrimary,
  adminBtnSecondary,
  adminField,
} from "./admin-ui";

type Props = {
  initialOptions: PreventivoFormOptions;
  redisOk: boolean;
};

function cloneOptions(o: PreventivoFormOptions): PreventivoFormOptions {
  return structuredClone(o);
}

function newOption(prefix: string): PreventivoFormOption {
  return {
    value: `${prefix}-${Date.now()}`,
    labelIt: "Nuova voce",
    labelEn: "New option",
  };
}

export function AdminPreventivoEditor({ initialOptions, redisOk }: Props) {
  const router = useRouter();
  const [options, setOptions] = useState<PreventivoFormOptions>(() =>
    cloneOptions(initialOptions),
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);

  const save = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/preventivo-options", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
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
      setMessage("Modulo preventivo salvato.");
      router.refresh();
    } catch {
      setError("Rete non disponibile.");
    } finally {
      setBusy(false);
    }
  };

  const performSeed = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/preventivo-options/seed", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        setError(messageFromAdminPutFailure(res.status, data));
        throw new AdminActionFailedError();
      }
      const refreshed = await fetch("/api/admin/preventivo-options", {
        credentials: "include",
      });
      setOptions(cloneOptions((await refreshed.json()) as PreventivoFormOptions));
      setMessage("Ripristinato dal codice.");
      router.refresh();
    } catch (e) {
      if (e instanceof AdminActionFailedError) throw e;
      setError("Rete non disponibile.");
      throw new AdminActionFailedError();
    } finally {
      setBusy(false);
    }
  };

  const patchList = (
    key: keyof PreventivoFormOptions,
    list: PreventivoFormOption[],
  ) => {
    setOptions((o) => ({ ...o, [key]: list }));
  };

  const setRow = (
    key: keyof PreventivoFormOptions,
    index: number,
    patch: Partial<PreventivoFormOption>,
  ) => {
    setOptions((o) => {
      const list = [...o[key]];
      const cur = list[index];
      if (!cur) return o;
      list[index] = { ...cur, ...patch };
      return { ...o, [key]: list };
    });
  };

  const removeRow = (key: keyof PreventivoFormOptions, index: number) => {
    setOptions((o) => ({
      ...o,
      [key]: o[key].filter((_, i) => i !== index),
    }));
  };

  const OptionTable = ({
    title,
    hint,
    optKey,
    addPrefix,
  }: {
    title: string;
    hint: string;
    optKey: keyof PreventivoFormOptions;
    addPrefix: string;
  }) => (
    <section className="space-y-3">
      <div>
        <h3 className="font-serif text-lg text-white">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{hint}</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-zinc-400">
              <th className="px-3 py-3 font-semibold">Valore (id)</th>
              <th className="py-3 pr-2 font-semibold">Testo IT</th>
              <th className="py-3 pr-2 font-semibold">Testo EN</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {options[optKey].map((row, i) => (
              <tr key={`${optKey}-${i}-${row.value}`} className="border-b border-white/5 align-top">
                <td className="p-2 pr-2">
                  <input
                    className={adminField}
                    value={row.value}
                    onChange={(e) => setRow(optKey, i, { value: e.target.value.trim() })}
                  />
                </td>
                <td className="p-2 pr-2">
                  <input
                    className={adminField}
                    value={row.labelIt}
                    onChange={(e) => setRow(optKey, i, { labelIt: e.target.value })}
                  />
                </td>
                <td className="p-2 pr-2">
                  <input
                    className={adminField}
                    value={row.labelEn}
                    onChange={(e) => setRow(optKey, i, { labelEn: e.target.value })}
                  />
                </td>
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => removeRow(optKey, i)}
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
      <button
        type="button"
        onClick={() =>
          patchList(optKey, [...options[optKey], newOption(addPrefix)])
        }
        disabled={busy}
        className={adminBtnSecondary}
      >
        Aggiungi voce — {title}
      </button>
    </section>
  );

  return (
    <div className="space-y-10">
      {!redisOk && (
        <div className={adminAlertWarn} role="alert">
          Salvataggio disattivato: manca Redis sul server. I visitatori vedono comunque i
          valori predefiniti dal codice.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !redisOk}
          className={adminBtnPrimary}
        >
          {busy ? "Salvataggio…" : "Salva modulo preventivo"}
        </button>
        <button
          type="button"
          onClick={() => setSeedDialogOpen(true)}
          disabled={busy || !redisOk}
          className={adminBtnSecondary}
        >
          Ripristina valori originali
        </button>
      </div>

      <AdminConfirmDialog
        open={seedDialogOpen}
        onOpenChange={setSeedDialogOpen}
        title="Ripristinare il modulo preventivo?"
        description="Tipi di lavoro, budget e tempistiche salvati su Redis saranno sostituiti con i valori predefiniti dal codice. Confermi?"
        confirmLabel="Sì, ripristina"
        onConfirm={performSeed}
      />

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

      <OptionTable
        title="Tipo di intervento"
        hint="Valori inviati al server (es. ristrutturazione). Se cambi l’id, aggiorna anche i link o le statistiche."
        optKey="workTypes"
        addPrefix="tipo"
      />
      <OptionTable
        title="Fasce di budget"
        hint="Valori come under-30, 30-60, …"
        optKey="budgets"
        addPrefix="budget"
      />
      <OptionTable
        title="Tempistiche"
        hint="Valori come urgent, semester, …"
        optKey="timelines"
        addPrefix="tempo"
      />
    </div>
  );
}
