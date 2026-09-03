import { describe, expect, it } from "vitest";
import {
  preventivoRequestSchema,
  preventivoSchema,
  step1Schema,
  step2Schema,
  step3Schema,
} from "@/lib/validations/preventivo";
import { httpUrlCount } from "@/lib/validations/spam";
import { stripHoneypot } from "@/lib/strip-honeypot";

const valid = {
  workType: "ristrutturazione-bagno",
  sqm: "12",
  budget: "10-20k",
  timeline: "1-3 mesi",
  name: "Mario Rossi",
  email: "mario@example.com",
  phone: "+39 333 1234567",
  notes: "Bagno da rifare completamente.",
};

describe("preventivo schema", () => {
  it("accepts a complete request", () => {
    expect(preventivoSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["workType", ""],
    ["budget", ""],
    ["timeline", ""],
    ["name", "M"],
    ["email", "not-an-email"],
    ["phone", "123"],
  ])("rejects a bad %s", (field, value) => {
    const r = preventivoSchema.safeParse({ ...valid, [field]: value });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === field)).toBe(true);
    }
  });

  it("treats sqm and notes as optional", () => {
    const rest = { ...valid };
    delete (rest as Partial<typeof valid>).sqm;
    delete (rest as Partial<typeof valid>).notes;
    expect(preventivoSchema.safeParse(rest).success).toBe(true);
  });

  it("caps notes so the mail body cannot be flooded", () => {
    const r = preventivoSchema.safeParse({ ...valid, notes: "x".repeat(4001) });
    expect(r.success).toBe(false);
  });

  it("only accepts known locales", () => {
    expect(preventivoSchema.safeParse({ ...valid, locale: "it" }).success).toBe(
      true,
    );
    expect(preventivoSchema.safeParse({ ...valid, locale: "de" }).success).toBe(
      false,
    );
  });
});

describe("honeypot", () => {
  it("accepts a submission that left the hidden field empty", () => {
    expect(
      preventivoRequestSchema.safeParse({ ...valid, _gotcha: "" }).success,
    ).toBe(true);
    expect(preventivoRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a submission that filled the hidden field", () => {
    const r = preventivoRequestSchema.safeParse({
      ...valid,
      _gotcha: "https://spam.example",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === "_gotcha")).toBe(true);
    }
  });

  it("removes the honeypot before the payload is used", () => {
    const cleaned = stripHoneypot({ ...valid, _gotcha: "" });
    expect(cleaned).not.toHaveProperty("_gotcha");
    expect(cleaned.email).toBe(valid.email);
  });
});

describe("httpUrlCount", () => {
  it.each([
    ["", 0],
    ["nessun link", 0],
    ["vedi http://a.example", 1],
    ["http://a.example e HTTPS://b.example", 2],
  ])("counts links in %j", (input, expected) => {
    expect(httpUrlCount(input)).toBe(expected);
  });
});

describe("wizard steps", () => {
  it("validates each step against only its own fields", () => {
    expect(step1Schema.safeParse({ workType: "bagno", sqm: "10" }).success).toBe(
      true,
    );
    expect(step1Schema.safeParse({ workType: "", sqm: "10" }).success).toBe(
      false,
    );
    expect(
      step2Schema.safeParse({ budget: "10-20k", timeline: "1-3 mesi" }).success,
    ).toBe(true);
    expect(
      step3Schema.safeParse({
        name: valid.name,
        email: valid.email,
        phone: valid.phone,
      }).success,
    ).toBe(true);
  });
});
