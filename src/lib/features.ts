/**
 * Public feature flags (NEXT_PUBLIC_* are inlined at build time).
 *
 * Cost estimate (/stima-costi): off by default so visitors contact you first.
 * Re-enable: set NEXT_PUBLIC_ENABLE_COST_ESTIMATE=true in .env / Vercel and redeploy.
 */
export function isCostEstimateEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_COST_ESTIMATE === "true";
}
