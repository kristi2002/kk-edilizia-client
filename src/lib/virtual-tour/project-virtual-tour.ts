/**
 * Per-project 360° tours (Pannellum).
 *
 * Put equirectangular images under:
 *   public/virtual-tour/projects/<project-slug>/*.jpg
 *
 * Update `virtualTour` on each `Project` in `src/lib/data/projects.ts`.
 * Hotspot pitch/yaw: see Pannellum JSON docs or tune in-browser with hotSpotDebug.
 */

export type VirtualTourHotSpotScene = {
  pitch: number;
  yaw: number;
  type: "scene";
  text: string;
  textEn: string;
  sceneId: string;
};

export type VirtualTourSceneDef = {
  id: string;
  title: string;
  titleEn: string;
  /** Public URL path (e.g. /virtual-tour/projects/my-slug/room.jpg) */
  panorama: string;
  hotSpots?: VirtualTourHotSpotScene[];
};

export type ProjectVirtualTour = {
  scenes: VirtualTourSceneDef[];
  /** Defaults to first scene in `scenes`. */
  firstSceneId?: string;
  sceneFadeMs?: number;
};

/** No UI or sitemap entry until at least one panorama scene is configured. */
export function projectHasVirtualTour(vt: ProjectVirtualTour): boolean {
  return vt.scenes.length > 0;
}

/**
 * Builds the JSON object passed to `pannellum.viewer(container, config)`.
 */
export function buildPannellumConfigFromProjectVirtualTour(
  vt: ProjectVirtualTour,
  locale: string,
): Record<string, unknown> {
  const en = locale === "en";
  const firstId = vt.firstSceneId ?? vt.scenes[0]?.id;
  if (!firstId || vt.scenes.length === 0) {
    throw new Error("ProjectVirtualTour: missing scenes or firstSceneId");
  }

  const scenes: Record<string, unknown> = {};

  for (const s of vt.scenes) {
    const title = en ? s.titleEn : s.title;
    const hotSpots = (s.hotSpots ?? []).map((h) => ({
      pitch: h.pitch,
      yaw: h.yaw,
      type: h.type,
      text: en ? h.textEn : h.text,
      sceneId: h.sceneId,
    }));

    scenes[s.id] = {
      title,
      hfov: 110,
      pitch: 0,
      yaw: 0,
      type: "equirectangular",
      panorama: s.panorama,
      ...(hotSpots.length ? { hotSpots } : {}),
    };
  }

  return {
    default: {
      firstScene: firstId,
      sceneFadeDuration: vt.sceneFadeMs ?? 1000,
    },
    scenes,
  };
}
