import { getSite } from "@/lib/data/site-store";
import { isUpstashRedisConfigured } from "@/lib/upstash-redis";
import { AdminCompanyEditor } from "../../AdminCompanyEditor";
import { AdminLogoutButton } from "../../AdminLogoutButton";
import { AdminSection } from "../../AdminSection";

export default async function AdminCompanyPage() {
  const site = await getSite();
  const redisOk = isUpstashRedisConfigured();

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Dati azienda</h1>
          <p className="mt-2 text-base text-zinc-400">
            Nome, indirizzo, telefono, email, testi legali e URL del sito.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminSection
        step={1}
        title="Modifica e salva"
        intro="Controlla i campi e premi Salva in alto o in basso quando hai finito."
      >
        <AdminCompanyEditor initialSite={site} redisOk={redisOk} />
      </AdminSection>
    </div>
  );
}
