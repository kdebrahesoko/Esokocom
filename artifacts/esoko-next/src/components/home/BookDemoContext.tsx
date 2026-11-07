'use client';

import { EXISTING_CONTACT_HREF } from '@/lib/site-links';

/**
 * Migration handoff: the existing site owns the demo/contact flow.
 * open() navigates to the existing site's /#contact section — no modal or form here.
 * Same shape as the source context so copied components keep working.
 */
export function openBookDemoHandoff() {
  window.location.assign(EXISTING_CONTACT_HREF);
}

const VALUE = { isOpen: false, open: openBookDemoHandoff, close: () => {} };

export function useBookDemo() {
  return VALUE;
}
