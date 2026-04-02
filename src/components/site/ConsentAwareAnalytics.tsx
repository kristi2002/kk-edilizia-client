"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";

const STORAGE_KEY = "kk-edilizia-cookie-consent";

function analyticsAllowed(): boolean {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "all" || v === "1") return true;
    return false;
  } catch {
    return false;
  }
}

export function ConsentAwareAnalytics() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(analyticsAllowed());
    const onConsent = () => setShow(analyticsAllowed());
    window.addEventListener("kk-cookie-consent", onConsent);
    return () => window.removeEventListener("kk-cookie-consent", onConsent);
  }, []);

  if (!show) return null;
  return <Analytics />;
}
