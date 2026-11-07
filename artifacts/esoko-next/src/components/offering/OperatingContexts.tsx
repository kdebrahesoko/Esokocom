'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { OPERATING_CONTEXTS } from '@/data/sectors-page';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Source Africa operating-context explorer (map pins + chips). */
export function OperatingContexts() {
  const reduced = useReducedMotion() ?? false;
  const [activeContext, setActiveContext] = useState(0);
  const reveal = (delay: number) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: EASE },
  };

  return (
    <div className="relative max-w-5xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-16 border border-gray-100 flex flex-col md:flex-row items-center gap-12">
      <motion.div {...reveal(0.2)} className="relative aspect-square w-full max-w-[430px] md:w-1/2">
        <svg viewBox="0 0 420 480" className="h-full w-full drop-shadow-xl" role="img" aria-label="Stylized outline of Africa used to explore operating contexts">
          <defs>
            <linearGradient id="africa-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d1fae5" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
          </defs>
          <path
            d="M177 24 237 38l43 32 58 18 35 43-31 30-19 68-36 36-10 65-32 30-19 79-35 23-26-74-34-47-28-57-4-58-30-35-7-64 35-42 40-14 40-47Z"
            fill="url(#africa-fill)"
            stroke="#047857"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>

        {OPERATING_CONTEXTS.map((context, index) => (
          <button
            key={context.label}
            type="button"
            onClick={() => setActiveContext(index)}
            aria-pressed={activeContext === index}
            data-testid={`button-context-pin-${index}`}
            className={`absolute ${context.position} h-5 w-5 rounded-full border-4 border-white shadow-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
              activeContext === index ? 'scale-125 bg-gold' : 'bg-emerald-700 hover:scale-110'
            }`}
            aria-label={`Show ${context.label} context`}
          />
        ))}
      </motion.div>

      <motion.div {...reveal(0.4)} className="w-full md:w-1/2 space-y-6" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Selected context</p>
        <h3 className="text-2xl font-bold font-heading text-gray-900">{OPERATING_CONTEXTS[activeContext].title}</h3>
        <p className="text-gray-600 leading-relaxed">{OPERATING_CONTEXTS[activeContext].description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {OPERATING_CONTEXTS.map((context, index) => (
            <button
              key={context.label}
              type="button"
              onClick={() => setActiveContext(index)}
              data-testid={`button-context-${index}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeContext === index ? 'bg-emerald-800 text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
              }`}
            >
              {context.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
