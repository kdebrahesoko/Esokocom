import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

const IMPACT_STATS = [
  { end: 5, suffix: 'M+', label: 'Farmers Reached' },
  { end: 40, suffix: '+', label: 'Countries Served' },
  { end: 10000, suffix: '+', label: 'Projects Completed' },
  { end: 500, suffix: 'M+', label: 'Messages Delivered' },
  { end: 2, suffix: 'M+', label: 'Surveys Conducted' },
  { end: 1, suffix: 'M+', label: 'Women Empowered' },
  { end: 100, suffix: 'K+', label: 'Trees Planted' },
  { end: 500, suffix: '+', label: 'Carbon Projects Enabled' }
];

export function ImpactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="py-24 bg-primary relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            Impact at the Heart of <br className="hidden md:block"/> Everything We Do
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary mb-3 tracking-tighter">
                {inView ? <CountUp end={stat.end} duration={2.5} separator="," /> : '0'}
                {stat.suffix}
              </div>
              <div className="text-white/80 font-medium text-lg uppercase tracking-wider text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
