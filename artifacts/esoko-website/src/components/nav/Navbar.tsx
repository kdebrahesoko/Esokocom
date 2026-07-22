import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Menu, X, ChevronDown,
  ClipboardList, FileSearch, MessageSquare, BookOpen,
  Users, ShoppingCart, Smartphone, BarChart2,
} from 'lucide-react';
import { useBookDemo } from '@/context/BookDemoContext';

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface NavLink {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  href?: string;
}

interface NavColumn {
  heading: string;
  links: NavLink[];
}

interface SimpleNavItem {
  label: string;
  href: string;
}

interface DropdownNavItem {
  label: string;
  columns: NavColumn[];
}

type NavItem = SimpleNavItem | DropdownNavItem;

function isDropdown(item: NavItem): item is DropdownNavItem {
  return 'columns' in item;
}

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '/#platform' },
  {
    label: 'Solutions',
    columns: [
      {
        heading: 'Products',
        links: [
          { label: 'Insyt', icon: ClipboardList, desc: 'Intelligent Field Operations', href: '/solutions/insyt' },
          { label: 'Survey', icon: FileSearch, desc: 'AI-powered Data Collection', href: '/solutions/survey' },
          { label: 'Messaging', icon: MessageSquare, desc: 'Reach Millions Instantly', href: '/solutions/messaging' },
          { label: 'Content', icon: BookOpen, desc: 'Agricultural Advisory', href: '/solutions/content' },
        ],
      },
      {
        heading: 'Platform',
        links: [
          { label: 'Deployments', icon: Users, desc: 'Coordinate Field Agents', href: '/solutions/deployments' },
          { label: 'Marketplace', icon: ShoppingCart, desc: 'Connect Farmers to Buyers', href: '/solutions/marketplace' },
          { label: 'Mobile Platform', icon: Smartphone, desc: 'One Platform, Any Device', href: '/solutions/mobile-platform' },
          { label: 'AI & Analytics', icon: BarChart2, desc: 'Intelligence at Scale', href: '/solutions/ai-analytics' },
        ],
      },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About Us', href: '/company' },
];

/* ------------------------------------------------------------------ */
/* Navbar                                                               */
/* ------------------------------------------------------------------ */

export function Navbar() {
  const { open: openBookDemo } = useBookDemo();
  const [scrolled, setScrolled] = useState(false);
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
          <Link href="/" className="flex items-center z-10 shrink-0" data-testid="nav-logo">
            <img
              src="/esoko-logo.png"
              alt="Esoko"
              style={{
                height: '44px',
                width: 'auto',
                display: 'block',
                filter: isScrolledOrMenuOpen ? 'none' : 'brightness(0) invert(1)',
                transition: 'filter 0.3s ease',
              }}
            />
          </Link>

          {/* Desktop nav items */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item =>
              isDropdown(item) ? (
                <DesktopDropdown
                  key={item.label}
                  item={item}
                  isOpen={activeMenu === item.label}
                  isScrolled={isScrolledOrMenuOpen}
                  onToggle={() => toggle(item.label)}
                  onClose={() => setActiveMenu(null)}
                />
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isScrolledOrMenuOpen
                      ? 'text-foreground/80 hover:text-brand hover:bg-brand/5'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Get Started CTA */}
          <div className="hidden lg:flex items-center shrink-0">
            <button
              className={`rounded-full px-6 py-2.5 font-semibold text-sm text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9531E] focus-visible:ring-offset-2 ${
                isScrolledOrMenuOpen
                  ? 'bg-gradient-to-r from-[#D9531E] to-[#C84B16] shadow-md hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-gradient-to-r hover:from-[#D9531E] hover:to-[#C84B16] hover:border-transparent hover:shadow-lg hover:-translate-y-0.5'
              }`}
              data-testid="nav-get-started"
              onClick={() => { setActiveMenu(null); openBookDemo(); }}
            >
              Get Started
            </button>
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
            <div className="flex flex-col py-4 px-6 gap-1">
              {NAV_ITEMS.map(item =>
                isDropdown(item) ? (
                  <MobileNavSection key={item.label} item={item} onClose={() => setMobileOpen(false)} />
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="py-3 font-medium text-foreground/80 hover:text-brand border-b border-gray-100 last:border-0 transition-colors"
                    onClick={() => setMobileOpen(false)}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <button
                className="w-full rounded-full mt-4 py-3 font-semibold text-sm text-white bg-gradient-to-r from-[#D9531E] to-[#C84B16] shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                data-testid="mobile-get-started"
                onClick={() => { setMobileOpen(false); openBookDemo(); }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop Dropdown                                                     */
/* ------------------------------------------------------------------ */

function DesktopDropdown({
  item,
  isOpen,
  isScrolled,
  onToggle,
  onClose,
}: {
  item: DropdownNavItem;
  isOpen: boolean;
  isScrolled: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          isScrolled
            ? isOpen
              ? 'text-brand bg-brand/5'
              : 'text-foreground/80 hover:text-brand hover:bg-brand/5'
            : isOpen
            ? 'text-white bg-white/15'
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={onToggle}
        data-testid={`nav-${item.label.toLowerCase()}`}
      >
        {item.label}
        <ChevronDown
          className={`w-4 h-4 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
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
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                              {link.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                          </div>
                        </>
                      );
                      return (
                        <li key={link.label}>
                          {link.href ? (
                            <Link
                              href={link.href}
                              role="menuitem"
                              className="w-full flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                              onClick={onClose}
                              data-testid={`menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {inner}
                            </Link>
                          ) : (
                            <button
                              role="menuitem"
                              className="w-full flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-brand/5 text-left transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
            {/* Footer hint */}
            <div className="bg-brand/5 border-t border-border px-5 py-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Explore all {item.label.toLowerCase()} →
              </p>
              <button
                className="text-xs font-semibold text-brand hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                onClick={onClose}
                data-testid={`menu-${item.label.toLowerCase()}-cta`}
              >
                View all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile Nav Section (for dropdown items)                              */
/* ------------------------------------------------------------------ */

function MobileNavSection({ item, onClose }: { item: DropdownNavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="flex items-center justify-between w-full py-3 font-medium text-foreground/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded hover:text-brand transition-colors"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        data-testid={`mobile-nav-${item.label.toLowerCase()}`}
      >
        {item.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180 text-brand' : ''}`} />
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
                    <>
                      <div className="w-7 h-7 rounded-md bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-brand" />
                      </div>
                      <span className="text-sm text-foreground/80 group-hover:text-brand transition-colors">
                        {link.label}
                      </span>
                    </>
                  );
                  return link.href ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-brand/5 text-left transition-colors group"
                      onClick={onClose}
                      data-testid={`mobile-menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <button
                      key={link.label}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-brand/5 text-left transition-colors group"
                      onClick={onClose}
                      data-testid={`mobile-menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {inner}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
