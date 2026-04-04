"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteData } from "@/lib/site";

type Props = {
  initialSite: SiteData;
  redisOk: boolean;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-zinc-600";
const labelClass = "block text-xs font-semibold uppercase tracking-wider text-zinc-500";

export function AdminCompanyEditor({ initialSite, redisOk }: Props) {
  const router = useRouter();
  const [site, setSite] = useState<SiteData>(() => structuredClone(initialSite));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof SiteData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value;
      setSite((s) => ({ ...s, [key]: v }));
    };

  const setAddr =
    (key: keyof SiteData["address"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setSite((s) => ({
        ...s,
        address: { ...s.address, [key]: v },
      }));
    };

  const save = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(site),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? `Errore ${res.status}`);
        return;
      }
      setMessage("Salvato. Il sito userà questi dati entro circa un minuto.");
      router.refresh();
    } catch {
      setError("Rete non disponibile.");
    } finally {
      setBusy(false);
    }
  };

  const seed = async () => {
    if (
      !window.confirm(
        "Ripristinare i dati azienda dal codice (site.ts)? Le modifiche non salvate altrove andranno perse.",
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site/seed", {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? `Errore ${res.status}`);
        return;
      }
      const refreshed = await fetch("/api/admin/site", { credentials: "include" });
      const next = (await refreshed.json()) as SiteData;
      setSite(next);
      setMessage("Dati ripristinati dal codice.");
      router.refresh();
    } catch {
      setError("Rete non disponibile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      {!redisOk && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Redis non configurato: non puoi salvare da qui. Aggiungi Upstash in{" "}
          <code className="text-amber-100">.env.local</code> e riavvia il server.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void seed()}
          disabled={busy || !redisOk}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5 disabled:opacity-40"
        >
          Ripristina da codice
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !redisOk}
          className="rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e] disabled:opacity-40"
        >
          {busy ? "Attendere…" : "Salva dati azienda"}
        </button>
      </div>

      {message && (
        <p className="text-sm text-emerald-400/90">{message}</p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div>
        <label className={labelClass}>URL del sito (canonico)</label>
        <input
          className={inputClass}
          value={site.canonicalUrl}
          onChange={set("canonicalUrl")}
          placeholder="https://www.tuodominio.it (vuoto = usa NEXT_PUBLIC_SITE_URL)"
        />
        <p className="mt-1 text-xs text-zinc-600">
          Senza slash finale. Se lasci vuoto, vale la variabile{" "}
          <code className="text-zinc-500">NEXT_PUBLIC_SITE_URL</code>.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nome commerciale (brand)</label>
          <input className={inputClass} value={site.brand} onChange={set("brand")} />
        </div>
        <div>
          <label className={labelClass}>Ragione sociale</label>
          <input
            className={inputClass}
            value={site.legalName}
            onChange={set("legalName")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelClass}>P.IVA</label>
          <input className={inputClass} value={site.vatId} onChange={set("vatId")} />
        </div>
        <div>
          <label className={labelClass}>Codice fiscale</label>
          <input
            className={inputClass}
            value={site.fiscalCode}
            onChange={set("fiscalCode")}
          />
        </div>
        <div>
          <label className={labelClass}>REA</label>
          <input className={inputClass} value={site.rea} onChange={set("rea")} />
        </div>
        <div>
          <label className={labelClass}>Capitale sociale</label>
          <input
            className={inputClass}
            value={site.shareCapital}
            onChange={set("shareCapital")}
          />
        </div>
      </div>

      <div>
        <p className={labelClass}>Sede legale / operativa</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <input
            className={inputClass}
            value={site.address.street}
            onChange={setAddr("street")}
            placeholder="Via e numero"
          />
          <input
            className={inputClass}
            value={site.address.postalCode}
            onChange={setAddr("postalCode")}
            placeholder="CAP"
          />
          <input
            className={inputClass}
            value={site.address.city}
            onChange={setAddr("city")}
            placeholder="Città"
          />
          <input
            className={inputClass}
            value={site.address.province}
            onChange={setAddr("province")}
            placeholder="Provincia (es. MO)"
          />
          <input
            className={`${inputClass} sm:col-span-2`}
            value={site.address.country}
            onChange={setAddr("country")}
            placeholder="Paese"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Area operativa (IT)</label>
          <input
            className={inputClass}
            value={site.serviceArea}
            onChange={set("serviceArea")}
          />
        </div>
        <div>
          <label className={labelClass}>Area operativa (EN)</label>
          <input
            className={inputClass}
            value={site.serviceAreaEn}
            onChange={set("serviceAreaEn")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={inputClass}
            value={site.email}
            onChange={set("email")}
          />
        </div>
        <div>
          <label className={labelClass}>PEC</label>
          <input
            type="email"
            className={inputClass}
            value={site.pec}
            onChange={set("pec")}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Telefono (testo mostrato)</label>
          <input
            className={inputClass}
            value={site.phoneDisplay}
            onChange={set("phoneDisplay")}
          />
        </div>
        <div>
          <label className={labelClass}>Telefono (link tel:, +39…)</label>
          <input
            className={inputClass}
            value={site.phoneTel}
            onChange={set("phoneTel")}
            placeholder="+390200000000"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Nome responsabile privacy (testo legale)</label>
        <input
          className={inputClass}
          value={site.privacyContactName}
          onChange={set("privacyContactName")}
        />
      </div>

      <div>
        <label className={labelClass}>Link recensioni Google (opzionale)</label>
        <input
          className={inputClass}
          value={site.publicReviewUrl}
          onChange={set("publicReviewUrl")}
          placeholder="https://"
        />
      </div>

      <div>
        <label className={labelClass}>Assicurazione / RC (testo)</label>
        <textarea
          className={`${inputClass} min-h-[100px]`}
          rows={4}
          value={site.insurance}
          onChange={set("insurance")}
        />
      </div>
      <div>
        <label className={labelClass}>Conformità / sicurezza (testo)</label>
        <textarea
          className={`${inputClass} min-h-[100px]`}
          rows={4}
          value={site.compliance}
          onChange={set("compliance")}
        />
      </div>
      <div>
        <label className={labelClass}>Certificazioni / SOA (testo)</label>
        <textarea
          className={`${inputClass} min-h-[100px]`}
          rows={4}
          value={site.certifications}
          onChange={set("certifications")}
        />
      </div>

      <div className="rounded-xl border border-[#c9a227]/35 bg-[#c9a227]/10 px-4 py-4">
        <p className="text-sm text-zinc-200">
          Dopo le modifiche, clicca <strong>Salva dati azienda</strong> per
          memorizzarle su Redis.
        </p>
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !redisOk}
          className="mt-3 rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e] disabled:opacity-40"
        >
          {busy ? "Attendere…" : "Salva dati azienda"}
        </button>
      </div>
    </div>
  );
}
