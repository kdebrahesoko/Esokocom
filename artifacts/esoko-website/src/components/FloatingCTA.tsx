import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { useBookDemo } from '@/context/BookDemoContext';

export function FloatingCTA() {
  const { open } = useBookDemo();
  const [visible, setVisible] = useState(false);
  const contactRef = useRef<Element | null>(null);

  useEffect(() => {
    // Cache the contact section element once
    contactRef.current = document.getElementById('contact');

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPct = docHeight > 0 ? scrollY / docHeight : 0;

      // Hide when contact section is in view
      if (contactRef.current) {
        const rect = contactRef.current.getBoundingClientRect();
        const contactVisible = rect.top < window.innerHeight * 0.85;
        if (contactVisible) {
          setVisible(false);
          return;
        }
      }

      // Show after 40% scroll depth
      setVisible(scrollPct >= 0.4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case page is already scrolled
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    // Open the booking modal
    open();
    // Also scroll to contact section smoothly
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="floating-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={handleClick}
          aria-label="Book a Demo"
          className={[
            'fixed z-50 flex items-center gap-2 rounded-full shadow-lg',
            'bg-brand text-white font-semibold',
            'px-5 py-3 text-sm',
            'sm:px-6 sm:py-3.5 sm:text-base',
            // Mobile: sits above browser chrome / safe area
            'bottom-6 right-4',
            'sm:bottom-8 sm:right-6',
            // Touch target is at least 44 px tall on mobile
            'min-h-[44px] sm:min-h-[48px]',
            'hover:bg-brand/90 active:scale-95 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          ].join(' ')}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>Book a Demo</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
