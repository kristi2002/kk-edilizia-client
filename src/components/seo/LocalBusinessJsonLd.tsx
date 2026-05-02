import { buildLocalBusinessAreaServed } from "@/lib/constants/service-area";
import { getSite, getSiteUrl } from "@/lib/data/site-store";
import { localizedPath } from "@/lib/i18n-path";

const DESCRIPTION_IT =
  "Impresa edile e servizi edili a Modena (ditta di costruzioni / general contractor): ristrutturazioni chiavi in mano, impianti e finiture per privati e aziende in città e provincia. Materiali professionali (Kerakoll, Mapei, Knauf e equivalenti certificati). Preventivo gratuito e dettagliato dopo sopralluogo.";

/** LocalBusiness / HomeAndConstructionBusiness per risultati locali e Knowledge Graph. */
export async function LocalBusinessJsonLd() {
  const [site, baseUrl] = await Promise.all([getSite(), getSiteUrl()]);
  const origin = new URL(baseUrl).origin;
  const serviceChannel = (path: string) => ({
    "@type": "ServiceChannel",
    serviceUrl: `${origin}${localizedPath("it", path)}`,
    availableLanguage: ["it", "en"],
  });

  const sameAs = site.publicReviewUrl?.trim()
    ? [site.publicReviewUrl.trim()]
    : undefined;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["HomeAndConstructionBusiness", "GeneralContractor"],
    name: site.brand,
    legalName: site.legalName,
    taxID: site.vatId,
    vatID: site.vatEu.trim() || `IT${site.vatId}`,
    numberOfEmployees: site.numberOfEmployees,
    description: DESCRIPTION_IT,
    url: baseUrl,
    telephone: site.phoneTel,
    email: site.email,
    areaServed: buildLocalBusinessAreaServed(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.6471,
      longitude: 10.9252,
    },
    serviceType: [
      "Servizi edili Modena",
      "Impresa edile Modena e provincia",
      "Elettricista e impianti elettrici",
      "Idraulico e impianti idraulici",
      "Cartongesso pareti e controsoffitti",
      "Ristrutturazioni chiavi in mano",
      "Ristrutturazione bagno",
      "Ristrutturazione cucina",
      "Opere murarie",
      "Impianti elettrici",
      "Impianti idraulici",
      "Cartongesso e isolamento",
      "Posa pavimenti e rivestimenti",
      "Rifacimento tetto e facciate",
    ],
    availableChannel: [
      serviceChannel("/contatti"),
      serviceChannel("/preventivo"),
      serviceChannel("/prenota"),
      serviceChannel("/impresa-edile-modena"),
    ],
    knowsAbout: [
      "Ristrutturazioni Modena",
      "Lavori edili",
      "Elettricista",
      "Impianti elettrici",
      "Idraulico",
      "Impianti idraulici",
      "Cartongesso",
      "Isolamento acustico",
      "Posa piastrelle",
      "Mapei",
      "Kerakoll",
      "Knauf",
      "Isolamento termico",
    ],
    priceRange: "€€-€€€",
  };

  if (sameAs) {
    data.sameAs = sameAs;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
