'use client';

import { usePathname } from 'next/navigation';
import { normalizeSitePath } from '@/lib/site-links';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

/**
 * Shared header for the homepage, Resources and Careers.
 * The navbar is fixed; on non-home routes a spacer reserves its height so
 * page content is not hidden underneath (the homepage hero sits beneath it).
 */
export function SiteHeader() {
  const isHome = normalizeSitePath(usePathname()) === '/';
  return (
    <div className="site-chrome site-header">
      <Navbar />
      {!isHome && <div className="site-header-spacer" aria-hidden="true" />}
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
