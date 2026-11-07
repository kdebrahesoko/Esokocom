'use client';

import { DEMO_HREF } from '@/lib/site-links';

/**
 * Compatibility for copied demo buttons: open() navigates to the Next demo form.
 * The new standalone form replaces the original URL-less global modal.
 * Same shape as the source context so copied components keep working.
 */
export function openBookDemoHandoff() {
  window.location.assign(DEMO_HREF);
}

const VALUE = { isOpen: false, open: openBookDemoHandoff, close: () => {} };

export function useBookDemo() {
  return VALUE;
}
