import { getProjectTypes } from "@/lib/data/project-types-store";
import { isProjectsRedisAvailable } from "@/lib/data/projects-store";
import { AdminLogoutButton } from "../../AdminLogoutButton";
import { AdminProjectTypesEditor } from "../../AdminProjectTypesEditor";
import { AdminSection } from "../../AdminSection";

export default async function AdminProjectTypesPage() {
  const projectTypes = await getProjectTypes();

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Tipi di progetto</h1>
          <p className="mt-2 text-base text-zinc-400">
            Categorie usate nel portfolio (menu «Tipo» su ogni progetto). Modifica qui; poi assegna
            ogni lavoro dalla sezione Portfolio.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminSection
        step={2}
        accent="emerald"
        title="Categorie IT / EN"
        intro={`Tipi attuali: ${projectTypes.length}. Salva dopo ogni modifica.`}
      >
        <AdminProjectTypesEditor
          initialProjectTypes={projectTypes}
          redisOk={isProjectsRedisAvailable()}
        />
      </AdminSection>
    </div>
  );
}
