/**
 * Public feature flags (NEXT_PUBLIC_* are inlined at build time).
 *
 * Cost estimate (/stima-costi): off by default so visitors contact you first.
 * Re-enable: set NEXT_PUBLIC_ENABLE_COST_ESTIMATE=true in .env / Vercel and redeploy.
 */
export function isCostEstimateEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_COST_ESTIMATE === "true";
}

/**
 * Portfolio (/portfolio, project detail, 360° tours): off until the company's own photos
 * replace the demonstration media.
 *
 * This used to be expressed as commented-out JSX in five files, which hid the links from
 * visitors but left the pages in the sitemap — so the only audience for them was
 * crawlers, and what they indexed was stock photography. With the flag off the routes
 * are dropped from the sitemap and serve `noindex`; with it on, every link returns.
 *
 * Re-enable: set NEXT_PUBLIC_ENABLE_PORTFOLIO=true in .env / Vercel and redeploy.
 */
export function isPortfolioEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_PORTFOLIO === "true";
}
