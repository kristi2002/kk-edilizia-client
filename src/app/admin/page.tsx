import { site } from "@/lib/site";
import { getEstimatorCategories } from "@/lib/data/cost-estimator";
import { faqByLocale } from "@/lib/data/faq";
import {
  getProjects,
  isProjectsRedisAvailable,
} from "@/lib/data/projects-store";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { AdminPortfolioEditor } from "./AdminPortfolioEditor";

export default async function AdminHomePage() {
  const costIt = getEstimatorCategories("it");
  const projects = await getProjects();
  const redisOk = isProjectsRedisAvailable();
  const blobOk = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  const configured = Boolean(
    process.env.ADMIN_PASSWORD?.trim() &&
      process.env.ADMIN_SESSION_SECRET?.trim(),
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-white">Pannello contenuti</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Portfolio: carica immagini e salva senza toccare il codice (serve Redis +
            Vercel Blob in produzione). Altri testi restano nei file elencati sotto.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {!configured && (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Variabili ADMIN_* mancanti: in produzione configura{" "}
          <code className="text-amber-100">ADMIN_PASSWORD</code> e{" "}
          <code className="text-amber-100">ADMIN_SESSION_SECRET</code> su Vercel.
        </p>
      )}

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Portfolio — foto e copertine ({projects.length} progetti)
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Dati di default nel codice:{" "}
          <code className="text-zinc-300">src/lib/data/projects.ts</code>. Dopo
          «Sincronizza da codice» o un salvataggio, la copia attiva può stare in Redis.
        </p>
        <div className="mt-6">
          <AdminPortfolioEditor
            initialProjects={projects}
            redisOk={redisOk}
            blobOk={blobOk}
          />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Dati azienda & URL
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-400">
          <li>
            <code className="text-zinc-300">src/lib/site.ts</code> — indirizzo,
            PIVA, telefono, email, testi legali brevi
          </li>
          <li>
            <code className="text-zinc-300">NEXT_PUBLIC_SITE_URL</code> — URL
            canonico (sitemap, Open Graph)
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Tour 360° (file sul sito)
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Configurazione in{" "}
          <code className="text-zinc-300">src/lib/data/projects.ts</code> (campo{" "}
          <code className="text-zinc-300">virtualTour</code>) e panorami in{" "}
          <code className="text-zinc-300">
            public/virtual-tour/projects/&lt;slug&gt;/
          </code>
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Stima costi (fascie €/m²)
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          <code className="text-zinc-300">src/lib/data/cost-estimator.ts</code>{" "}
          — categorie: {costIt.map((c) => c.id).join(", ")}
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          FAQ
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          <code className="text-zinc-300">src/lib/data/faq.ts</code> —{" "}
          {faqByLocale.it.length} voci IT / {faqByLocale.en.length} EN
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Testi UI (i18n)
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          <code className="text-zinc-300">messages/it.json</code> e{" "}
          <code className="text-zinc-300">messages/en.json</code>
        </p>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Anteprima brand (site.ts)
        </h2>
        <dl className="mt-3 grid gap-2 text-sm text-zinc-400">
          <div>
            <dt className="text-zinc-600">brand</dt>
            <dd className="text-zinc-300">{site.brand}</dd>
          </div>
          <div>
            <dt className="text-zinc-600">email</dt>
            <dd className="text-zinc-300">{site.email}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
