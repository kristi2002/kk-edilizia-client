"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Project } from "@/lib/data/projects";

type Props = {
  initialProjects: Project[];
  redisOk: boolean;
  blobOk: boolean;
};

export function AdminPortfolioEditor({
  initialProjects,
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

  const selected = projects.find((p) => p.slug === slug) ?? projects[0];

  const save = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Errore ${res.status}`);
        return;
      }
      setMessage("Salvato. Le modifiche compaiono sul sito entro circa un minuto.");
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
        "Sovrascrivere i dati su Redis con una copia identica al codice (projects.ts)?",
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/projects/seed", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Errore ${res.status}`);
        return;
      }
      const refreshed = await fetch("/api/admin/projects");
      const next = (await refreshed.json()) as Project[];
      setProjects(next);
      setSlug(next[0]?.slug ?? "");
      setMessage("Dati sincronizzati dal codice.");
      router.refresh();
    } catch {
      setError("Rete non disponibile.");
    } finally {
      setBusy(false);
    }
  };

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!selected || list.length === 0) return;
      if (!blobOk) {
        setError("Upload non configurato (BLOB_READ_WRITE_TOKEN).");
        return;
      }
      setBusy(true);
      setError(null);
      try {
        for (const file of list) {
          const fd = new FormData();
          fd.set("file", file);
          fd.set("projectSlug", selected.slug);
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: fd,
          });
          const data = (await res.json().catch(() => ({}))) as {
            ok?: boolean;
            url?: string;
            error?: string;
          };
          if (!res.ok) {
            setError(data.error ?? `Upload fallito (${res.status})`);
            return;
          }
          if (data.url) {
            setProjects((prev) =>
              prev.map((p) =>
                p.slug === selected.slug
                  ? { ...p, gallery: [...p.gallery, data.url!] }
                  : p,
              ),
            );
          }
        }
        setMessage("Immagini caricate. Clicca «Salva sul sito» per pubblicarle.");
      } catch {
        setError("Rete non disponibile.");
      } finally {
        setBusy(false);
      }
    },
    [blobOk, selected],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    void uploadFiles(e.dataTransfer.files);
  };

  const removeGalleryUrl = (url: string) => {
    if (!selected) return;
    setProjects((prev) =>
      prev.map((p) => {
        if (p.slug !== selected.slug) return p;
        const nextGallery = p.gallery.filter((u) => u !== url);
        let nextCover = p.coverImage;
        if (p.coverImage === url) {
          nextCover = nextGallery[0] ?? p.coverImage;
        }
        return { ...p, gallery: nextGallery, coverImage: nextCover };
      }),
    );
  };

  const setCover = (url: string) => {
    if (!selected) return;
    setProjects((prev) =>
      prev.map((p) => (p.slug === selected.slug ? { ...p, coverImage: url } : p)),
    );
  };

  if (!selected) {
    return (
      <p className="text-sm text-zinc-500">Nessun progetto nel portfolio.</p>
    );
  }

  return (
    <div className="space-y-6">
      {!redisOk && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Redis non configurato: il sito usa solo i dati nel codice. Per salvare da
          qui serve Upstash (UPSTASH_REDIS_REST_URL / TOKEN) su Vercel.
        </p>
      )}
      {!blobOk && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Vercel Blob non configurato: puoi comunque salvare testi in Redis, ma non
          caricare file finché non aggiungi BLOB_READ_WRITE_TOKEN.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void seed()}
          disabled={busy || !redisOk}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/5 disabled:opacity-40"
        >
          Sincronizza da codice
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy || !redisOk}
          className="rounded-lg bg-[#c9a227] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition hover:bg-[#ddb92e] disabled:opacity-40"
        >
          {busy ? "Attendere…" : "Salva sul sito"}
        </button>
      </div>

      {message && (
        <p className="text-sm text-emerald-400/90">{message}</p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Progetto
        </label>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-2 w-full max-w-md rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2 text-sm text-white"
        >
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.title} ({p.slug})
            </option>
          ))}
        </select>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] px-6 py-10 text-center"
      >
        <p className="text-sm text-zinc-300">
          Trascina qui le foto oppure scegli dal computer
        </p>
        <label className="mt-4 inline-block cursor-pointer rounded-full border border-[#c9a227]/50 bg-[#c9a227]/15 px-5 py-2 text-sm font-semibold text-[#c9a227] transition hover:bg-[#c9a227]/25">
          Scegli file
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={busy || !blobOk}
            onChange={(e) => {
              if (e.target.files) void uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Copertina (anteprima liste e intestazione progetto)
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {Array.from(new Set([selected.coverImage, ...selected.gallery])).map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setCover(url)}
                className={`relative h-20 w-28 overflow-hidden rounded-lg border-2 ${
                  selected.coverImage === url
                    ? "border-[#c9a227]"
                    : "border-transparent"
                }`}
              >
                <Image src={url} alt="" fill className="object-cover" sizes="120px" />
              </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-zinc-600">
          Clicca un&apos;immagine per usarla come copertina.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Galleria ({selected.gallery.length})
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {selected.gallery.map((url) => (
            <li
              key={url}
              className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10"
            >
              <Image src={url} alt="" fill className="object-cover" sizes="200px" />
              <button
                type="button"
                onClick={() => removeGalleryUrl(url)}
                className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white"
              >
                Rimuovi
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
