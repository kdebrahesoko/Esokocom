'use client';

import { usePathname } from 'next/navigation';
import { normalizeSitePath } from '@/lib/site-links';
import { usesOverlayHeader } from '@/lib/hero-landings';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

/**
 * Shared header for the homepage, Resources and Careers.
 * The navbar is fixed. Hero landings sit underneath it; all other routes keep
 * their existing spacer so page content is not hidden behind the navigation.
 */
export function SiteHeader() {
  const hasHero = usesOverlayHeader(normalizeSitePath(usePathname()));
  return (
    <div className="site-chrome site-header">
      <Navbar />
      {!hasHero && <div className="site-header-spacer" aria-hidden="true" />}
    </div>
  );
}

export function SiteFooter() {
  return (
    <div className="site-chrome site-footer">
      <Footer />
    </div>
  );
}
