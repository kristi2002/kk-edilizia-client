// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://53bcec69e0ef5877057f6a9804f69db2@o4511181203832832.ingest.de.sentry.io/4511181204226128",

  /**
   * 100% was the scaffold default. Every request on a public marketing site is a lot of
   * traces for no extra insight; keep the full rate for local debugging only.
   */
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  /**
   * Off: with PII on, Sentry attaches IP addresses, cookies and request headers from
   * visitors filling in the contact forms, which the site's privacy policy does not
   * cover and which nothing here needs in order to debug an error.
   */
  sendDefaultPii: false,
});
