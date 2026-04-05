"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteData } from "@/lib/site";
import { siteValidationMessageItalian } from "@/lib/admin-site-validation";
import { AdminActionFailedError } from "@/lib/admin-api-error";
import { siteSchema } from "@/lib/validate-site-payload";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import {
  adminAlertErr,
  adminAlertOk,
  adminAlertWarn,
  adminBtnPrimary,
  adminBtnSecondary,
  adminHint,
  adminInput,
  adminLabel,
  adminSubCard,
  adminTextarea,
} from "./admin-ui";

type Props = {
  initialSite: SiteData;
  redisOk: boolean;
};

export function AdminCompanyEditor({ initialSite, redisOk }: Props) {
  const router = useRouter();
  const [site, setSite] = useState<SiteData>(() => structuredClone(initialSite));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);

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
    const parsed = siteSchema.safeParse(site);
    if (!parsed.success) {
      setError(siteValidationMessageItalian(parsed.error));
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/site", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok) {
        if (data.error === "invalid_payload") {
          setError(
            "Il server non ha accettato i dati. Controlla email e campi obbligatori.",
          );
        } else {
          setError(data.error ?? `Errore ${res.status}. Riprova tra poco.`);
        }
        return;
      }
      setMessage(
        "Salvato correttamente. Le modifiche sono già visibili sul sito (a volte serve aggiornare la pagina).",
      );
      router.refresh();
    } catch {
      setError("Connessione assente o server non raggiungibile. Riprova.");
    } finally {
      setBusy(false);
    }
  };

  const performSeed = async () => {
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
        throw new AdminActionFailedError();
      }
      const refreshed = await fetch("/api/admin/site", { credentials: "include" });
      const next = (await refreshed.json()) as SiteData;
      setSite(next);
      setMessage("Dati ripristinati ai valori di partenza.");
      router.refresh();
    } catch (e) {
      if (e instanceof AdminActionFailedError) throw e;
      setError("Connessione assente. Riprova.");
      throw new AdminActionFailedError();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-10">
      {!redisOk && (
        <div className={adminAlertWarn} role="alert">
          <strong className="text-amber-50">Salvataggio disattivato.</strong> Manca la
          connessione al database (Redis). Solo lo sviluppatore può configurare il file{" "}
          <code className="rounded bg-black/30 px-1">.env.local</code> e riavviare il
          server.
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !redisOk}
          className={adminBtnPrimary}
        >
          {busy ? "Salvataggio in corso…" : "Salva tutti i dati azienda"}
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
        title="Ripristinare i dati azienda?"
        description="Verranno annullate le modifiche non salvate in questa schermata e sostituiti i dati su Redis con i valori originali dal codice del sito. Dovrai reinserire a mano ciò che avevi personalizzato. Procedere?"
        confirmLabel="Sì, ripristina"
        onConfirm={performSeed}
      />
      <p className="text-sm text-zinc-500">
        Dopo ogni modifica premi <strong className="text-zinc-300">Salva</strong>. Il
        pulsante «Ripristina» serve solo in emergenza.
      </p>

      {message && (
        <div className={adminAlertOk} role="status">
          {message}
        </div>
      )}
      {error && (
        <div className={adminAlertErr} role="alert">
          {error}
        </div>
      )}

      <div className={adminSubCard}>
        <h3 className="text-lg font-semibold text-white">Sito web e nome</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Indirizzo del sito (con https://) e come vi chiamate sul sito.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className={adminLabel}>Indirizzo del sito (URL)</label>
            <input
              className={adminInput}
              value={site.canonicalUrl}
              onChange={set("canonicalUrl")}
              placeholder="https://www.tuodominio.it"
              autoComplete="off"
            />
            <p className={adminHint}>
              Se lo lasci vuoto, può essere usato l&apos;indirizzo impostato nelle
              impostazioni del server. Senza slash finale.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabel}>Nome commerciale (sul sito)</label>
              <input
                className={adminInput}
                value={site.brand}
                onChange={set("brand")}
                required
              />
            </div>
            <div>
              <label className={adminLabel}>
                Denominazione / intestazione completa
              </label>
              <input
                className={adminInput}
                value={site.legalName}
                onChange={set("legalName")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={adminSubCard}>
        <h3 className="text-lg font-semibold text-white">Dati fiscali</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Partita IVA, codice fiscale, REA e forma giuridica (come in visura).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className={adminLabel}>Partita IVA</label>
            <input className={adminInput} value={site.vatId} onChange={set("vatId")} />
          </div>
          <div>
            <label className={adminLabel}>Codice fiscale</label>
            <input
              className={adminInput}
              value={site.fiscalCode}
              onChange={set("fiscalCode")}
            />
          </div>
          <div>
            <label className={adminLabel}>REA</label>
            <input className={adminInput} value={site.rea} onChange={set("rea")} />
          </div>
          <div>
            <label className={adminLabel}>Forma giuridica</label>
            <input
              className={adminInput}
              value={site.legalForm}
              onChange={set("legalForm")}
              placeholder="es. Impresa individuale"
            />
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabel}>P.IVA intracomunitaria (opzionale)</label>
            <input
              className={adminInput}
              value={site.vatEu}
              onChange={set("vatEu")}
              placeholder="IT04117840365"
              autoComplete="off"
            />
          </div>
          <div>
            <label className={adminLabel}>Numero dipendenti (dati strutturati)</label>
            <input
              type="number"
              min={0}
              step={1}
              className={adminInput}
              value={site.numberOfEmployees}
              onChange={(e) => {
                const n = Number.parseInt(e.target.value, 10);
                setSite((s) => ({
                  ...s,
                  numberOfEmployees: Number.isFinite(n) ? Math.max(0, n) : 0,
                }));
              }}
            />
          </div>
        </div>
      </div>

      <div className={adminSubCard}>
        <h3 className="text-lg font-semibold text-white">Sede (via, CAP, città)</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Compare su contatti, footer e mappa. Controlla che sia esatta.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={adminLabel}>Via e numero civico</label>
            <input
              className={adminInput}
              value={site.address.street}
              onChange={setAddr("street")}
              placeholder="Via …, n."
            />
          </div>
          <div>
            <label className={adminLabel}>CAP</label>
            <input
              className={adminInput}
              value={site.address.postalCode}
              onChange={setAddr("postalCode")}
              inputMode="numeric"
            />
          </div>
          <div>
            <label className={adminLabel}>Città</label>
            <input
              className={adminInput}
              value={site.address.city}
              onChange={setAddr("city")}
            />
          </div>
          <div>
            <label className={adminLabel}>Provincia (sigla)</label>
            <input
              className={adminInput}
              value={site.address.province}
              onChange={setAddr("province")}
              placeholder="es. MO"
            />
          </div>
          <div>
            <label className={adminLabel}>Paese</label>
            <input
              className={adminInput}
              value={site.address.country}
              onChange={setAddr("country")}
            />
          </div>
        </div>
      </div>

      <div className={adminSubCard}>
        <h3 className="text-lg font-semibold text-white">Zona di lavoro</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabel}>Testo in italiano</label>
            <input
              className={adminInput}
              value={site.serviceArea}
              onChange={set("serviceArea")}
            />
          </div>
          <div>
            <label className={adminLabel}>Testo in inglese</label>
            <input
              className={adminInput}
              value={site.serviceAreaEn}
              onChange={set("serviceAreaEn")}
            />
          </div>
        </div>
      </div>

      <div className={adminSubCard}>
        <h3 className="text-lg font-semibold text-white">Email e telefono</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Email: quella che i clienti vedono. Per il telefono: una riga con spazi (come
          si legge) e una con prefisso per il tasto «chiama».
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabel}>Email</label>
            <input
              type="email"
              className={adminInput}
              value={site.email}
              onChange={set("email")}
              autoComplete="email"
            />
          </div>
          <div>
            <label className={adminLabel}>PEC</label>
            <input
              type="email"
              className={adminInput}
              value={site.pec}
              onChange={set("pec")}
            />
          </div>
          <div>
            <label className={adminLabel}>Telefono (come lo leggono)</label>
            <input
              className={adminInput}
              value={site.phoneDisplay}
              onChange={set("phoneDisplay")}
              inputMode="tel"
            />
          </div>
          <div>
            <label className={adminLabel}>Telefono per link (solo numeri +39…)</label>
            <input
              className={adminInput}
              value={site.phoneTel}
              onChange={set("phoneTel")}
              placeholder="+39…"
              inputMode="tel"
            />
          </div>
        </div>
      </div>

      <div className={adminSubCard}>
        <h3 className="text-lg font-semibold text-white">Privacy e recensioni</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className={adminLabel}>Nome responsabile privacy (testo legale)</label>
            <input
              className={adminInput}
              value={site.privacyContactName}
              onChange={set("privacyContactName")}
            />
          </div>
          <div>
            <label className={adminLabel}>Link pagina Google (opzionale)</label>
            <input
              className={adminInput}
              value={site.publicReviewUrl}
              onChange={set("publicReviewUrl")}
              placeholder="https://"
            />
          </div>
        </div>
      </div>

      <div className={adminSubCard}>
        <h3 className="text-lg font-semibold text-white">Testi lunghi (pagine legali)</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Assicurazione, sicurezza in cantiere, certificazioni. Puoi incollare testi già
          approvati dal commercialista.
        </p>
        <div className="mt-4 space-y-5">
          <div>
            <label className={adminLabel}>Assicurazione / responsabilità civile</label>
            <textarea
              className={adminTextarea}
              rows={5}
              value={site.insurance}
              onChange={set("insurance")}
            />
          </div>
          <div>
            <label className={adminLabel}>Conformità e sicurezza</label>
            <textarea
              className={adminTextarea}
              rows={5}
              value={site.compliance}
              onChange={set("compliance")}
            />
          </div>
          <div>
            <label className={adminLabel}>Certificazioni / SOA</label>
            <textarea
              className={adminTextarea}
              rows={5}
              value={site.certifications}
              onChange={set("certifications")}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-[#c9a227]/40 bg-[#c9a227]/15 p-6 sm:p-8">
        <p className="text-base leading-relaxed text-[#1a1508]">
          <strong>Hai finito le modifiche?</strong> Ricorda di premere il pulsante qui
          sotto per salvare tutto sul sito.
        </p>
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !redisOk}
          className={`${adminBtnPrimary} mt-5 w-full sm:w-auto`}
        >
          {busy ? "Salvataggio in corso…" : "Salva tutti i dati azienda"}
        </button>
      </div>
    </div>
  );
}
