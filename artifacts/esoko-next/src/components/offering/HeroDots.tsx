'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type Dot = { w: number; h: number; left: number; top: number; duration: number; delay: number };

/** Source animated data-dot grid. Random positions are generated after mount to avoid hydration mismatch. */
export function HeroDots() {
  const reduced = useReducedMotion() ?? false;
  const [dots, setDots] = useState<Dot[]>([]);
  useEffect(() => {
    setDots(Array.from({ length: 28 }).map(() => ({
      w: Math.random() * 4 + 2, h: Math.random() * 4 + 2,
      left: Math.random() * 100, top: Math.random() * 100,
      duration: 4 + Math.random() * 4, delay: Math.random() * 6,
    })));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-emerald-400"
          style={{ width: d.w, height: d.h, left: `${d.left}%`, top: `${d.top}%` }}
          initial={{ opacity: 0 }}
          {...(reduced ? {} : {
            animate: { opacity: [0, 0.6, 0], y: [0, -20, -40] },
            transition: { duration: d.duration, repeat: Infinity, delay: d.delay, ease: 'easeInOut' },
          })}
        />
      ))}
    </div>
  );
}
