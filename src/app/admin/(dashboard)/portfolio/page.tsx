import {
  getProjects,
  isProjectsRedisAvailable,
} from "@/lib/data/projects-store";
import { getProjectTypes } from "@/lib/data/project-types-store";
import { AdminLogoutButton } from "../../AdminLogoutButton";
import { AdminPortfolioEditor } from "../../AdminPortfolioEditor";
import { AdminSection } from "../../AdminSection";

export default async function AdminPortfolioPage() {
  const [projects, projectTypes] = await Promise.all([
    getProjects(),
    getProjectTypes(),
  ]);
  const blobOk = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-white sm:text-3xl">Portfolio</h1>
          <p className="mt-2 text-base text-zinc-400">
            Progetti attivi: {projects.length}. Tipi di categoria: menu{" "}
            <span className="text-[#c9a227]">Tipi di progetto</span>. Qui: foto, testi e tour 360°.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <AdminSection
        step={3}
        accent="emerald"
        title="Lavori, foto, tour"
        intro="Salva spesso mentre lavori. Le modifiche sono visibili sul sito dopo il salvataggio."
      >
        <AdminPortfolioEditor
          initialProjects={projects}
          projectTypes={projectTypes}
          redisOk={isProjectsRedisAvailable()}
          blobOk={blobOk}
        />
      </AdminSection>
    </div>
  );
}
