import { useState, useEffect, useRef } from 'react';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'mission', label: 'Mission' },
  { id: 'overview', label: 'Overview' },
  { id: 'journey', label: 'Journey' },
  { id: 'impact', label: 'Impact' },
  { id: 'team', label: 'Leadership' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'partners', label: 'Partners' },
];

export function CompanyNav() {
  const [active, setActive] = useState('about');
  const [visible, setVisible] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky nav only after scrolling past a certain point
      if (window.scrollY > window.innerHeight * 0.8) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      // Determine active section
      const sectionElements = SECTIONS.map(s => ({
        id: s.id,
        el: document.getElementById(s.id)
      })).filter(s => s.el !== null);

      // Find the last section whose top is above the middle of the viewport
      let current = sectionElements[0]?.id || 'about';
      for (const section of sectionElements) {
        const rect = section.el!.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          current = section.id;
        }
      }
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;
    navRef.current
      ?.querySelector<HTMLButtonElement>(`[data-section-id="${active}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [active, visible]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      className={`fixed top-20 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-center mt-4">
        <nav 
          ref={navRef}
          aria-label="On-page navigation"
          className="bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-lg rounded-full px-2 py-2 flex items-center gap-1 pointer-events-auto overflow-x-auto hide-scrollbar max-w-full"
        >
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                active === s.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
              aria-current={active === s.id ? 'step' : undefined}
              data-testid={`company-nav-${s.id}`}
              data-section-id={s.id}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
