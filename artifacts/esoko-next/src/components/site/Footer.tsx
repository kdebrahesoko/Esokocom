'use client';

import { SiteLink as Link } from '@/components/site/SiteLink';

/*
 * Adapted from the existing site's Footer. The source generated paths such as
 * "/company/leadership" or "/legal/privacy-policy" that do not exist, and social
 * icons pointing to "#". Only links that map to real routes are kept:
 * migrated routes resolve through siteHref, others stay on the existing site.
 */
const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  Products: [
    { label: 'Insyt', href: '/solutions/insyt' },
    { label: 'Survey', href: '/solutions/survey' },
    { label: 'Messaging', href: '/solutions/messaging' },
    { label: 'Marketplace', href: '/solutions/marketplace' },
    { label: 'Deployments', href: '/solutions/deployments' },
    { label: 'Content', href: '/solutions/content' },
    { label: 'AI', href: '/solutions/ai-analytics' },
  ],
  Company: [
    { label: 'About', href: '/company' },
    { label: 'Leadership', href: '/company#team' },
    { label: 'Careers', href: '/careers' },
    { label: 'News', href: '/resources/blog' },
    { label: 'Events', href: '/resources/events' },
    { label: 'Staff Login', href: '/admin/login' },
  ],
  Resources: [
    { label: 'Blog', href: '/resources/blog' },
    { label: 'Customer Stories', href: '/resources/customer-stories' },
    { label: 'Reports', href: '/resources/reports' },
    { label: 'Webinars', href: '/resources/webinars' },
    { label: 'All Resources', href: '/resources' },
  ],
  Explore: [
    { label: 'Products & Services', href: '/products-services' },
    { label: 'Sectors', href: '/sectors' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Support: [
    { label: 'Contact', href: '/#contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1F2937] pt-20 pb-10 text-white/80">
      <div className="container mx-auto px-4 md:px-6">

        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-16 border-b border-white/10 pb-12">
          <div className="max-w-sm text-center md:text-left">
            <Link href="/" className="inline-block mb-4" aria-label="Esoko home">
              <img
                src="/esoko-next/site-assets/esoko-logo.png"
                alt="Esoko"
                style={{ height: '28px', width: 'auto', filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p className="text-white/60 font-medium">
              Empowering Farmers. Transforming Agriculture. Restoring Earth.
            </p>
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-16">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h2 className="font-heading font-bold text-white mb-4 text-base">{category}</h2>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <p className="text-sm text-white/60 mb-6">
          Migration preview · noindex. Public content is available here.
          Contact, demo requests and applications stay here. Staff login and admin open the existing website.
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm text-white/40">
          <p>© 2025 Esoko. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Accra, Ghana</p>
        </div>

      </div>
    </footer>
  );
}
