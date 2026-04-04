import { faqByLocale } from "@/lib/data/faq";
import {
  getProjects,
  isProjectsRedisAvailable,
} from "@/lib/data/projects-store";
import { getSite } from "@/lib/data/site-store";
import { toEstimatorCategory } from "@/lib/data/cost-estimator";
import { getEstimatorRows } from "@/lib/data/estimator-store";
import { getProjectTypes } from "@/lib/data/project-types-store";
import { isUpstashRedisConfigured } from "@/lib/upstash-redis";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { AdminPortfolioEditor } from "./AdminPortfolioEditor";
import { AdminCompanyEditor } from "./AdminCompanyEditor";
import { AdminEstimatorEditor } from "./AdminEstimatorEditor";

export default async function AdminHomePage() {
  const [projects, site, estimatorRows, projectTypes] = await Promise.all([
    getProjects(),
    getSite(),
    getEstimatorRows(),
    getProjectTypes(),
  ]);
  const costIt = estimatorRows.map((r) => toEstimatorCategory("it", r));
  const redisOk = isUpstashRedisConfigured();
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
            Portfolio e dati azienda: modifiche salvate in Redis (Upstash). Dopo
            ogni cambio alle variabili in <code className="text-zinc-400">.env.local</code>, riavvia il dev server.
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
          Dati azienda & URL
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Valori predefiniti in{" "}
          <code className="text-zinc-300">src/lib/site.ts</code>. Usa «Ripristina
          da codice» per tornare a quel contenuto. L&apos;URL canonico può essere
          impostato qui oppure con{" "}
          <code className="text-zinc-300">NEXT_PUBLIC_SITE_URL</code> se lasci vuoto
          il campo nel modulo.
        </p>
        <div className="mt-6">
          <AdminCompanyEditor initialSite={site} redisOk={redisOk} />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Portfolio — tipi, progetti, prima/dopo, galleria, tour 360° (
          {projects.length} progetti)
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Dati di default nel codice:{" "}
          <code className="text-zinc-300">src/lib/data/projects.ts</code>. Tipi
          progetto in{" "}
          <code className="text-zinc-300">src/lib/data/project-types.ts</code>.
          Carica le panoramiche per progetto (o crea un progetto nuovo e poi
          assegna gli upload). Dopo «Sincronizza da codice» o un salvataggio, la
          copia attiva può stare in Redis.
        </p>
        <div className="mt-6">
          <AdminPortfolioEditor
            initialProjects={projects}
            initialProjectTypes={projectTypes}
            redisOk={isProjectsRedisAvailable()}
            blobOk={blobOk}
          />
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#c9a227]">
          Stima costi (fascie €/m²)
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Modifica fasce e testi IT/EN. Fallback in codice:{" "}
          <code className="text-zinc-300">src/lib/data/cost-estimator.ts</code>.
          Categorie attive: {costIt.map((c) => c.id).join(", ")}
        </p>
        <div className="mt-6">
          <AdminEstimatorEditor
            initialRows={estimatorRows}
            redisOk={redisOk}
          />
        </div>
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
          Anteprima (dati attivi)
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
