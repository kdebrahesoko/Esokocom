import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation, useParams, Link } from 'wouter';
import { 
  ArrowRight, ChevronRight, CheckCircle2, Globe2, Building2
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useBookDemo } from '@/context/BookDemoContext';
import { SECTORS_DATA } from '@/data/sectors';
import { SectorStories } from '@/components/sectors/SectorStories';

const EASE = [0.16, 1, 0.3, 1] as const;

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

export default function SectorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { open: openBookDemo } = useBookDemo();
  const reduced = useReducedMotion() ?? false;

  const sector = SECTORS_DATA.find(s => s.slug === slug);

  useEffect(() => {
    if (sector) {
      document.title = `${sector.name} Solutions | Esoko`;
      setMeta('description', sector.seoDescription);
      setMeta('og:title', `${sector.name} Solutions | Esoko`, 'property');
      setMeta('og:description', sector.seoDescription, 'property');
      setMeta('og:type', 'website', 'property');
      setMeta('og:image', sector.heroImage, 'property');
      setMeta('twitter:card', 'summary_large_image');
      setMeta('twitter:title', `${sector.name} Solutions | Esoko`);
      setMeta('twitter:description', sector.seoDescription);
    }
  }, [sector]);

  if (!sector) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Sector not found</h1>
        <Button onClick={() => setLocation('/sectors')}>View all sectors</Button>
      </div>
    );
  }

  const Icon = sector.icon;

  const fadeUp = (delay = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  };

  const revealUp = (delay = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay, ease: EASE },
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      <main>
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-end pb-24 bg-[#051f12] overflow-hidden pt-32">
        <img
          src={sector.heroImage}
          alt={sector.imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/80 to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <motion.div {...fadeUp()} className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-8">
              <Link href="/sectors" className="hover:text-white transition-colors">Sectors</Link>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span className="text-white">{sector.name}</span>
            </motion.div>

            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-[0.15em] mb-6">
              <Icon className="w-3.5 h-3.5" /> {sector.category}
            </motion.div>

            <motion.h1 
              {...fadeUp(0.2)}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-6 tracking-tight"
            >
              {sector.headline}
            </motion.h1>

            <motion.p 
              {...fadeUp(0.3)}
              className="text-lg md:text-xl text-emerald-50/80 max-w-2xl leading-relaxed font-light"
            >
              {sector.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* CONTENT & SIDEBAR */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Main Content */}
            <div className="w-full lg:w-2/3">
              <motion.div {...revealUp()}>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">Primary Use Cases</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                  {sector.useCases.map((uc, i) => (
                    <div key={uc} className="flex items-start gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium leading-snug">{uc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div {...revealUp()}>
                <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">Esoko Capabilities</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  We deploy a combination of our core platforms to deliver solutions specifically tailored for the {sector.name.toLowerCase()} sector.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                  {sector.capabilities.map(cap => {
                    const CapIcon = cap.icon;
                    return (
                      <div key={cap.name} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                          <CapIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{cap.name}</h4>
                          <Link href="/products-services" className="text-xs text-emerald-600 hover:underline font-medium mt-1 inline-block">
                            View Platform
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-28 space-y-8">
                {/* Stats Panel */}
                <motion.div {...revealUp(0.1)} className="bg-gray-900 rounded-3xl p-8 text-white">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6">Sector Impact</h3>
                  <div className="space-y-6">
                    {sector.statistics.map(stat => (
                      <div key={stat.label} className="border-l-2 border-emerald-500/30 pl-4">
                        <div className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Audience Panel */}
                <motion.div {...revealUp(0.2)} className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-800 mb-6">Who We Work With</h3>
                  <ul className="space-y-4">
                    {sector.audience.map(aud => (
                      <li key={aud} className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-emerald-900 font-medium">{aud}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Contact Panel */}
                <motion.div {...revealUp(0.3)} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center">
                  <Globe2 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to transform your operations?</h3>
                  <p className="text-sm text-gray-500 mb-6">Speak with an Esoko expert about our {sector.name.toLowerCase()} solutions.</p>
                  <Button onClick={openBookDemo} className="w-full bg-brand hover:bg-brand/90 text-white rounded-full">
                    Book a Consultation
                  </Button>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CMS-BACKED CUSTOMER STORIES */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <motion.h2 {...revealUp()} className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                Success Stories
              </motion.h2>
              <motion.p {...revealUp(0.1)} className="text-lg text-gray-600 max-w-2xl">
                Verified customer stories are loaded directly from Esoko’s Resources CMS when they are published.
              </motion.p>
            </div>
            <motion.div {...revealUp(0.2)}>
              <Link href="/resources/customer-stories" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                View all case studies <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          <SectorStories />
        </div>
      </section>

      <section className="bg-[#071d12] py-24 text-center text-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl font-bold md:text-5xl">Discuss your {sector.name.toLowerCase()} challenge</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
            Bring Esoko your operating context, programme goals and field constraints. The team will help shape the right combination of platforms and services.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button onClick={openBookDemo} className="rounded-full bg-brand px-8 py-6 text-base font-semibold text-white hover:bg-brand/90">
              Book a Demo
            </Button>
            <Link
              href="/products-services"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-8 py-3 font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore Products &amp; Services <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
