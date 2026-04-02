import { getSiteUrl, site } from "@/lib/site";

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.brand,
    legalName: site.legalName,
    taxID: site.vatId,
    description:
      "Ristrutturazioni e lavori edili a Modena e provincia: preventivi chiari, cantieri organizzati e finiture di qualità.",
    url: getSiteUrl(),
    telephone: site.phoneTel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.province,
      addressCountry: "IT",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: site.serviceArea,
    },
    priceRange: "€€",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
