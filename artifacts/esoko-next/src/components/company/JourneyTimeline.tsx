'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
          <div className="absolute top-7 left-16 right-16 h-px bg-gray-200" />
          <motion.div
            className="absolute top-7 left-16 h-[2px] bg-gradient-to-r from-emerald-500 to-[#D9531E]"
            {...(reduced ? { style: { width: 'calc(100% - 8rem)' } } : { initial: { width: 0 }, whileInView: { width: 'calc(100% - 8rem)' }, viewport: { once: true }, transition: { duration: 2.4, ease: 'easeOut' } })}
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
                className={`relative z-10 w-5 h-5 rounded-full border-[3px] transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500 ${
                  active === i ? 'bg-white border-[#D9531E] scale-125 shadow-[0_0_20px_rgba(217,83,30,0.4)]' : 'bg-white border-emerald-500 group-hover:scale-110 group-hover:shadow-lg'
                }`}
              />
              <span className={`mt-4 text-lg font-heading font-bold transition-colors ${active === i ? 'text-[#D9531E]' : 'text-gray-900'}`}>{item.year}</span>
              <span className="text-sm font-semibold mt-1 text-gray-500 text-center">{item.title}</span>

              <AnimatePresence>
                {active === i && (
                  <motion.div
                    className="absolute top-24 left-1/2 -translate-x-1/2 w-[320px] bg-white border border-gray-100 rounded-2xl p-5 z-20 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative h-32 mb-4 rounded-xl overflow-hidden bg-gray-100">
                      {item.image && <Image src={item.image} alt="" fill sizes="280px" className="object-cover" />}
                    </div>
                    <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest block mb-2">{item.year}</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.detail}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
      <p className="text-center text-gray-400 text-sm font-medium -mt-10 mb-8">Click a milestone to explore</p>
    </>
  );
}
