export type FaqItem = { q: string; a: string };

export const faqByLocale: Record<"it" | "en", FaqItem[]> = {
  it: [
    {
      q: "Quanto costa ristrutturare un appartamento a Modena nel 2026?",
      a: "Non esiste una cifra unica: dipende da metratura, stato dei locali, impianti e finiture. Come ordine di grandezza, molte ristrutturazioni complete si collocano in fasce di investimento per metro quadro che variano con il livello di finitura; il dato utile è un preventivo dopo sopralluogo, con voci separate e cronoprogramma.",
    },
    {
      q: "Quanto tempo serve per un preventivo dopo il sopralluogo?",
      a: "Di solito entro 3–5 giorni lavorativi dall’ispezione, con voci chiare su lavorazioni, materiali e tempi di cantiere indicativi.",
    },
    {
      q: "Fate lavori chiavi in mano?",
      a: "Sì: possiamo occuparci di progetto esecutivo, forniture, impianti e finiture con un unico referente e cronoprogramma condiviso.",
    },
    {
      q: "Come gestite polvere e rumore in condominio?",
      a: "Pianifichiamo gli accessi con il regolamento condominiale, usiamo protezioni e, quando serve, fasce orarie concordate con amministratore e vicini.",
    },
    {
      q: "È prevista garanzia sui lavori?",
      a: "Le lavorazioni sono conformi alle norme di legge; su impianti e materiali si applicano le garanzie dei produttori e quanto indicato in contratto.",
    },
    {
      q: "In quale zona operate?",
      a: "Operiamo principalmente a Modena e provincia; per progetti più lontani valutiamo caso per caso in base a tipologia e tempistiche.",
    },
  ],
  en: [
    {
      q: "How much does it cost to renovate an apartment in Modena in 2026?",
      a: "There is no single number: it depends on size, existing conditions, systems and finishes. As a rule of thumb, full renovations often fall into broad price bands per square metre that shift with specification; what matters is an itemised quote after a site visit, with a clear schedule.",
    },
    {
      q: "How long until a quote after the site visit?",
      a: "Usually within 3–5 business days after inspection, with clear line items, materials, and indicative site duration.",
    },
    {
      q: "Do you do turnkey work?",
      a: "Yes: we can handle executive design, supplies, systems, and finishes with one contact and a shared schedule.",
    },
    {
      q: "How do you manage dust and noise in condominiums?",
      a: "We align access with building rules, use protection, and when needed agree time windows with the administrator and neighbours.",
    },
    {
      q: "Is there a warranty on the work?",
      a: "Work complies with regulations; systems and materials follow manufacturer warranties and what is stated in the contract.",
    },
    {
      q: "Which area do you cover?",
      a: "We mainly work in Modena and province; for farther projects we assess case by case depending on scope and timing.",
    },
  ],
};
