import { getPreventivoFormOptions } from "@/lib/data/preventivo-options-store";
import { isUpstashRedisConfigured } from "@/lib/upstash-redis";
import { AdminLogoutButton } from "../../AdminLogoutButton";
import { AdminPreventivoEditor } from "../../AdminPreventivoEditor";
import { AdminSection } from "../../AdminSection";

export default async function AdminPreventivoPage() {
  const options = await getPreventivoFormOptions();
  const redisOk = isUpstashRedisConfigured();

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Modulo preventivo</h1>
          <p className="mt-2 text-base text-zinc-400">
            Testi delle scelte (tipo di lavoro, budget, tempistiche) in italiano e inglese. I
            valori «id» sono quelli salvati con la richiesta e usati nelle email.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminSection
        step={4}
        accent="gold"
        title="Opzioni del modulo"
        intro="Modifica le righe e salva. Serve Redis sul server per pubblicare le modifiche."
      >
        <AdminPreventivoEditor initialOptions={options} redisOk={redisOk} />
      </AdminSection>
    </div>
  );
}
