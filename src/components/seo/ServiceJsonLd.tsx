import { buildLocalBusinessAreaServed } from "@/lib/constants/service-area";
import { getSite, getSiteUrl } from "@/lib/data/site-store";

type Props = {
  /** The service as a visitor reads it — the page's own H1. */
  name: string;
  description: string;
  /** Locale-prefixed path of the page this service is offered on. */
  path: string;
  /** Coarse category, e.g. "Ristrutturazione bagno". */
  serviceType: string;
  /** Scope bullets, rendered as an offer catalogue. */
  offers?: string[];
};

/**
 * `Service` for the nine silo pages.
 *
 * They already emitted `LocalBusiness`, `FAQPage` and `BreadcrumbList` — everything
 * except the type that says *this page is a service, offered by that business, in this
 * area*. Without it the pages the whole search strategy points at had no structured
 * relationship to the company behind them.
 *
 * `provider` is a reference by `@id` rather than a second copy of the business: the
 * `LocalBusiness` node in the root layout is on every page, so repeating its fields here
 * would publish the same entity twice with two identities.
 */
export async function ServiceJsonLd({
  name,
  description,
  path,
  serviceType,
  offers,
}: Props) {
  const [site, baseUrl] = await Promise.all([getSite(), getSiteUrl()]);
  const origin = new URL(baseUrl).origin;
  const url = `${origin}${path === "/" ? "" : path}`;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url,
    provider: {
      "@id": `${origin}/#business`,
      "@type": ["HomeAndConstructionBusiness", "GeneralContractor"],
      name: site.brand,
      url: baseUrl,
      telephone: site.phoneTel,
    },
    areaServed: buildLocalBusinessAreaServed(),
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      availableLanguage: ["it", "en"],
    },
  };

  if (offers && offers.length > 0) {
    data.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name,
      itemListElement: offers.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
