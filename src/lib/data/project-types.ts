export type ProjectTypeDef = {
  id: string;
  labelIt: string;
  labelEn: string;
};

/** Default taxonomy — override in Redis via admin. */
export const staticProjectTypes: ProjectTypeDef[] = [
  { id: "ristrutturazioni", labelIt: "Ristrutturazioni", labelEn: "Renovations" },
  { id: "edilizia", labelIt: "Edilizia", labelEn: "Construction" },
  { id: "interni", labelIt: "Interni", labelEn: "Interiors" },
  { id: "commerciale", labelIt: "Commerciale", labelEn: "Commercial" },
];
