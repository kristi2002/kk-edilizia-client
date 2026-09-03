import type { HomeImage } from "@/lib/media/home-imagery";
import type { ServiceSiloKey } from "@/lib/service-silos";

/**
 * Photography for the nine service silos.
 *
 * Same licence and rules as `home-imagery.ts` and `about-imagery.ts` — Pexels (free
 * commercial use, no attribution), craft and materials rather than models, no
 * identifiable faces — but a third set, disjoint from both. A visitor who lands on
 * `/ristrutturazione-bagno` from search and then walks the site never meets the same
 * photograph twice; nothing here appears on `/` or `/chi-siamo`.
 *
 * Four frames per silo, and the crop of each is load-bearing:
 *
 * - `hero`   2:1  (2000x1000) — full-bleed behind the dark hero band.
 * - `aside`  4:5  (1000x1250) — the vertical that runs beside the opening copy.
 * - `a`, `b` 3:2  (1200x800)  — the gallery pair, shown at full strength with captions.
 *
 * Replacements must keep the ratio or the layout letterboxes. None of these are used as
 * a dimmed `.photo-card` ground, so none carries a `tone` correction — the hero dims
 * behind its own gradient scrim, which is tuned once for the whole set.
 *
 * `alt` is a key under the `ServiceMedia` namespace in `messages/*.json`, never literal
 * text: it is crawlable copy on the pages the entire search strategy points at.
 *
 * Regenerate the files with `node .services-media.mjs` (ids are listed there too).
 */
const dir = "/media/services";

/** The four roles every silo fills. */
export type ServiceImageRole = "hero" | "aside" | "a" | "b";

type ServiceImageSet = Record<ServiceImageRole, HomeImage>;

/** Builds the four entries for one silo from its file slug and alt-key prefix. */
function set(slug: string, key: string, ids: [number, number, number, number]): ServiceImageSet {
  return {
    hero: { src: `${dir}/${slug}-hero.jpg`, pexels: ids[0], alt: `${key}Hero` },
    aside: { src: `${dir}/${slug}-aside.jpg`, pexels: ids[1], alt: `${key}Aside` },
    a: { src: `${dir}/${slug}-a.jpg`, pexels: ids[2], alt: `${key}A` },
    b: { src: `${dir}/${slug}-b.jpg`, pexels: ids[3], alt: `${key}B` },
  };
}

export const SERVICE_IMAGERY: Record<ServiceSiloKey, ServiceImageSet> = {
  // Turnkey: a stripped flat, its structure, and the room handed back finished.
  chiaviInMano: set("chiavi-in-mano", "chiaviInMano", [36035073, 15798786, 4756489, 3958953]),
  bagno: set("bagno", "bagno", [7045908, 10827349, 19666087, 7018243]),
  cucina: set("cucina", "cucina", [37153451, 38311100, 20348123, 7601088]),
  elettrico: set("elettrico", "elettrico", [257736, 3615735, 5767595, 8488029]),
  idraulico: set("idraulico", "idraulico", [7937299, 9658236, 5691473, 14845870]),
  murarie: set("murarie", "murarie", [11746743, 13295698, 39325792, 32913797]),
  cartongessoIsolamento: set("cartongesso", "cartongesso", [6474313, 6124239, 11427092, 6473980]),
  pavimentiRivestimenti: set("pavimenti", "pavimenti", [3935327, 11126101, 11806482, 6175107]),
  // Roof and facade: the pitch, the ridge detail, new timber, a scaffolded elevation.
  tettoFacciate: set("tetto", "tetto", [19603110, 18349121, 8491084, 32652188]),
};
