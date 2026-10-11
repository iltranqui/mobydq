import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** The current URL hash without the leading "#". Re-renders when it changes. */
export function useHashId(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash.slice(1));
}

/** Navigates to a prototype. Pushes a history entry, so the back button works. */
export function goTo(id: string): void {
  window.location.hash = id;
}
