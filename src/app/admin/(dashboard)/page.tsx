import { headers } from "next/headers";
import { faqByLocale } from "@/lib/data/faq";
import { getPortfolioDataSource } from "@/lib/data/projects-store";
import { getSite, getSiteUrl } from "@/lib/data/site-store";
import { PLACEHOLDER_PUBLIC_SITE_URL } from "@/lib/site";
import { inferPublicOriginFromHeaders } from "@/lib/request-origin";
import { isUpstashRedisConfigured } from "@/lib/upstash-redis";
import { AdminEnvironmentBar } from "../AdminEnvironmentBar";
import { AdminLogoutButton } from "../AdminLogoutButton";
import { adminAlertWarn } from "../admin-ui";

export default async function AdminDashboardPage() {
  const [configuredUrl, portfolioSource, site] = await Promise.all([
    getSiteUrl(),
    getPortfolioDataSource(),
    getSite(),
  ]);
  const requestOrigin = inferPublicOriginFromHeaders(await headers());
  const siteUrl =
    configuredUrl === PLACEHOLDER_PUBLIC_SITE_URL && requestOrigin
      ? requestOrigin
      : configuredUrl;
  const redisOk = isUpstashRedisConfigured();
  const blobOk = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  const configured = Boolean(
    process.env.ADMIN_PASSWORD?.trim() &&
      process.env.ADMIN_SESSION_SECRET?.trim(),
  );

  return (
    <div className="space-y-10 pb-8">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Panoramica</h1>
          <p className="mt-2 max-w-2xl text-base text-zinc-400">
            Usa il menu a sinistra per aprire una sezione. Salva spesso: ogni area ha il
            proprio pulsante di salvataggio.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            Le modifiche compaiono sul sito dopo il salvataggio (a volte serve aggiornare con
            F5).
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      {!configured && (
        <div className={adminAlertWarn} role="alert">
          <strong className="text-amber-50">Accesso admin non configurato sul server.</strong>{" "}
          Chi gestisce il sito deve impostare le variabili su Vercel (password e chiave di
          sessione).
        </div>
      )}

      <AdminEnvironmentBar
        siteUrl={siteUrl}
        redisOk={redisOk}
        blobOk={blobOk}
        portfolioSource={portfolioSource}
      />

      <section className="rounded-2xl border-2 border-white/10 bg-[#121212] p-6 sm:p-8">
        <h2 className="font-serif text-xl text-white sm:text-2xl">Anteprima rapida</h2>
        <p className="mt-2 text-base text-zinc-500">
          Dati attualmente salvati (nome e email):
        </p>
        <dl className="mt-6 grid gap-4 text-base sm:grid-cols-2">
          <div className="rounded-lg bg-white/[0.04] px-4 py-3">
            <dt className="text-sm font-medium text-[#c9a227]">Nome sul sito</dt>
            <dd className="mt-1 text-lg text-white">{site.brand}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.04] px-4 py-3">
            <dt className="text-sm font-medium text-[#c9a227]">Email contatti</dt>
            <dd className="mt-1 text-lg text-white break-all">{site.email}</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm text-zinc-500">
          FAQ in progetto: {faqByLocale.it.length} voci IT, {faqByLocale.en.length} EN — vedi
          sezione &quot;Info &amp; FAQ&quot;.
        </p>
      </section>
    </div>
  );
}
