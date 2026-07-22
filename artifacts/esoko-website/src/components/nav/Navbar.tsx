import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Menu, X, ChevronDown,
  ClipboardList, FileSearch, MessageSquare, BookOpen,
  Users, ShoppingCart, Smartphone, BarChart2,
  Wheat, Building2, Heart, Sprout, CreditCard, GraduationCap,
  Info, Award, Briefcase, Handshake, Newspaper, Calendar,
  FileText, Headphones, Video, Code, Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookDemo } from '@/context/BookDemoContext';

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  {
    label: 'Solutions',
    columns: [
      {
        heading: 'Products',
        links: [
          { label: 'Insyt', icon: ClipboardList, desc: 'Intelligent Field Operations' },
          { label: 'Survey', icon: FileSearch, desc: 'AI-powered Data Collection' },
          { label: 'Messaging', icon: MessageSquare, desc: 'Reach Millions Instantly' },
          { label: 'Content', icon: BookOpen, desc: 'Agricultural Advisory' },
        ],
      },
      {
        heading: 'Platform',
        links: [
          { label: 'Deployments', icon: Users, desc: 'Coordinate Field Agents' },
          { label: 'Marketplace', icon: ShoppingCart, desc: 'Connect Farmers to Buyers' },
          { label: 'Mobile Platform', icon: Smartphone, desc: 'One Platform, Any Device' },
          { label: 'AI & Analytics', icon: BarChart2, desc: 'Intelligence at Scale' },
        ],
      },
    ],
  },
  {
    label: 'Sectors',
    columns: [
      {
        heading: 'Public Sector',
        links: [
          { label: 'Agriculture', icon: Wheat, desc: 'Smallholder & commercial farmers' },
          { label: 'Government', icon: Building2, desc: 'National programme management' },
          { label: 'NGOs & Development', icon: Heart, desc: 'Beneficiary management & M&E' },
          { label: 'Education', icon: GraduationCap, desc: 'Agricultural training & extension' },
        ],
      },
      {
        heading: 'Private Sector',
        links: [
          { label: 'Sustainability', icon: Sprout, desc: 'Carbon & climate-smart farming' },
          { label: 'Financial Inclusion', icon: CreditCard, desc: 'Digital credit & insurance' },
          { label: 'Renewable Energy', icon: Globe2, desc: 'Solar adoption tracking' },
          { label: 'Supply Chain', icon: Briefcase, desc: 'Farm-to-market traceability' },
        ],
      },
    ],
  },
  {
    label: 'Company',
    columns: [
      {
        heading: 'About Esoko',
        links: [
          { label: 'About Us', icon: Info, desc: 'Our story since 2008' },
          { label: 'Leadership', icon: Award, desc: 'Executive team & board' },
          { label: 'Careers', icon: Briefcase, desc: 'Join our team' },
          { label: 'Partners', icon: Handshake, desc: 'Technology & development partners' },
        ],
      },
      {
        heading: 'Press',
        links: [
          { label: 'Press & Media', icon: Newspaper, desc: 'News and press releases' },
          { label: 'Events', icon: Calendar, desc: 'Conferences and field days' },
          { label: 'Investor Relations', icon: BarChart2, desc: 'Financial reports & governance' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    columns: [
      {
        heading: 'Learn',
        links: [
          { label: 'Blog', icon: FileText, desc: 'Insights on African agriculture' },
          { label: 'Research Reports', icon: BarChart2, desc: 'Data-driven analysis' },
          { label: 'Webinars', icon: Video, desc: 'Live and on-demand learning' },
          { label: 'Podcasts', icon: Headphones, desc: 'Conversations with innovators' },
        ],
      },
      {
        heading: 'Build',
        links: [
          { label: 'Customer Stories', icon: Users, desc: 'Transformation case studies' },
          { label: 'Documentation', icon: BookOpen, desc: 'Technical guides' },
          { label: 'Developer Hub', icon: Code, desc: 'APIs, SDKs and sandbox' },
          { label: 'Events', icon: Calendar, desc: 'Summits and field days' },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

interface NavLink {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
}

interface NavColumn {
  heading: string;
  links: NavLink[];
}

interface NavItem {
  label: string;
  columns: NavColumn[];
}

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

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close menu when clicking outside
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
              height={30}
              style={{
                height: '30px',
                width: 'auto',
                display: 'block',
                filter: isScrolledOrMenuOpen ? 'none' : 'brightness(0) invert(1)',
                transition: 'filter 0.3s ease',
              }}
            />
          </Link>

          {/* Desktop nav items */}
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
          </div>

          {/* Book a Demo */}
          <div className="hidden lg:flex items-center">
            <Button
              className={`rounded-full px-6 font-medium transition-colors ${
                isScrolledOrMenuOpen
                  ? 'bg-[#C05C0E] hover:bg-[#A84D0A] text-white'
                  : 'bg-white text-[#C05C0E] hover:bg-white/90'
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
              <Button
                className="w-full bg-[#C05C0E] hover:bg-[#A84D0A] text-white rounded-full mt-4"
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
/* Desktop Dropdown                                                     */
/* ------------------------------------------------------------------ */

function DesktopDropdown({
  item,
  isOpen,
  isScrolled,
  onToggle,
  onClose,
}: {
  item: NavItem;
  isOpen: boolean;
  isScrolled: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative">
      <button
        className={`flex items-center gap-1 px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          isScrolled
            ? isOpen
              ? 'text-primary bg-primary/5'
              : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
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
                      return (
                        <li key={link.label}>
                          <button
                            role="menuitem"
                            className="w-full flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-[#C05C0E]/5 text-left transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C05C0E]"
                            onClick={onClose}
                            data-testid={`menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#C05C0E]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C05C0E]/20 transition-colors mt-0.5">
                              <Icon className="w-4 h-4 text-[#C05C0E]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground group-hover:text-[#C05C0E] transition-colors">
                                {link.label}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            {/* Footer CTA */}
            <div className="bg-[#C05C0E]/5 border-t border-border px-5 py-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Explore all {item.label.toLowerCase()} →
              </p>
              <button
                className="text-xs font-semibold text-[#C05C0E] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C05C0E] rounded"
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
/* Mobile Nav Section                                                   */
/* ------------------------------------------------------------------ */

function MobileNavSection({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="flex items-center justify-between w-full py-3 font-medium text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
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
                  return (
                    <button
                      key={link.label}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#C05C0E]/5 text-left transition-colors group"
                      onClick={onClose}
                      data-testid={`mobile-menu-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="w-7 h-7 rounded-md bg-[#C05C0E]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-[#C05C0E]" />
                      </div>
                      <span className="text-sm text-foreground/80 group-hover:text-[#C05C0E] transition-colors">
                        {link.label}
                      </span>
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
