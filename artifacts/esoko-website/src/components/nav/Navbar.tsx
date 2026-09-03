import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import {
  Menu, X, ChevronDown, ArrowRight, Lock, Loader2,
  ClipboardList, FileSearch, MessageSquare, BookOpen,
  Users, ShoppingCart, Smartphone, BarChart2,
  Wheat, Building2, Heart, Sprout, CreditCard, GraduationCap,
  Info, Award, Briefcase, Handshake, Newspaper, Calendar,
  FileText, Headphones, Video, Code, Globe2, Star, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookDemo } from '@/context/BookDemoContext';
import type { ResourceListItem } from '@/lib/resources';
import { API_TYPE_TO_PUBLIC, resolveImageUrl, formatResourceDate } from '@/lib/resources';

/* ------------------------------------------------------------------ */
/* NAV DATA — Company / Sectors / Solutions only (Resources handled separately) */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  {
    label: 'Company',
    columns: [
      {
        heading: 'About Esoko',
        links: [
          { label: 'About Us',           icon: Info,       desc: 'Our story since 2008',                    href: '/company' },
          { label: 'Leadership',          icon: Award,      desc: 'Executive team & board' },
          { label: 'Careers',             icon: Briefcase,  desc: 'Join our team',                           href: '/careers' },
          { label: 'Partners',            icon: Handshake,  desc: 'Technology & development partners' },
        ],
      },
      {
        heading: 'Press',
        links: [
          { label: 'Press & Media',       icon: Newspaper,  desc: 'News and press releases' },
          { label: 'Events',              icon: Calendar,   desc: 'Conferences and field days' },
          { label: 'Investor Relations',  icon: BarChart2,  desc: 'Financial reports & governance' },
        ],
      },
    ],
  },
  {
    label: 'Sectors',
    footerHref: '/sectors',
    columns: [
      {
        heading: 'Public Sector',
        links: [
          { label: 'Agriculture',         icon: Wheat,          desc: 'Smallholder & commercial farmers', href: '/sectors/agriculture' },
          { label: 'Government',          icon: Building2,      desc: 'National programme management', href: '/sectors/government' },
          { label: 'NGOs & Development',  icon: Heart,          desc: 'Beneficiary management & M&E', href: '/sectors/ngos-development' },
          { label: 'Education',           icon: GraduationCap,  desc: 'Agricultural training & extension', href: '/sectors/education' },
        ],
      },
      {
        heading: 'Private Sector',
        links: [
          { label: 'Sustainability',        icon: Sprout,    desc: 'Carbon & climate-smart farming', href: '/sectors/sustainability' },
          { label: 'Financial Inclusion',   icon: CreditCard, desc: 'Digital credit & insurance', href: '/sectors/financial-inclusion' },
          { label: 'Renewable Energy',      icon: Globe2,    desc: 'Solar adoption tracking', href: '/sectors/renewable-energy' },
          { label: 'Supply Chain',          icon: Briefcase, desc: 'Farm-to-market traceability', href: '/sectors/supply-chain' },
        ],
      },
    ],
  },
  {
    label: 'Products & Services',
    footerHref: '/products-services',
    columns: [
      {
        heading: 'Products & Platforms',
        links: [
          { label: 'Insyt & Survey',  icon: ClipboardList,  desc: 'Field Operations & AI-powered Data Collection', href: 'https://insyt-survey.esoko.com/', external: true },
          { label: 'Push Messaging',  icon: MessageSquare,  desc: 'Reach Millions Instantly',                      href: 'https://push.esoko.com/',          external: true },
          { label: 'E Content',       icon: BookOpen,       desc: 'Agricultural Advisory',                         href: 'https://content-web.esoko.com/',   external: true },
          { label: 'Marketplace',     icon: ShoppingCart,   desc: 'Connect Farmers to Buyers',                     href: 'https://marketplace.esoko.com/',   external: true },
        ],
      },
      {
        heading: 'Services',
        links: [
          { label: 'Deployments',          icon: Users,         desc: 'Coordinate Field Agents at Scale',    href: '/solutions/deployments' },
          { label: 'Software Development', icon: Code,          desc: 'Custom AgTech Solutions',             href: '/products-services#software-dev' },
          { label: 'Messaging Services',   icon: MessageSquare, desc: 'Managed Push Campaigns',             href: '/solutions/messaging' },
          { label: 'Content Services',     icon: BookOpen,      desc: 'Editorial & Advisory Delivery',      href: '/solutions/content' },
        ],
      },
    ],
  },
];

/* Resources mega-menu link definitions */
const EXPLORE_LINKS = [
  { label: 'Blog',             icon: FileText,   desc: 'Insights on African agriculture',   href: '/resources/blog' },
  { label: 'Webinars',         icon: Video,      desc: 'Live and on-demand sessions',        href: '/resources/webinars' },
  { label: 'Events',           icon: Calendar,   desc: 'Summits and field days',             href: '/resources/events' },
  { label: 'Podcasts',         icon: Headphones, desc: 'Conversations with innovators',      href: '/resources/podcasts' },
  { label: 'Customer Stories', icon: Users,      desc: 'Transformation case studies',        href: '/resources/customer-stories' },
];

const LEARN_LINKS = [
  { label: 'Guides',           icon: BookOpen,   desc: 'Practical how-to guides',            href: '/resources/guides' },
  { label: 'Reports',          icon: BarChart2,  desc: 'Data-driven analysis & publications', href: '/resources/reports' },
  { label: 'Research',         icon: FileSearch, desc: 'Academic & applied research',         href: '/resources/research' },
  { label: 'Documentation',    icon: Globe2,     desc: 'Technical integration guides',        href: undefined as string | undefined },
  { label: 'Developer Hub',    icon: Code,       desc: 'APIs, SDKs and sandbox',              href: undefined as string | undefined },
];

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface NavLink {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  href?: string;
  external?: boolean; // opens in new tab, renders <a> instead of <Link>
}

interface NavColumn {
  heading: string;
  links: NavLink[];
}

interface NavItem {
  label: string;
  columns: NavColumn[];
  footerHref?: string; // optional "view all" URL for the dropdown footer
}

/* ------------------------------------------------------------------ */
/* Navbar                                                               */
/* ------------------------------------------------------------------ */

export function Navbar() {
  const { open: openBookDemo } = useBookDemo();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setActiveMenu(null); setMobileOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const toggle = useCallback((label: string) => {
    setActiveMenu(prev => (prev === label ? null : label));
  }, []);

  const isScrolledOrMenuOpen = scrolled || !!activeMenu || mobileOpen;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolledOrMenuOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
      data-testid="navbar"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10" data-testid="nav-logo">
            <img
              src="/esoko-logo.png"
              alt="Esoko"
              style={{ height: '44px', width: 'auto', display: 'block', transition: 'filter 0.3s ease' }}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <DesktopDropdown
                key={item.label}
                item={item}
                isOpen={activeMenu === item.label}
                isScrolled={isScrolledOrMenuOpen}
                onToggle={() => toggle(item.label)}
                onClose={() => setActiveMenu(null)}
              />
            ))}
            {/* Resources — special 3-column mega-menu */}
            <ResourcesMegaMenu
              isOpen={activeMenu === 'Resources'}
              isScrolled={isScrolledOrMenuOpen}
              onToggle={() => toggle('Resources')}
              onClose={() => setActiveMenu(null)}
            />
          </div>

          {/* Book a Demo + Staff Login */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Staff Login dropdown */}
            <div className="relative group">
              <button
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                  isScrolledOrMenuOpen
                    ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
                aria-label="Staff login"
              >
                <Lock className="w-3.5 h-3.5" />
                Login
                <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-44">
                  <Link href="/admin/login?role=hr"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Users className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    HR Login
                  </Link>
                  <Link href="/admin/login?role=content"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    Content Login
                  </Link>
                </div>
              </div>
            </div>

            <Button
              className={`rounded-full px-6 font-medium transition-colors ${
                isScrolledOrMenuOpen
                  ? 'bg-brand hover:bg-brand/80 text-white'
                  : 'bg-white text-brand hover:bg-white/90'
              }`}
              data-testid="nav-book-demo"
              onClick={() => { setActiveMenu(null); openBookDemo(); }}
            >
              Book a Demo
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden p-2 rounded-md transition-colors ${
              isScrolledOrMenuOpen ? 'text-foreground' : 'text-white'
            }`}
            onClick={() => { setMobileOpen(v => !v); setActiveMenu(null); }}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            data-testid="nav-mobile-toggle"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-border shadow-xl overflow-hidden"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col py-4 px-6 gap-2">
              {NAV_ITEMS.map(item => (
                <MobileNavSection key={item.label} item={item} onClose={() => setMobileOpen(false)} />
              ))}
              {/* Resources mobile section */}
              <ResourcesMobileSection onClose={() => setMobileOpen(false)} />

              {/* Staff login links — mobile */}
              <div className="border-t border-gray-100 pt-3 mt-1 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-2 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Staff Login
                </p>
                <Link href="/admin/login?role=hr"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <Users className="w-4 h-4 text-emerald-500 flex-shrink-0" /> HR Login
                </Link>
                <Link href="/admin/login?role=content"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Content Login
                </Link>
              </div>

              <Button
                className="w-full bg-brand hover:bg-brand/80 text-white rounded-full mt-2"
                data-testid="mobile-book-demo"
                onClick={() => { setMobileOpen(false); openBookDemo(); }}
              >
                Book a Demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop Dropdown (generic — Company, Sectors, Solutions)            */
/* ------------------------------------------------------------------ */

function DesktopDropdown({
  item, isOpen, isScrolled, onToggle, onClose,
}: {
  item: NavItem; isOpen: boolean; isScrolled: boolean;
  onToggle: () => void; onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          isScrolled
            ? isOpen ? 'text-brand bg-brand/5' : 'text-foreground/80 hover:text-brand hover:bg-brand/5'
            : isOpen ? 'text-white bg-white/15' : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={onToggle}
        data-testid={`nav-${item.label.toLowerCase()}`}
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
            role="menu"
          >
            <div className="grid grid-cols-2 gap-0 divide-x divide-border">
              {item.columns.map(col => (
                <div key={col.heading} className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-2">
                    {col.heading}
                  </p>
                  <ul className="space-y-1">
                    {col.links.map(link => {
                      const Icon = link.icon;
                      const inner = (
                        <>
                          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand/20 transition-colors mt-0.5">
                            <Icon className="w-4 h-4 text-brand" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-brand transition-colors flex items-center gap-1.5">
                              {link.label}
                              {link.external && <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-brand/60 flex-shrink-0" />}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                          </div>
                        </>
                      );
                      const sharedCls = "w-full flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand";
                      return (
                        <li key={link.label}>
                          {link.external && link.href ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              role="menuitem"
                              aria-label={`${link.label} — opens in a new tab`}
                              className={sharedCls}
                              onClick={onClose}
                              data-testid={`menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {inner}
                            </a>
                          ) : link.href ? (
                            <Link
                              href={link.href}
                              role="menuitem"
                              className={sharedCls}
                              onClick={onClose}
                              data-testid={`menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {inner}
                            </Link>
                          ) : (
                            <button
                              role="menuitem"
                              className={sharedCls}
                              onClick={onClose}
                              data-testid={`menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {inner}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            <div className="bg-brand/5 border-t border-border px-5 py-3 flex items-center justify-end">
              {item.footerHref ? (
                <Link
                  href={item.footerHref}
                  className="text-xs font-semibold text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                  onClick={onClose}
                >
                  View all {item.label} →
                </Link>
              ) : (
                <button
                  className="text-xs font-semibold text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                  onClick={onClose}
                >
                  Explore all {item.label.toLowerCase()} →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Resources Mega-Menu (3 columns: Explore / Learn / Featured)         */
/* ------------------------------------------------------------------ */

function ResourcesMegaMenu({
  isOpen, isScrolled, onToggle, onClose,
}: {
  isOpen: boolean; isScrolled: boolean;
  onToggle: () => void; onClose: () => void;
}) {
  const [location] = useLocation();
  const [featured, setFeatured]             = useState<ResourceListItem | null>(null);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const fetchedRef = useRef(false);

  // Fetch once on first open
  useEffect(() => {
    if (!isOpen || fetchedRef.current) return;
    fetchedRef.current = true;
    setFeaturedLoading(true);
    const base = import.meta.env.BASE_URL ?? '/';
    fetch(`${base}api/resources?status=published&featured=true&limit=1`)
      .then(r => r.ok ? r.json() : { resources: [] })
      .then(data => setFeatured(data.resources?.[0] ?? null))
      .catch(() => setFeatured(null))
      .finally(() => setFeaturedLoading(false));
  }, [isOpen]);

  const isResourcesActive = location.startsWith('/resources');
  const base = import.meta.env.BASE_URL ?? '/';

  const featuredHref = featured
    ? `/resources/${API_TYPE_TO_PUBLIC[featured.typeSlug] ?? 'blog'}/${featured.slug}`
    : '/resources';

  const featuredImg = featured
    ? resolveImageUrl(featured.featuredImageUrl, base)
    : null;

  function NavMenuLink({ link, onClose }: { link: typeof EXPLORE_LINKS[number]; onClose: () => void }) {
    const Icon = link.icon;
    const isActive = location === link.href || location.startsWith(link.href + '/');
    const inner = (
      <div className={`w-full flex items-start gap-3 px-2 py-2.5 rounded-xl transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
        isActive ? 'bg-brand/10 text-brand' : 'hover:bg-brand/5'
      }`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
          isActive ? 'bg-brand/20' : 'bg-brand/10 group-hover:bg-brand/20'
        }`}>
          <Icon className="w-4 h-4 text-brand" />
        </div>
        <div>
          <p className={`text-sm font-medium transition-colors ${isActive ? 'text-brand' : 'text-foreground group-hover:text-brand'}`}>
            {link.label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
        </div>
      </div>
    );

    return link.href ? (
      <Link
        href={link.href}
        role="menuitem"
        className="block"
        onClick={onClose}
        data-testid={`menu-resources-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {inner}
      </Link>
    ) : (
      <div
        role="menuitem"
        className="block opacity-50 cursor-default"
        aria-disabled="true"
      >
        {inner}
        <p className="text-[10px] text-muted-foreground px-2 pb-1 -mt-1 ml-11">Coming soon</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          isScrolled
            ? isResourcesActive || isOpen
              ? 'text-brand bg-brand/5'
              : 'text-foreground/80 hover:text-brand hover:bg-brand/5'
            : isResourcesActive || isOpen
            ? 'text-white bg-white/15'
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={onToggle}
        data-testid="nav-resources"
      >
        Resources
        <ChevronDown className={`w-4 h-4 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full right-0 mt-2 w-[720px] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
            role="menu"
            aria-label="Resources menu"
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-border bg-gradient-to-r from-emerald-50 to-white">
              <p className="text-base font-bold text-foreground">Resources</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Insights, knowledge and stories from Esoko.
              </p>
            </div>

            {/* 3-column body */}
            <div className="grid grid-cols-3 divide-x divide-border">

              {/* Col 1: Explore */}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-2">
                  Explore
                </p>
                <ul className="space-y-0.5" role="list">
                  {EXPLORE_LINKS.map(link => (
                    <li key={link.label}>
                      <NavMenuLink link={link} onClose={onClose} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 2: Learn */}
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-2">
                  Learn
                </p>
                <ul className="space-y-0.5" role="list">
                  {LEARN_LINKS.map(link => (
                    <li key={link.label}>
                      <NavMenuLink link={link as typeof EXPLORE_LINKS[number]} onClose={onClose} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Featured */}
              <div className="p-5 flex flex-col">
                <div className="flex items-center gap-1.5 mb-3 px-2">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Featured
                  </p>
                </div>

                {/* Loading skeleton */}
                {featuredLoading && (
                  <div className="flex-1 flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-brand animate-spin" />
                  </div>
                )}

                {/* Featured resource card */}
                {!featuredLoading && featured && (
                  <Link
                    href={featuredHref}
                    onClick={onClose}
                    className="group flex flex-col gap-3 rounded-xl overflow-hidden border border-border hover:border-brand/30 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    data-testid="menu-resources-featured"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full h-28 bg-gradient-to-br from-emerald-800 to-emerald-600 overflow-hidden">
                      {featuredImg && (
                        <img
                          src={featuredImg}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {featured.categoryName && (
                        <span className="absolute top-2 left-2 text-[10px] font-semibold bg-white/90 text-emerald-800 rounded-full px-2 py-0.5">
                          {featured.categoryName}
                        </span>
                      )}
                    </div>
                    {/* Content */}
                    <div className="px-3 pb-3 flex flex-col gap-1.5">
                      <p className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-2 leading-snug">
                        {featured.title}
                      </p>
                      {featured.shortDescription && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {featured.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-muted-foreground">
                          {formatResourceDate(featured.publishedAt)}
                        </span>
                        <span className="text-[11px] font-semibold text-brand flex items-center gap-0.5">
                          Read More <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Empty state */}
                {!featuredLoading && !featured && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-6 px-4 rounded-xl bg-emerald-50/50 border border-dashed border-emerald-200">
                    <Star className="w-6 h-6 text-emerald-300 mb-2" />
                    <p className="text-sm font-medium text-emerald-800">Insights coming soon</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      New content is on its way.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-border px-6 py-3 flex items-center justify-between">
              <Link
                href="/resources"
                onClick={onClose}
                className="flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                data-testid="menu-resources-view-all"
              >
                View All Resources
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/admin/login"
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                data-testid="menu-resources-staff-login"
              >
                <Lock className="w-3 h-3" />
                For Esoko Staff — Content &amp; HR Administration
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile Nav Section (generic)                                        */
/* ------------------------------------------------------------------ */

function MobileNavSection({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="flex items-center justify-between w-full py-3 font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        data-testid={`mobile-nav-${item.label.toLowerCase()}`}
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-3 space-y-1">
              {item.columns.flatMap(col =>
                col.links.map(link => {
                  const Icon = link.icon;
                  const inner = (
                    <div className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-brand/5 text-left transition-colors group">
                      <div className="w-7 h-7 rounded-md bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <span className="text-sm text-foreground/80 group-hover:text-brand transition-colors flex items-center gap-1">
                        {link.label}
                        {link.external && <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                      </span>
                    </div>
                  );
                  return link.external && link.href ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${link.label} — opens in a new tab`}
                      className="block"
                      onClick={onClose}
                      data-testid={`mobile-menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {inner}
                    </a>
                  ) : link.href ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block"
                      onClick={onClose}
                      data-testid={`mobile-menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      key={link.label}
                      className="w-full"
                      onClick={onClose}
                      data-testid={`mobile-menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {inner}
                    </button>
                  );
                })
              )}
              {/* View all link for items with footerHref */}
              {item.footerHref && (
                <Link
                  href={item.footerHref}
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-brand hover:underline focus:outline-none"
                >
                  View All {item.label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Resources Mobile Section (accordion with all resource links)        */
/* ------------------------------------------------------------------ */

function ResourcesMobileSection({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const isResourcesActive = location.startsWith('/resources');

  const allLinks = [
    { heading: 'Explore', links: EXPLORE_LINKS },
    { heading: 'Learn',   links: LEARN_LINKS   },
  ];

  return (
    <div className="border-b border-gray-100">
      <button
        className={`flex items-center justify-between w-full py-3 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded ${
          isResourcesActive ? 'text-brand' : 'text-foreground'
        }`}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        data-testid="mobile-nav-resources"
      >
        Resources
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-3 space-y-4">
              {allLinks.map(section => (
                <div key={section.heading}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 px-2">
                    {section.heading}
                  </p>
                  <div className="space-y-0.5">
                    {section.links.map(link => {
                      const Icon = link.icon;
                      const isActive = link.href && (location === link.href || location.startsWith(link.href + '/'));
                      const inner = (
                        <div className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors group ${
                          isActive ? 'bg-brand/10' : 'hover:bg-brand/5'
                        }`}>
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                            isActive ? 'bg-brand/20' : 'bg-brand/10'
                          }`}>
                            <Icon className="w-3.5 h-3.5 text-brand" />
                          </div>
                          <span className={`text-sm transition-colors ${
                            isActive ? 'text-brand font-medium' : 'text-foreground/80 group-hover:text-brand'
                          }`}>
                            {link.label}
                          </span>
                          {!link.href && (
                            <span className="ml-auto text-[10px] text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded-full">
                              Soon
                            </span>
                          )}
                        </div>
                      );
                      return link.href ? (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="block"
                          onClick={onClose}
                          data-testid={`mobile-menu-resources-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div key={link.label} className="opacity-60 cursor-default">
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* View all */}
              <Link
                href="/resources"
                onClick={onClose}
                className="flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                data-testid="mobile-menu-resources-view-all"
              >
                View All Resources <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Staff login */}
              <Link
                href="/admin/login"
                onClick={onClose}
                className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-muted-foreground hover:text-brand transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded border border-dashed border-gray-200 rounded-lg"
                data-testid="mobile-menu-staff-login"
              >
                <Lock className="w-3 h-3" />
                For Esoko Staff — Content &amp; HR Administration
                <ArrowRight className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
