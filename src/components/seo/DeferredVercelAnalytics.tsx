"use client";

import { useEffect, useState } from "react";

type AnalyticsComponent = typeof import("@vercel/analytics/next").Analytics;

export function DeferredVercelAnalytics() {
  const [Analytics, setAnalytics] = useState<AnalyticsComponent | null>(null);

  useEffect(() => {
    const load = () => {
      void import("@vercel/analytics/next").then((m) => {
        setAnalytics(() => m.Analytics);
      });
    };
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(load, { timeout: 4000 });
      return () => cancelIdleCallback(id);
    }
    const t = window.setTimeout(load, 1);
    return () => window.clearTimeout(t);
  }, []);

  if (!Analytics) return null;
  return <Analytics />;
}
