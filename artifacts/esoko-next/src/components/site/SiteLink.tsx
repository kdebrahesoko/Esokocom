import type { AnchorHTMLAttributes } from 'react';
import { siteHref } from '@/lib/site-links';

/** Plain anchor that maps site paths through siteHref (no client router). */
export function SiteLink({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a href={siteHref(href)} {...props} />;
}
