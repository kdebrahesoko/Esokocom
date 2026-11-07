'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, X } from 'lucide-react';
import { useBookDemo } from '@/components/home/BookDemoContext';
import { EXISTING_CONTACT_HREF } from '@/lib/site-links';

const DISMISSED_KEY = 'esoko_floating_cta_dismissed';

export function FloatingCTA() {
  const { isOpen } = useBookDemo();
  const [visible, setVisible] = useState(false);
  // Deterministic initial state for SSR; session dismissal is read after mount.
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try { setDismissed(sessionStorage.getItem(DISMISSED_KEY) === '1'); }
    catch { setDismissed(false); }
  }, []);
  const contactRef = useRef<Element | null>(null);

  useEffect(() => {
    contactRef.current = document.getElementById('contact');

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = docHeight > 0 ? scrollY / docHeight : 0;

      if (contactRef.current) {
        const rect = contactRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          setVisible(false);
          return;
        }
      }

      setVisible(scrollPct >= 0.4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    try { sessionStorage.setItem(DISMISSED_KEY, '1'); } catch { /* storage unavailable */ }
  };

  // Hidden if: not scrolled far enough, modal already open, or user dismissed
  const shouldShow = visible && !isOpen && !dismissed;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="floating-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed z-50 bottom-6 right-4 sm:bottom-8 sm:right-6 flex items-center"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {/* Handoff: demo booking stays on the existing site's /#contact. */}
          <a
            href={EXISTING_CONTACT_HREF}
            aria-label="Book a Demo on the Esoko website"
            className={[
              'flex items-center gap-2 rounded-full shadow-lg',
              'bg-brand text-white font-semibold',
              'px-5 py-3 text-sm sm:px-6 sm:py-3.5 sm:text-base',
              'min-h-[44px] sm:min-h-[48px]',
              'hover:bg-brand/90 active:scale-95 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
              'rounded-r-none pr-3',
            ].join(' ')}
          >
            <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Book a Demo</span>
          </a>

          {/* Dismiss button — visually attached, separated for a11y */}
          <button
            onClick={handleDismiss}
            type="button"
            aria-label="Dismiss Book a Demo shortcut"
            className={[
              'flex items-center justify-center',
              'bg-brand/80 hover:bg-brand/60 text-white',
              'h-[44px] w-[36px] sm:h-[48px] sm:w-[40px]',
              'rounded-r-full border-l border-white/20',
              'transition-colors active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            ].join(' ')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
