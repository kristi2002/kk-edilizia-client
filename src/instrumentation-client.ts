// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

/**
 * Error reporting is strictly necessary — it is how a broken form gets noticed — so it
 * initialises unconditionally. Session Replay is not: it records what the visitor does
 * on the page, and this site is filled in by Italian consumers typing their name, email
 * and phone number into three contact forms.
 *
 * As scaffolded, `replayIntegration()` was in the initial `integrations` array with
 * `sendDefaultPii: true`, so one session in ten was recorded and replayable before the
 * cookie banner had been answered — while `Analytics.tsx` was carefully loading nothing
 * from googletagmanager.com until the visitor accepted. Replay now waits for the same
 * "all" that analytics waits for.
 */
const isProduction = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: "https://53bcec69e0ef5877057f6a9804f69db2@o4511181203832832.ingest.de.sentry.io/4511181204226128",

  /**
   * 100% was the scaffold's development default. On a public marketing site it means a
   * trace for every request, for no extra insight.
   */
  tracesSampleRate: isProduction ? 0.1 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  /**
   * Off. With PII on, Sentry attaches IP addresses and request headers to every event,
   * which the site's own privacy policy does not cover.
   */
  sendDefaultPii: false,

  // Sampling for the replays added below, once consent allows them.
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

/** Added once, the first time consent reads "all" — Sentry has no removeIntegration. */
let replayAdded = false;

function syncReplayConsent() {
  if (replayAdded || readConsent() !== "all") return;
  replayAdded = true;
  Sentry.addIntegration(
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  );
}

if (typeof window !== "undefined") {
  syncReplayConsent();
  window.addEventListener(CONSENT_EVENT, syncReplayConsent);
  /** Another tab may have accepted in the meantime. */
  window.addEventListener("storage", syncReplayConsent);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
