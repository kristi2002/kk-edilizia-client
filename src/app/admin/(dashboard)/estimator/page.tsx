import { toEstimatorCategory } from "@/lib/data/cost-estimator";
import { getEstimatorRows } from "@/lib/data/estimator-store";
import { isUpstashRedisConfigured } from "@/lib/upstash-redis";
import { AdminEstimatorEditor } from "../../AdminEstimatorEditor";
import { AdminLogoutButton } from "../../AdminLogoutButton";
import { AdminSection } from "../../AdminSection";

export default async function AdminEstimatorPage() {
  const estimatorRows = await getEstimatorRows();
  const costIt = estimatorRows.map((r) => toEstimatorCategory("it", r));
  const redisOk = isUpstashRedisConfigured();

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Stima costi</h1>
          <p className="mt-2 text-base text-zinc-400">
            Fasce di prezzo al m² e testi in italiano e inglese. Categorie:{" "}
            {costIt.map((c) => c.id).join(", ")}.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminSection
        step={4}
        accent="sky"
        title="Fasce e testi"
        intro="Modifica le righe e salva quando hai finito."
      >
        <AdminEstimatorEditor initialRows={estimatorRows} redisOk={redisOk} />
      </AdminSection>
    </div>
  );
}
