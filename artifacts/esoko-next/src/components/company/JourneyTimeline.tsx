'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { TIMELINE } from './CompanyData';

const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Interactive milestone track from source JourneySection. */
export function JourneyTimeline() {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState<number | null>(null);
  return (
    <>
      <div className="overflow-x-auto pb-32 pt-8 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex relative px-8 md:px-16 min-w-max">
          <div className="absolute top-7 left-16 right-16 h-px bg-border" />
          <motion.div
            className="absolute top-7 left-16 right-16 h-[2px] origin-left bg-primary"
            {...(reduced ? { style: { scaleX: 1 } } : { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: { once: true }, transition: { duration: 0.6, ease: 'easeOut' } })}
          />
          {TIMELINE.map((item, i) => (
            <motion.div
              key={item.year}
              {...(reduced
                ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
                : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.65, ease: E, delay: i * 0.1 } })}
              className="relative flex flex-col items-center w-48 flex-shrink-0 group"
            >
              <button
                type="button"
                onClick={() => setActive(prev => prev === i ? null : i)}
                aria-expanded={active === i}
                aria-label={`${item.year}: ${item.title}`}
                data-testid={`timeline-btn-${item.year}`}
                className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  active === i ? 'bg-muted' : 'bg-transparent hover:bg-muted'
                }`}
              >
                <span className={`h-4 w-4 rounded-full border-[3px] transition-colors ${active === i ? 'border-primary bg-secondary' : 'border-primary bg-background'}`} />
              </button>
              <span className={`mt-1 font-heading text-lg font-bold transition-colors ${active === i ? 'text-primary' : 'text-foreground'}`}>{item.year}</span>
              <span className="mt-1 text-base font-semibold text-muted-foreground text-center">{item.title}</span>

              <AnimatePresence>
                {active === i && (
                  <motion.div
                    className="absolute top-24 left-1/2 z-20 w-[min(20rem,calc(100vw-3rem))] -translate-x-1/2 rounded-xl border border-border bg-background p-5 shadow-md"
                    initial={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
                    transition={{ duration: reduced ? 0 : 0.2 }}
                  >
                    <div className="relative mb-4 h-32 overflow-hidden rounded-lg bg-muted">
                      {item.image && <Image src={item.image} alt="" fill sizes="280px" className="object-cover" />}
                    </div>
                    <span className="mb-2 block text-base font-bold text-primary">{item.year}</span>
                    <p className="text-base leading-relaxed text-foreground">{item.detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="mb-8 -mt-10 text-center text-base font-medium text-muted-foreground">Click a milestone to explore</p>
    </>
  );
}
