import type { ProjectVirtualTour } from "@/lib/virtual-tour/project-virtual-tour";

export type Project = {
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  location: string;
  locationEn: string;
  year: string;
  excerpt: string;
  excerptEn: string;
  description: string;
  descriptionEn: string;
  coverImage: string;
  gallery: string[];
  /** Demo before/after (Unsplash) for compare slider */
  beforeAfter?: { before: string; after: string };
  /**
   * Optional Pannellum multi-scene tour. Panoramas under
   * `public/virtual-tour/projects/<slug>/` — swap files on deploy without code changes
   * if paths stay the same.
   */
  virtualTour?: ProjectVirtualTour;
};

export function getProjectLocalized(
  project: Project,
  locale: string,
): {
  title: string;
  category: string;
  location: string;
  excerpt: string;
  description: string;
} {
  if (locale === "en") {
    return {
      title: project.titleEn,
      category: project.categoryEn,
      location: project.locationEn,
      excerpt: project.excerptEn,
      description: project.descriptionEn,
    };
  }
  return {
    title: project.title,
    category: project.category,
    location: project.location,
    excerpt: project.excerpt,
    description: project.description,
  };
}

/** Portfolio default data. Runtime copy can live in Upstash (see `projects-store.ts`). */
export const staticProjects: Project[] = [
  {
    slug: "ristrutturazione-appartamento-isola",
    title: "Ristrutturazione residenziale — centro storico",
    titleEn: "Residential renovation — historic centre",
    category: "Ristrutturazioni",
    categoryEn: "Renovations",
    location: "Modena, centro",
    locationEn: "Modena, city centre",
    year: "2024",
    excerpt:
      "Completa riqualificazione di un trilocale: impianti, pavimenti e cucina su misura.",
    excerptEn:
      "Full refurbishment of a three-room flat: systems, flooring, and bespoke kitchen.",
    description:
      "Intervento chiavi in mano su circa 95 m². Abbiamo rifatto impianti elettrici e idraulici a norma, posato resina e parquet, progettato la cucina con penisola e curato l’illuminazione architettonica. Tempi rispettati in 14 settimane.",
    descriptionEn:
      "Turnkey work on approx. 95 m². We renewed electrical and plumbing to code, laid resin and parquet, designed the kitchen with peninsula, and refined architectural lighting. Delivered in 14 weeks on schedule.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    beforeAfter: {
      before:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      after:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
    },
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
    virtualTour: {
      firstSceneId: "livingRoom",
      scenes: [
        {
          id: "livingRoom",
          title: "Soggiorno",
          titleEn: "Living room",
          panorama:
            "/virtual-tour/projects/ristrutturazione-appartamento-isola/living-room.jpg",
          hotSpots: [
            {
              pitch: -8,
              yaw: 42,
              type: "scene" as const,
              text: "Vai alle scale",
              textEn: "Go to stairs",
              sceneId: "stairs",
            },
          ],
        },
        {
          id: "stairs",
          title: "Scale",
          titleEn: "Stairs",
          panorama:
            "/virtual-tour/projects/ristrutturazione-appartamento-isola/stairs.jpg",
          hotSpots: [
            {
              pitch: -5,
              yaw: -135,
              type: "scene" as const,
              text: "Torna al soggiorno",
              textEn: "Back to living room",
              sceneId: "livingRoom",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "facciata-condominio-bicocca",
    title: "Risanamento facciata condominiale",
    titleEn: "Condominium façade restoration",
    category: "Edilizia",
    categoryEn: "Construction",
    location: "Modena, periferia",
    locationEn: "Modena, outskirts",
    year: "2023",
    excerpt:
      "Consolidamento murature, cappotto e finiture per efficienza e durata nel tempo.",
    excerptEn:
      "Masonry consolidation, insulation, and finishes for efficiency and durability.",
    description:
      "Intervento su corpo scala con messa in sicurezza delle parti ammalorate, cappotto termico e tinteggiatura. Coordinamento con amministratore e condomini, cantieri organizzati per minimizzare disagio agli occupanti.",
    descriptionEn:
      "Work on stairwell core with repair of unsafe areas, thermal coat, and painting. Coordination with administrator and residents; site logistics to minimise disruption.",
    coverImage:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
    beforeAfter: {
      before:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
      after:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    },
    gallery: [
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80",
    ],
  },
  {
    slug: "bagno-e-sauna-privata",
    title: "Bagno wellness con sauna",
    titleEn: "Wellness bathroom with sauna",
    category: "Interni",
    categoryEn: "Interiors",
    location: "Castelfranco Emilia (MO)",
    locationEn: "Castelfranco Emilia (MO)",
    year: "2024",
    excerpt:
      "Bagno padronale con doccia walk-in, materiali naturali e sauna finlandese.",
    excerptEn:
      "Master bath with walk-in shower, natural materials, and Finnish sauna.",
    description:
      "Progetto su misura con impermeabilizzazione rinforzata, riscaldamento a pavimento e finiture in gres effetto pietra. Installazione sauna con gestione umidità e ventilazione meccanica dedicata.",
    descriptionEn:
      "Bespoke design with reinforced waterproofing, underfloor heating, and stone-effect porcelain. Sauna installation with humidity control and dedicated mechanical ventilation.",
    coverImage:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
      "https://images.unsplash.com/photo-1604709177225-fa5c4c8c8b0e?w=1200&q=80",
    ],
  },
  {
    slug: "open-space-ufficio",
    title: "Open space commerciale",
    titleEn: "Commercial open plan",
    category: "Commerciale",
    categoryEn: "Commercial",
    location: "Modena, Viali",
    locationEn: "Modena, boulevards",
    year: "2023",
    excerpt:
      "Fit-out per ufficio: controsoffitti, pavimenti tecnici e illuminazione smart.",
    excerptEn:
      "Office fit-out: suspended ceilings, raised floors, and smart lighting.",
    description:
      "Rifunzionalizzazione di 220 m² con partizioni mobili, cablaggio strutturato e impianto luci DALI. Consegna in fasi per continuità operativa del cliente.",
    descriptionEn:
      "220 m² refit with movable partitions, structured cabling, and DALI lighting. Phased handover for business continuity.",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=1200&q=80",
    ],
  },
];

/** @deprecated use getProjectBySlug from `@/lib/data/projects-store` (async) */
export function getProjectBySlugStatic(slug: string): Project | undefined {
  return staticProjects.find((p) => p.slug === slug);
}
