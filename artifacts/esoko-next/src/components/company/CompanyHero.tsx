'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { CloudRain, Thermometer, MessageSquare, MapPin, TrendingUp } from 'lucide-react';

/** Hero section shell: parallax layer + floating widgets. Background image and copy arrive as server-rendered props. */
export function CompanyHero({ background, children }: { background: ReactNode; children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bars = [60, 80, 45, 90, 70, 85, 55, 75];

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#042B10' }}>
      <motion.div className="absolute inset-0" style={reduced ? {} : { y: heroY, opacity: heroOpacity }}>
        {background}
      </motion.div>

      <motion.div
        className="absolute top-28 right-[7%] hidden xl:block w-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
        animate={reduced ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CloudRain className="w-4 h-4 text-blue-300" />
          <span className="text-white/70 text-xs font-medium">Accra, Ghana</span>
        </div>
        <div className="flex items-end gap-1">
          <Thermometer className="w-5 h-5 text-amber-400 mb-0.5" />
          <span className="text-white text-base font-bold">Field conditions</span>
        </div>
        <p className="text-white/40 text-[10px] mt-1">Illustrative service view</p>
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-[5%] hidden xl:block w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
        animate={reduced ? {} : { y: [0, 10, 0] }}
        transition={{ duration: 7, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-emerald-500/30 flex items-center justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <span className="text-white text-xs font-semibold">Price Alert</span>
        </div>
        <p className="text-white/70 text-xs leading-relaxed">Advisory prepared<br />Delivery channel selected</p>
      </motion.div>

      <motion.div
        className="absolute top-36 left-[4%] hidden xl:block w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
        animate={reduced ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 8, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-3.5 h-3.5 text-[#D9531E]" />
          <span className="text-white/70 text-xs font-medium">Field operations</span>
        </div>
        <p className="text-white/50 text-[10px] mt-2">Illustrative mapping view</p>
      </motion.div>

      <motion.div
        className="absolute bottom-44 right-[5%] hidden xl:block w-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
        animate={reduced ? {} : { y: [0, 12, 0] }}
        transition={{ duration: 9, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-white text-xs font-semibold">Programme insights</span>
        </div>
        <div className="flex items-end gap-1 h-14">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400"
              style={{ height: `${h}%` }}
              initial={reduced ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
            />
          ))}
        </div>
      </motion.div>

      {children}
    </section>
  );
}
