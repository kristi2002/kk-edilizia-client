"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Project } from "@/lib/data/projects";
import { createEmptyProject, DEMO_PANORAMA_URL } from "@/lib/data/projects";
import type { ProjectTypeDef } from "@/lib/data/project-types";
import type { ProjectVirtualTour } from "@/lib/virtual-tour/project-virtual-tour";
import {
  AdminActionFailedError,
  messageFromAdminPutFailure,
} from "@/lib/admin-api-error";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { adminField } from "./admin-ui";

function describeUploadError(
  status: number,
  body: { error?: string; hint?: string },
): string {
  if (status === 401) {
    return "Sessione non valida: vai su /admin/login e accedi di nuovo.";
  }
  if (status === 503 && body.error === "blob_not_configured") {
    return "Manca BLOB_READ_WRITE_TOKEN in .env.local.";
  }
  if (status === 415) {
    const base =
      body.error === "unsupported_type"
        ? "Formato file non accettato."
        : (body.error ?? "Upload rifiutato");
    return body.hint ? `${base} ${body.hint}` : base;
  }
  return body.error ?? `Upload fallito (${status})`;
}

type Props = {
  initialProjects: Project[];
  /** Tipi salvati altrove (pagina «Tipi di progetto»); usati per il menu categoria. */
  projectTypes: ProjectTypeDef[];
  redisOk: boolean;
  blobOk: boolean;
};

export function AdminPortfolioEditor({
  initialProjects,
  projectTypes,
  redisOk,
  blobOk,
}: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(() =>
    structuredClone(initialProjects),
  );
  const [slug, setSlug] = useState(initialProjects[0]?.slug ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const selected = projects.find((p) => p.slug === slug) ?? projects[0];

  const patchProject = (s: string, patch: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.slug === s ? { ...p, ...patch } : p)),
    );
  };

  const saveProjects = async () => {
    const slugs = new Set(projects.map((p) => p.slug));
    if (slugs.size !== projects.length) {
      setError("Ogni progetto deve avere uno slug univoco.");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
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
      setMessage("Portfolio salvato.");
      router.refresh();
    } catch {
      setError("Rete non disponibile.");
    } finally {
      setBusy(false);
    }
  };

  const performSeedProjects = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/projects/seed", { method: "POST", credentials: "include" });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok) {
        setError(messageFromAdminPutFailure(res.status, data));
        throw new AdminActionFailedError();
      }
      const refreshed = await fetch("/api/admin/projects", { credentials: "include" });
      const next = (await refreshed.json()) as Project[];
      setProjects(next);
      setSlug(next[0]?.slug ?? "");
      router.refresh();
    } catch (e) {
      if (e instanceof AdminActionFailedError) throw e;
      setError("Rete non disponibile.");
      throw new AdminActionFailedError();
    } finally {
      setBusy(false);
    }
  };

  const uploadToProject = useCallback(
    async (file: File, projectSlug: string, sceneId?: string) => {
      if (!blobOk) return null;
      const fd = new FormData();
      fd.set("file", file);
      fd.set("projectSlug", projectSlug);
      if (sceneId) fd.set("sceneId", sceneId);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        url?: string;
        error?: string;
        hint?: string;
      };
      if (!res.ok) {
        setError(describeUploadError(res.status, data));
        return null;
      }
      return data.url ?? null;
    },
    [blobOk],
  );

  const uploadGallery = async (files: FileList | File[]) => {
    if (!selected) return;
    const ps = selected.slug;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadToProject(file, ps);
        if (url) {
          setProjects((prev) =>
            prev.map((p) =>
              p.slug === ps ? { ...p, gallery: [...p.gallery, url!] } : p,
            ),
          );
        }
      }
      setMessage("Immagini aggiunte. Salva il portfolio per pubblicare.");
    } finally {
      setBusy(false);
    }
  };

  const applyCategoryId = (typeId: string) => {
    if (!selected) return;
    const pt = projectTypes.find((t) => t.id === typeId);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug !== selected.slug) return p;
        return {
          ...p,
          categoryId: typeId || undefined,
          category: pt?.labelIt ?? p.category,
          categoryEn: pt?.labelEn ?? p.categoryEn,
        };
      }),
    );
  };

  const newProject = () => {
    const raw = window.prompt(
      "Slug URL del nuovo progetto (solo lettere, numeri, trattini):",
      "nuovo-progetto",
    );
    if (!raw?.trim()) return;
    const np = createEmptyProject(raw.trim());
    if (projects.some((p) => p.slug === np.slug)) {
      setError("Slug già in uso.");
      return;
    }
    setProjects((p) => [...p, np]);
    setSlug(np.slug);
  };

  const performDeleteProject = () => {
    if (!selected || projects.length <= 1) {
      setError("Serve almeno un progetto.");
      throw new AdminActionFailedError();
    }
    const removed = selected.slug;
    const next = projects.filter((x) => x.slug !== removed);
    setProjects(next);
    if (slug === removed) setSlug(next[0]?.slug ?? "");
  };

  const addScene = () => {
    if (!selected) return;
    const id = window.prompt("Id scena (es. cucina):", `scena-${selected.virtualTour.scenes.length + 1}`);
    if (!id?.trim()) return;
    const sid = id.trim().replace(/[^a-zA-Z0-9_-]/g, "") || "scena";
    const vt: ProjectVirtualTour = {
      ...selected.virtualTour,
      scenes: [
        ...selected.virtualTour.scenes,
        {
          id: sid,
          title: "Nuova scena",
          titleEn: "New scene",
          panorama: DEMO_PANORAMA_URL,
        },
      ],
      firstSceneId: selected.virtualTour.firstSceneId ?? sid,
    };
    patchProject(selected.slug, { virtualTour: vt });
    setProjects((prev) =>
      prev.map((p) => (p.slug === selected.slug ? { ...p, virtualTour: vt } : p)),
    );
  };

  const removeScene = (sceneId: string) => {
    if (!selected || selected.virtualTour.scenes.length <= 1) {
      setError("Serve almeno una scena 360°.");
      return;
    }
    const scenes = selected.virtualTour.scenes.filter((s) => s.id !== sceneId);
    let first = selected.virtualTour.firstSceneId;
    if (first === sceneId) first = scenes[0]?.id;
    const vt: ProjectVirtualTour = { ...selected.virtualTour, scenes, firstSceneId: first };
    patchProject(selected.slug, { virtualTour: vt });
    setProjects((prev) =>
      prev.map((p) => (p.slug === selected.slug ? { ...p, virtualTour: vt } : p)),
    );
  };

  if (!selected) {
    return <p className="text-sm text-zinc-500">Nessun progetto.</p>;
  }

  return (
    <div className="space-y-10">
      <AdminConfirmDialog
        open={seedDialogOpen}
        onOpenChange={setSeedDialogOpen}
        title="Sincronizzare i progetti dal codice?"
        description="Tutti i progetti salvati su Redis saranno sostituiti con la copia definita in projects.ts. Le modifiche attuali andranno perse se non le hai esportate altrove. Procedere?"
        confirmLabel="Sì, sincronizza"
        onConfirm={performSeedProjects}
      />
      <AdminConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminare questo progetto?"
        description={
          selected
            ? `Il progetto «${selected.title}» (${selected.slug}) verrà rimosso dall’elenco in questa schermata. Ricorda di salvare il portfolio per pubblicare la modifica.`
            : ""
        }
        confirmLabel="Sì, elimina"
        onConfirm={performDeleteProject}
      />
      <p className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
        Le <strong className="text-zinc-200">categorie / tipi</strong> si modificano nella sezione
        dedicata del menu: <strong className="text-zinc-200">Tipi di progetto</strong>. Qui assegni
        solo il tipo a ogni lavoro.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSeedDialogOpen(true)}
          disabled={busy || !redisOk}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm disabled:opacity-40"
        >
          Sincronizza progetti da codice
        </button>
        <button
          type="button"
          onClick={() => void saveProjects()}
          disabled={busy || !redisOk}
          className="rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-semibold text-[#0a0a0a] disabled:opacity-40"
        >
          {busy ? "…" : "Salva portfolio"}
        </button>
        <button
          type="button"
          onClick={newProject}
          className="rounded-lg border border-emerald-500/40 px-4 py-2 text-sm text-emerald-300"
        >
          Nuovo progetto
        </button>
        <button
          type="button"
          onClick={() => {
            if (!selected || projects.length <= 1) {
              setError("Serve almeno un progetto.");
              return;
            }
            setDeleteDialogOpen(true);
          }}
          className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400"
        >
          Elimina progetto
        </button>
      </div>

      {message && <p className="text-sm text-emerald-400/90">{message}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div>
        <label className="text-xs font-semibold uppercase text-zinc-500">Progetto</label>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={`${adminField} mt-1 max-w-xl`}
        >
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title} ({p.slug})
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs text-zinc-500">
          Tipo (da elenco)
          <select
            className={adminField}
            value={selected.categoryId ?? ""}
            onChange={(e) => applyCategoryId(e.target.value)}
          >
            <option value="">— manuale sotto —</option>
            {projectTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.labelIt} / {t.labelEn}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-zinc-500">
          Slug (URL)
          <input
            className={adminField}
            value={selected.slug}
            onChange={(e) => {
              const ns = e.target.value;
              setProjects((prev) =>
                prev.map((p) => (p.slug === selected.slug ? { ...p, slug: ns } : p)),
              );
              setSlug(ns);
            }}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-xs text-zinc-500">
          Titolo IT
          <input
            className={adminField}
            placeholder="es. Ristrutturazione appartamento storico — Centro Modena"
            value={selected.title}
            onChange={(e) => patchProject(selected.slug, { title: e.target.value })}
          />
        </label>
        <label className="text-xs text-zinc-500">
          Titolo EN
          <input
            className={adminField}
            placeholder="e.g. Historic apartment renovation — Modena city centre"
            value={selected.titleEn}
            onChange={(e) => patchProject(selected.slug, { titleEn: e.target.value })}
          />
        </label>
        <label className="text-xs text-zinc-500">
          Categoria IT (testo)
          <input
            className={adminField}
            value={selected.category}
            onChange={(e) => patchProject(selected.slug, { category: e.target.value })}
          />
        </label>
        <label className="text-xs text-zinc-500">
          Categoria EN (testo)
          <input
            className={adminField}
            value={selected.categoryEn}
            onChange={(e) => patchProject(selected.slug, { categoryEn: e.target.value })}
          />
        </label>
        <label className="text-xs text-zinc-500">
          Luogo IT
          <input
            className={adminField}
            value={selected.location}
            onChange={(e) => patchProject(selected.slug, { location: e.target.value })}
          />
        </label>
        <label className="text-xs text-zinc-500">
          Luogo EN
          <input
            className={adminField}
            value={selected.locationEn}
            onChange={(e) => patchProject(selected.slug, { locationEn: e.target.value })}
          />
        </label>
        <label className="text-xs text-zinc-500">
          Anno
          <input
            className={adminField}
            value={selected.year}
            onChange={(e) => patchProject(selected.slug, { year: e.target.value })}
          />
        </label>
        <label className="text-xs text-zinc-500">
          Copertina (URL)
          <input
            className={adminField}
            value={selected.coverImage}
            onChange={(e) => patchProject(selected.slug, { coverImage: e.target.value })}
          />
        </label>
      </div>

      <label className="block text-xs text-zinc-500">
        Estratto IT
        <textarea
          className={`${adminField} min-h-[72px]`}
          value={selected.excerpt}
          onChange={(e) => patchProject(selected.slug, { excerpt: e.target.value })}
        />
      </label>
      <label className="block text-xs text-zinc-500">
        Estratto EN
        <textarea
          className={`${adminField} min-h-[72px]`}
          value={selected.excerptEn}
          onChange={(e) => patchProject(selected.slug, { excerptEn: e.target.value })}
        />
      </label>
      <label className="block text-xs text-zinc-500">
        Descrizione IT
        <textarea
          className={`${adminField} min-h-[100px]`}
          value={selected.description}
          onChange={(e) => patchProject(selected.slug, { description: e.target.value })}
        />
      </label>
      <label className="block text-xs text-zinc-500">
        Descrizione EN
        <textarea
          className={`${adminField} min-h-[100px]`}
          value={selected.descriptionEn}
          onChange={(e) => patchProject(selected.slug, { descriptionEn: e.target.value })}
        />
      </label>

      <section>
        <h3 className="text-xs font-semibold uppercase text-[#c9a227]">Prima / dopo</h3>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <label className="text-xs text-zinc-500">
            URL prima
            <input
              className={adminField}
              value={selected.beforeAfter.before}
              onChange={(e) =>
                patchProject(selected.slug, {
                  beforeAfter: { ...selected.beforeAfter, before: e.target.value },
                })
              }
            />
          </label>
          <label className="text-xs text-zinc-500">
            URL dopo
            <input
              className={adminField}
              value={selected.beforeAfter.after}
              onChange={(e) =>
                patchProject(selected.slug, {
                  beforeAfter: { ...selected.beforeAfter, after: e.target.value },
                })
              }
            />
          </label>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <label className="cursor-pointer rounded border border-[#c9a227]/40 px-3 py-1 text-xs text-[#c9a227]">
            Carica prima
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={busy || !blobOk}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                setBusy(true);
                const url = await uploadToProject(f, selected.slug);
                if (url)
                  patchProject(selected.slug, {
                    beforeAfter: { ...selected.beforeAfter, before: url },
                  });
                setBusy(false);
              }}
            />
          </label>
          <label className="cursor-pointer rounded border border-[#c9a227]/40 px-3 py-1 text-xs text-[#c9a227]">
            Carica dopo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={busy || !blobOk}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                setBusy(true);
                const url = await uploadToProject(f, selected.slug);
                if (url)
                  patchProject(selected.slug, {
                    beforeAfter: { ...selected.beforeAfter, after: url },
                  });
                setBusy(false);
              }}
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase text-[#c9a227]">Galleria</h3>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            void uploadGallery(e.dataTransfer.files);
          }}
          className="mt-2 rounded border border-dashed border-white/20 p-4 text-center text-sm text-zinc-400"
        >
          Trascina immagini o{" "}
          <label className="cursor-pointer text-[#c9a227]">
            scegli file
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={busy || !blobOk}
              onChange={(e) => {
                if (e.target.files) void uploadGallery(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {selected.gallery.map((u) => (
            <li key={u} className="relative aspect-[4/3] overflow-hidden rounded border border-white/10">
              <Image src={u} alt="" fill className="object-cover" sizes="200px" />
              <button
                type="button"
                onClick={() =>
                  patchProject(selected.slug, {
                    gallery: selected.gallery.filter((x) => x !== u),
                  })
                }
                className="absolute right-1 top-1 rounded bg-black/70 px-1 text-[10px] text-white"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase text-[#c9a227]">
          Tour 360° — panorami equirettangolari (2:1 consigliato)
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          Per ogni scena: id univoco nel progetto, titoli, URL panoramica (carica o incolla). Aggiungi
          scene per ambienti diversi; collega le foto al progetto selezionato sopra o crea un progetto
          nuovo prima di caricare.
        </p>
        <label className="mt-2 block text-xs text-zinc-500">
          Scena iniziale
          <select
            className={adminField}
            value={selected.virtualTour.firstSceneId ?? selected.virtualTour.scenes[0]?.id ?? ""}
            onChange={(e) =>
              patchProject(selected.slug, {
                virtualTour: {
                  ...selected.virtualTour,
                  firstSceneId: e.target.value,
                },
              })
            }
          >
            {selected.virtualTour.scenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-3 space-y-4">
          {selected.virtualTour.scenes.map((sc) => (
            <div
              key={sc.id}
              className="rounded border border-white/10 bg-white/[0.02] p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-zinc-300">Scena: {sc.id}</span>
                <button
                  type="button"
                  onClick={() => removeScene(sc.id)}
                  className="text-xs text-red-400"
                >
                  Rimuovi scena
                </button>
              </div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <p className="text-xs text-zinc-600 md:col-span-2">
                  Id scena: <code className="text-zinc-400">{sc.id}</code> (fisso — aggiungi una nuova scena per un nuovo id)
                </p>
                <input
                  className={adminField}
                  placeholder="Titolo IT"
                  value={sc.title}
                  onChange={(e) => {
                    const scenes = selected.virtualTour.scenes.map((x) =>
                      x.id === sc.id ? { ...x, title: e.target.value } : x,
                    );
                    patchProject(selected.slug, { virtualTour: { ...selected.virtualTour, scenes } });
                  }}
                />
                <input
                  className={adminField}
                  placeholder="Titolo EN"
                  value={sc.titleEn}
                  onChange={(e) => {
                    const scenes = selected.virtualTour.scenes.map((x) =>
                      x.id === sc.id ? { ...x, titleEn: e.target.value } : x,
                    );
                    patchProject(selected.slug, { virtualTour: { ...selected.virtualTour, scenes } });
                  }}
                />
                <input
                  className={`${adminField} md:col-span-2`}
                  placeholder="URL panoramica"
                  value={sc.panorama}
                  onChange={(e) => {
                    const scenes = selected.virtualTour.scenes.map((x) =>
                      x.id === sc.id ? { ...x, panorama: e.target.value } : x,
                    );
                    patchProject(selected.slug, { virtualTour: { ...selected.virtualTour, scenes } });
                  }}
                />
              </div>
              <label className="mt-2 inline-block cursor-pointer rounded border border-[#c9a227]/40 px-2 py-1 text-xs text-[#c9a227]">
                Carica panoramica (360)
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={busy || !blobOk}
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (!f) return;
                    setBusy(true);
                    const url = await uploadToProject(f, selected.slug, sc.id);
                    if (url) {
                      const scenes = selected.virtualTour.scenes.map((x) =>
                        x.id === sc.id ? { ...x, panorama: url } : x,
                      );
                      patchProject(selected.slug, {
                        virtualTour: { ...selected.virtualTour, scenes },
                      });
                    }
                    setBusy(false);
                  }}
                />
              </label>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addScene}
          className="mt-3 rounded border border-white/15 px-3 py-1 text-xs"
        >
          Aggiungi scena 360°
        </button>
      </section>

      <div className="rounded-xl border border-[#c9a227]/35 bg-[#c9a227]/10 px-4 py-4">
        <p className="text-sm text-zinc-200">
          <strong>Salva portfolio</strong> per pubblicare progetti, gallerie e tour sul sito.
        </p>
        <button
          type="button"
          onClick={() => void saveProjects()}
          disabled={busy || !redisOk}
          className="mt-3 rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-semibold text-[#0a0a0a] disabled:opacity-40"
        >
          Salva portfolio
        </button>
      </div>
    </div>
  );
}
