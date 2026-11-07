'use client';

import { useEffect } from 'react';

/** Source HomePage behaviour: jump to the URL hash section after first render. */
export function HashScroll() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let decoded: string;
    try { decoded = decodeURIComponent(id); } catch { return; }
    const frame = requestAnimationFrame(() => {
      document.getElementById(decoded)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return null;
}
