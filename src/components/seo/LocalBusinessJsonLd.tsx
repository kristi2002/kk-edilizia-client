import { buildLocalBusinessAreaServed } from "@/lib/constants/service-area";
import { getSite, getSiteUrl } from "@/lib/data/site-store";

const DESCRIPTION_IT =
  "Impresa edile a Modena: ristrutturazioni per privati e aziende, cartongesso, tetti. Materiali professionali (Mapei, Kerakoll, sistemi Knauf o equivalenti). Provincia di Modena. Preventivo dopo sopralluogo.";

/** LocalBusiness / HomeAndConstructionBusiness per risultati locali e Knowledge Graph. */
export async function LocalBusinessJsonLd() {
  const [site, baseUrl] = await Promise.all([getSite(), getSiteUrl()]);
  const a = site.address;

  const sameAs = site.publicReviewUrl?.trim()
    ? [site.publicReviewUrl.trim()]
    : undefined;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.brand,
    legalName: site.legalName,
    taxID: site.vatId,
    vatID: site.vatEu.trim() || `IT${site.vatId}`,
    numberOfEmployees: site.numberOfEmployees,
    description: DESCRIPTION_IT,
    url: baseUrl,
    telephone: site.phoneTel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      postalCode: a.postalCode,
      addressLocality: a.city,
      addressRegion: a.province,
      addressCountry: "IT",
    },
    areaServed: buildLocalBusinessAreaServed(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.6471,
      longitude: 10.9252,
    },
    knowsAbout: [
      "Ristrutturazioni edilizie",
      "Cartongesso e controsoffitti",
      "Rifacimento tetti",
      "Servizi edili Modena",
      "Impresa edile provincia di Modena",
      "Materiali Mapei e Kerakoll",
      "Sistemi a secco Knauf",
      "Regolamento edilizio Comune di Modena",
    ],
    priceRange: "€€",
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
