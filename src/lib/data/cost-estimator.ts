/**
 * Fascia €/m² indicativa per mercato Modena/provincia (solo orientamento).
 * Aggiorna min/max quando i preventivi reali si spostano (materiali, manodopera, stagione).
 */
export type EstimatorCategory = {
  id: string;
  label: string;
  description: string;
  minPerSqm: number;
  maxPerSqm: number;
};

/** Riga completa in Redis (IT + EN). */
export type EstimatorCategoryRow = {
  id: string;
  minPerSqm: number;
  maxPerSqm: number;
  labelIt: string;
  descriptionIt: string;
  labelEn: string;
  descriptionEn: string;
};

const baseCategories: Omit<EstimatorCategoryRow, "labelIt" | "descriptionIt" | "labelEn" | "descriptionEn">[] =
  [
    { id: "completa", minPerSqm: 800, maxPerSqm: 1300 },
    { id: "parziale", minPerSqm: 950, maxPerSqm: 1650 },
    { id: "impianti", minPerSqm: 130, maxPerSqm: 340 },
    { id: "facciata", minPerSqm: 150, maxPerSqm: 290 },
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

export function toEstimatorCategory(
  locale: string,
  row: EstimatorCategoryRow,
): EstimatorCategory {
  const en = locale === "en";
  return {
    id: row.id,
    minPerSqm: row.minPerSqm,
    maxPerSqm: row.maxPerSqm,
    label: en ? row.labelEn : row.labelIt,
    description: en ? row.descriptionEn : row.descriptionIt,
  };
}

/** Dati di default dal codice (seed Redis / fallback). */
export function getStaticEstimatorRows(): EstimatorCategoryRow[] {
  return baseCategories.map((b) => {
    const it = labelsIt[b.id]!;
    const en = labelsEn[b.id]!;
    return {
      ...b,
      labelIt: it.label,
      descriptionIt: it.description,
      labelEn: en.label,
      descriptionEn: en.description,
    };
  });
}

export function getEstimatorCategoriesSync(locale: string): EstimatorCategory[] {
  return getStaticEstimatorRows().map((r) => toEstimatorCategory(locale, r));
}

/** @deprecated use getEstimatorCategories da estimator-store */
export const estimatorCategories: EstimatorCategory[] =
  getEstimatorCategoriesSync("it");
