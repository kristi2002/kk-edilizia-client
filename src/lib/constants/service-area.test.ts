import { describe, expect, it } from "vitest";
import {
  buildLocalBusinessAreaServed,
  shouldOfferModenaServiceLinks,
} from "./service-area";

describe("service-area", () => {
  it("buildLocalBusinessAreaServed ends with Provincia and includes Modena", () => {
    const list = buildLocalBusinessAreaServed();
    expect(list[0]).toEqual({ "@type": "City", name: "Modena" });
    expect(list[list.length - 1]).toEqual({
      "@type": "AdministrativeArea",
      name: "Provincia di Modena",
    });
  });

  it("shouldOfferModenaServiceLinks is true for province towns", () => {
    expect(shouldOfferModenaServiceLinks("Ristrutturazione a Sassuolo")).toBe(
      true,
    );
    expect(
      shouldOfferModenaServiceLinks("Appartamento — Pavullo nel Frignano"),
    ).toBe(true);
    expect(shouldOfferModenaServiceLinks("Cantiere a Pavullo")).toBe(true);
  });

  it("shouldOfferModenaServiceLinks is false for Modena-only wording", () => {
    expect(shouldOfferModenaServiceLinks("Centro Modena, via Emilia")).toBe(
      false,
    );
  });
});
