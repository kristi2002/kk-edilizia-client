/** Fascia €/m² indicativa per mercato Modena/provincia (solo orientamento). */
export type EstimatorCategory = {
  id: string;
  label: string;
  description: string;
  minPerSqm: number;
  maxPerSqm: number;
};

const baseCategories: Omit<EstimatorCategory, "label" | "description">[] = [
  { id: "completa", minPerSqm: 750, maxPerSqm: 1250 },
  { id: "parziale", minPerSqm: 900, maxPerSqm: 1600 },
  { id: "impianti", minPerSqm: 120, maxPerSqm: 320 },
  { id: "facciata", minPerSqm: 140, maxPerSqm: 280 },
];

const labelsIt: Record<string, { label: string; description: string }> = {
  completa: {
    label: "Ristrutturazione completa",
    description: "Impianti, pavimenti, tinteggiatura, bagni e cucina",
  },
  parziale: {
    label: "Intervento parziale (bagno / cucina)",
    description: "Demolizioni, impianti bagni, finiture in zone limitate",
  },
  impianti: {
    label: "Solo impianti",
    description: "Elettrico e/o idraulico a norma",
  },
  facciata: {
    label: "Facciata / condominio",
    description: "Risanamento superfici murarie (stima su mq di facciata)",
  },
};

const labelsEn: Record<string, { label: string; description: string }> = {
  completa: {
    label: "Full renovation",
    description: "Systems, flooring, painting, bathrooms and kitchen",
  },
  parziale: {
    label: "Partial work (bath / kitchen)",
    description: "Demolition, wet-room systems, finishes in limited areas",
  },
  impianti: {
    label: "Systems only",
    description: "Electrical and/or plumbing to code",
  },
  facciata: {
    label: "Façade / condominium",
    description: "Masonry surfaces (estimate per m² of façade)",
  },
};

export function getEstimatorCategories(locale: string): EstimatorCategory[] {
  const map = locale === "en" ? labelsEn : labelsIt;
  return baseCategories.map((b) => ({
    ...b,
    ...map[b.id],
  }));
}

/** @deprecated use getEstimatorCategories */
export const estimatorCategories: EstimatorCategory[] = getEstimatorCategories("it");
