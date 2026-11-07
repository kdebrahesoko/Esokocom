'use client';

import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const serverSnapshot = () => false;
const clientSnapshot = () => window.matchMedia(query).matches;
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/**
 * Keep SSR and the hydration render identical. React reads the real preference
 * immediately after hydration and subscribes to subsequent preference changes.
 * Reading matchMedia during the first client render changes motion styles and
 * carousel accessibility attributes relative to the server's unknown preference.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
}
