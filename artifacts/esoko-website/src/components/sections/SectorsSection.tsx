import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { SECTORS_DATA } from '@/data/sectors';

export function SectorsSection() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4"
          >
            Built for Every Sector
          </motion.h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover how Esoko's technology supports organizations and communities across different sectors.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SECTORS_DATA.map((sector, i) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.name}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={`/sectors/${sector.slug}`}
                  className="group flex flex-col h-full p-6 rounded-3xl border border-gray-100 bg-white hover:shadow-xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-6 h-6 text-foreground/70 group-hover:text-emerald-700 transition-colors" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3 group-hover:text-emerald-800 transition-colors">
                    {sector.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 line-clamp-3">
                    {sector.description}
                  </p>
                  <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-focus-visible:translate-x-0 md:group-focus-visible:opacity-100">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/sectors"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-7 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Explore all sectors <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
