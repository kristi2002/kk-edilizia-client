/** Opzione radio del modulo preventivo (valore stabile + etichette). */
export type PreventivoFormOption = {
  value: string;
  labelIt: string;
  labelEn: string;
};

export type PreventivoFormOptions = {
  workTypes: PreventivoFormOption[];
  budgets: PreventivoFormOption[];
  timelines: PreventivoFormOption[];
};

/** Valori di default (codice) — usati se Redis è vuoto o al seed. */
export const defaultPreventivoFormOptions: PreventivoFormOptions = {
  workTypes: [
    {
      value: "ristrutturazione",
      labelIt: "Ristrutturazione completa",
      labelEn: "Full renovation",
    },
    {
      value: "bagno-cucina",
      labelIt: "Bagno / cucina",
      labelEn: "Bathroom / kitchen",
    },
    { value: "impianti", labelIt: "Impianti", labelEn: "Systems" },
    {
      value: "facciata",
      labelIt: "Facciata / condominio",
      labelEn: "Façade / condominium",
    },
    {
      value: "commerciale",
      labelIt: "Commerciale / ufficio",
      labelEn: "Commercial / office",
    },
    { value: "altro", labelIt: "Altro", labelEn: "Other" },
  ],
  budgets: [
    { value: "under-30", labelIt: "Fino a 30.000 €", labelEn: "Up to €30,000" },
    {
      value: "30-60",
      labelIt: "30.000 – 60.000 €",
      labelEn: "€30,000 – €60,000",
    },
    {
      value: "60-100",
      labelIt: "60.000 – 100.000 €",
      labelEn: "€60,000 – €100,000",
    },
    { value: "100+", labelIt: "Oltre 100.000 €", labelEn: "Over €100,000" },
    {
      value: "da-definire",
      labelIt: "Da definire in sede",
      labelEn: "To be defined on site",
    },
  ],
  timelines: [
    { value: "urgent", labelIt: "Entro 3 mesi", labelEn: "Within 3 months" },
    { value: "semester", labelIt: "3–6 mesi", labelEn: "3–6 months" },
    { value: "year", labelIt: "6–12 mesi", labelEn: "6–12 months" },
    { value: "flex", labelIt: "Flessibile", labelEn: "Flexible" },
  ],
};
