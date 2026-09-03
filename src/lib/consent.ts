/**
 * Cookie consent, shared by the banner and the analytics loaders.
 *
 * Previously the banner wrote a value here and dispatched an event that nothing in the
 * codebase listened for, while GTM and GA4 loaded unconditionally from the root layout.
 * Choosing "solo necessari" had no effect. Analytics now mount only after an explicit
 * "all", and Consent Mode v2 defaults are denied before any tag can fire.
 */

export const CONSENT_STORAGE_KEY = "kk-edilizia-cookie-consent";
export const CONSENT_EVENT = "kk-cookie-consent";

export type ConsentChoice = "none" | "essential" | "all";

/** Consent Mode v2 signals we toggle. Functionality/security stay granted (strictly necessary). */
export const CONSENT_GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
} as const;

export function readConsent(): ConsentChoice {
  try {
    if (typeof window === "undefined") return "none";
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    /** "1" was written by an earlier version of the banner. */
    if (v === "all" || v === "1") return "all";
    if (v === "essential") return "essential";
    return "none";
  } catch {
    return "none";
  }
}

export function writeConsent(mode: Exclude<ConsentChoice, "none">): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, mode);
  } catch {
    /* private mode / storage disabled: the choice simply is not remembered */
  }
  if (mode === "all") pushConsentUpdate();
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Tell an already-loaded tag manager that consent was granted. */
export function pushConsentUpdate(): void {
  try {
    const w = window as typeof window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(["consent", "update", { ...CONSENT_GRANTED }]);
  } catch {
    /* ignore */
  }
}

/**
 * Inline script for the document head. Runs before any tag so the default state is
 * denied, then immediately re-grants for a visitor who already accepted.
 */
export const CONSENT_DEFAULTS_SNIPPET = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{
 ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',
 analytics_storage:'denied',functionality_storage:'granted',
 security_storage:'granted',wait_for_update:500});
try{var v=localStorage.getItem('${CONSENT_STORAGE_KEY}');
if(v==='all'||v==='1'){gtag('consent','update',${JSON.stringify(CONSENT_GRANTED)})}}catch(e){}
`.trim();
