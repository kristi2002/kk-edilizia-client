/**
 * Configurazione multi-scena Pannellum (self-hosted, nessuna API a pagamento).
 *
 * Come aggiornare pitch / yaw con foto 360 reali (es. da iPhone):
 * -----------------------------------------------------------------
 * 1. Sostituisci i file in `public/virtual-tour/panoramas/` con le tue
 *    immagini equirettangolari (rapporto 2:1, es. 8192×4096).
 * 2. Apri il tour nel browser, attiva la modalità sviluppatore di Pannellum
 *    oppure aggiungi temporaneamente `"hotSpotDebug": true` nella scena per
 *    vedere coordinate al click (vedi documentazione Pannellum).
 * 3. Per ogni hotspot, `pitch` è l’inclinazione verticale in gradi (su/giù),
 *    `yaw` è la rotazione orizzontale (sinistra/destra, 0° = centro frontale
 *    dipende dalla proiezione della foto).
 * 4. Posiziona l’hotspot dove vuoi il clic (es. verso le scale), poi copia
 *    pitch/yaw dalla UI o dagli eventi del viewer.
 * 5. Rimuovi il debug prima della pubblicazione.
 *
 * Riferimento ufficiale parametri JSON:
 * https://github.com/mpetroff/pannellum/blob/master/doc/json-config-parameters.md
 */

/** Percorsi pubblici (serviti da Next da /virtual-tour/...) */
export const PANORAMA_PATHS = {
  livingRoom: "/virtual-tour/panoramas/living-room.jpg",
  stairs: "/virtual-tour/panoramas/stairs.jpg",
} as const;

/**
 * Config passata a `pannellum.viewer('panorama', config)`.
 * Le chiavi sotto `scenes` sono gli ID usati per `sceneId` negli hotspot.
 */
export function getPannellumMultiSceneConfig() {
  return {
    default: {
      firstScene: "livingRoom",
      sceneFadeDuration: 1000,
    },
    scenes: {
      livingRoom: {
        title: "Soggiorno",
        hfov: 110,
        pitch: 0,
        yaw: 0,
        type: "equirectangular",
        panorama: PANORAMA_PATHS.livingRoom,
        hotSpots: [
          {
            /** Pitch: prova valori tra -90 e 90 finché l’icona è all’altezza giusta. */
            pitch: -8,
            /** Yaw: ruota dove guarda la camera; allinea con le scale nella foto. */
            yaw: 42,
            type: "scene" as const,
            text: "Vai alle scale",
            sceneId: "stairs",
          },
        ],
      },
      stairs: {
        title: "Scale",
        hfov: 110,
        pitch: 0,
        yaw: 0,
        type: "equirectangular",
        panorama: PANORAMA_PATHS.stairs,
        hotSpots: [
          {
            pitch: -5,
            yaw: -135,
            type: "scene" as const,
            text: "Torna al soggiorno",
            sceneId: "livingRoom",
          },
        ],
      },
    },
  };
}
