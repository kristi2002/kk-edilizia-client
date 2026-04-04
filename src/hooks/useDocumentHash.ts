"use client";

import { useSyncExternalStore } from "react";

const NAV_HASH_EVENT = "kk:navhash";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener(NAV_HASH_EVENT, onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(NAV_HASH_EVENT, onChange);
  };
}

function getHashSnapshot() {
  return typeof window !== "undefined" ? window.location.hash : "";
}

/** Current `window.location.hash` (client), updates on hash/popstate and after in-app `replaceState` to a fragment. */
export function useDocumentHash() {
  return useSyncExternalStore(subscribeHash, getHashSnapshot, () => "");
}

/** Call after `history.replaceState` changes the fragment so hooks re-render (replaceState does not fire `hashchange`). */
export function notifyNavHashChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NAV_HASH_EVENT));
  }
}
