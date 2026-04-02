import { z } from "zod";

/** Honeypot: must be empty (bots often fill hidden fields). */
export const honeypotFieldSchema = z.string().max(0).optional();

export function httpUrlCount(s: string): number {
  return (s.match(/https?:\/\//gi) ?? []).length;
}
