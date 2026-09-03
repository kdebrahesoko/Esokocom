import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { 
  ArrowRight, ChevronRight, Globe2, BarChart2, ShieldCheck, 
  MapPin, CheckCircle2, ArrowUpRight, Activity, Database, Radio
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useBookDemo } from '@/context/BookDemoContext';
import { SECTORS_DATA } from '@/data/sectors';
import { SectorStories } from '@/components/sectors/SectorStories';

import imgSectorsHero from '@assets/sector-agriculture.webp';
import imgSectorsCta from '@assets/sector-ngos.webp';

// SEO helper
function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

const PUBLIC_SECTORS = SECTORS_DATA.filter(s => s.category === 'Public Sector');
const PRIVATE_SECTORS = SECTORS_DATA.filter(s => s.category === 'Private Sector');
const EASE = [0.16, 1, 0.3, 1] as const;

const OPERATING_CONTEXTS = [
  {
    label: 'Last-mile agriculture',
    title: 'Tools that keep working beyond reliable connectivity',
    description: 'Offline data collection, mobile delivery, messaging and local-language content help programmes reach people where they work.',
    position: 'left-[20%] top-[30%]',
  },
  {
    label: 'National programmes',
    title: 'A connected view of complex public programmes',
    description: 'Registration, field operations, communication and reporting can work as one coordinated digital system.',
    position: 'right-[16%] top-[38%]',
  },
  {
    label: 'Climate resilience',
    title: 'Field evidence for climate-aware decisions',
    description: 'Location data, monitoring and analytics support teams working across agriculture, resilience and environmental programmes.',
    position: 'right-[24%] bottom-[20%]',
  },
  {
    label: 'Rural services',
    title: 'People, services and markets in one flow',
    description: 'Profiles, communications and field data make it easier to connect rural communities with services and opportunities.',
    position: 'left-[25%] bottom-[14%]',
  },
] as const;

const IMPACT_PROOF = [
  { value: '5M+', label: 'Farmers reached' },
  { value: '40+', label: 'Countries served' },
  { value: '500M+', label: 'Messages delivered' },
  { value: '18+', label: 'Years of field experience' },
] as const;

export default function SectorsPage() {
  const { open: openBookDemo } = useBookDemo();
  const [, setLocation] = useLocation();
  const reduced = useReducedMotion() ?? false;
  
  const [activeTab, setActiveTab] = useState<'Public Sector' | 'Private Sector'>('Public Sector');
  const [activeSectorId, setActiveSectorId] = useState<string>(PUBLIC_SECTORS[0].id);
  const [activeContext, setActiveContext] = useState(0);

  const activeSectorsList = activeTab === 'Public Sector' ? PUBLIC_SECTORS : PRIVATE_SECTORS;
  const activeSector = SECTORS_DATA.find(s => s.id === activeSectorId) || SECTORS_DATA[0];

  useEffect(() => {
    document.title = 'Sectors | Esoko — Digital Solutions Built for Real-World Impact';
    const description = 'Explore Esoko digital solutions for agriculture, government, development, education, climate, finance, energy and supply chains across Africa.';
    setMeta('description', description);
    setMeta('og:title', 'Sectors | Esoko', 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:image', imgSectorsHero, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', 'Sectors | Esoko');
    setMeta('twitter:description', description);
    return () => { document.title = 'Esoko — Agricultural Market Data & Advisory Services'; };
  }, []);

  // Sync first sector when tab changes
  useEffect(() => {
    setActiveSectorId(activeTab === 'Public Sector' ? PUBLIC_SECTORS[0].id : PRIVATE_SECTORS[0].id);
  }, [activeTab]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

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
      <section className="relative min-h-[95vh] flex items-center bg-[#051f12] overflow-hidden pt-20">
        <img
          src={imgSectorsHero}
          alt="Two African farmers reviewing agricultural information together on a smartphone"
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#051f12]/95 via-[#0B4D2E]/80 to-transparent" />
        
        {/* Tech overlay elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] left-[15%] w-72 h-72 bg-brand/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-24">
          <div className="max-w-4xl">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-[0.15em] mb-8">
              <Globe2 className="w-3.5 h-3.5" /> Sectors
            </motion.div>

            <motion.h1 
              {...fadeUp(0.1)}
              className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-6 tracking-tight"
            >
              Digital Solutions Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Real-World Impact</span>
            </motion.h1>

            <motion.p 
              {...fadeUp(0.2)}
              className="text-lg md:text-xl text-emerald-50/80 max-w-2xl mb-10 leading-relaxed font-light"
            >
              From farms and financial services to government programmes, climate action, education and supply chains, Esoko connects people, data and services across Africa.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center gap-4">
              <Button 
                onClick={() => scrollTo('explorer')}
                className="rounded-full px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base h-auto shadow-xl shadow-emerald-900/40"
              >
                Explore Sectors <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button 
                onClick={openBookDemo}
                variant="outline"
                className="rounded-full px-8 py-4 border-white/25 text-white hover:bg-white/10 bg-transparent font-semibold text-base h-auto"
              >
                Talk to Esoko
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.button
          onClick={() => scrollTo('explorer')}
          aria-label="Scroll to sector explorer"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/80 transition-colors"
          {...(reduced ? {} : { animate: { y: [0, 8, 0] }, transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } })}
        >
          <ChevronRight className="w-8 h-8 rotate-90" />
        </motion.button>
      </section>

      {/* INTERACTIVE SECTOR EXPLORER */}
      <section id="explorer" className="py-24 md:py-32 bg-gray-50 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-16">
            <motion.h2 {...revealUp()} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Explore Our Sectors
            </motion.h2>
            <motion.p {...revealUp(0.1)} className="text-xl text-gray-600 leading-relaxed font-light">
              Discover how Esoko's technology supports organizations and communities across different sectors.
            </motion.p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Nav */}
            <div className="w-full lg:w-1/3 flex-shrink-0">
              <motion.div {...revealUp(0.2)} className="sticky top-28">
                {/* Tabs */}
                <div className="flex p-1.5 bg-gray-200/50 rounded-2xl mb-8">
                  <button 
                    onClick={() => setActiveTab('Public Sector')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'Public Sector' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Public Sector
                  </button>
                  <button 
                    onClick={() => setActiveTab('Private Sector')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === 'Private Sector' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Private Sector
                  </button>
                </div>

                {/* Sector List */}
                <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 hide-scrollbar">
                  {activeSectorsList.map(sector => {
                    const isActive = activeSectorId === sector.id;
                    const Icon = sector.icon;
                    return (
                      <button
                        key={sector.id}
                        onClick={() => setActiveSectorId(sector.id)}
                        className={`flex-shrink-0 lg:flex-shrink w-auto lg:w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all ${
                          isActive 
                            ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20 translate-x-0 lg:translate-x-2' 
                            : 'bg-white border border-gray-100 text-gray-700 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-800'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-white/15' : 'bg-gray-50'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold">{sector.name}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Content Panel */}
            <div className="w-full lg:w-2/3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSector.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden group">
                    <img 
                      src={activeSector.heroImage} 
                        alt={activeSector.imageAlt}
                        loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-3">
                        {activeSector.category}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-heading font-bold text-white">
                        {activeSector.headline}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 md:p-10">
                    <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                      {activeSector.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Use cases */}
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-600" /> Use Cases
                        </h4>
                        <ul className="space-y-3">
                          {activeSector.useCases.slice(0, 6).map(uc => (
                            <li key={uc} className="flex items-start gap-3 text-gray-600">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{uc}</span>
                            </li>
                          ))}
                          {activeSector.useCases.length > 6 && (
                            <li className="text-sm text-emerald-600 font-medium pl-8">
                              + {activeSector.useCases.length - 6} more applications
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Capabilities */}
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5 flex items-center gap-2">
                          <Database className="w-4 h-4 text-emerald-600" /> Esoko Capabilities
                        </h4>
                        <div className="grid grid-cols-1 gap-3">
                          {activeSector.capabilities.map(cap => {
                            const CapIcon = cap.icon;
                            return (
                              <div key={cap.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                                  <CapIcon className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-gray-800 text-sm">{cap.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Stats strip inside card */}
                    <div className="mt-10 py-6 border-t border-b border-gray-100 grid grid-cols-3 gap-4">
                      {activeSector.statistics.map(stat => (
                        <div key={stat.label}>
                          <div className="text-2xl md:text-3xl font-heading font-bold text-emerald-800">{stat.value}</div>
                          <div className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <Button 
                        onClick={() => setLocation(`/sectors/${activeSector.slug}`)}
                        className="w-full sm:w-auto rounded-full px-8 py-6 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-base flex items-center justify-center gap-2 group"
                      >
                        {activeSector.cta}
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* AFRICA OPERATING-CONTEXT EXPLORER */}
      <section className="py-24 bg-white overflow-hidden border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.p {...revealUp()} className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-3">
              Technology Across Africa
            </motion.p>
            <motion.h2 {...revealUp(0.1)} className="text-3xl md:text-5xl font-heading font-bold text-gray-900">
              Scaling Impact Where It Matters
            </motion.h2>
          </div>

          <div className="relative max-w-5xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-16 border border-gray-100 flex flex-col md:flex-row items-center gap-12">
            <motion.div {...revealUp(0.2)} className="relative aspect-square w-full max-w-[430px] md:w-1/2">
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
                  className={`absolute ${context.position} h-5 w-5 rounded-full border-4 border-white shadow-lg transition focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
                    activeContext === index ? 'scale-125 bg-gold' : 'bg-emerald-700 hover:scale-110'
                  }`}
                  aria-label={`Show ${context.label} context`}
                />
              ))}
            </motion.div>

            <motion.div {...revealUp(0.4)} className="w-full md:w-1/2 space-y-6" aria-live="polite">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Selected context</p>
              <h3 className="text-2xl font-bold font-heading text-gray-900">{OPERATING_CONTEXTS[activeContext].title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {OPERATING_CONTEXTS[activeContext].description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {OPERATING_CONTEXTS.map((context, index) => (
                  <button
                    key={context.label}
                    type="button"
                    onClick={() => setActiveContext(index)}
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
        </div>
      </section>

      <section className="bg-[#071d12] py-24 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">Verified impact</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Built on years of work in the field</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                These organisation-wide figures are already published across Esoko’s website and are not sector-specific estimates.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 lg:grid-cols-4">
              {IMPACT_PROOF.map((stat) => (
                <div key={stat.label} className="bg-white/[0.04] p-6 md:p-8">
                  <p className="text-3xl font-bold text-white md:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-sm leading-snug text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTOR TO SOLUTION MATRIX */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 {...revealUp()} className="text-3xl md:text-5xl font-heading font-bold mb-6">
              One Platform. Multiple Sectors.
            </motion.h2>
            <motion.p {...revealUp(0.1)} className="text-xl text-gray-400 font-light">
              How Esoko products support different industries.
            </motion.p>
          </div>

          <div className="overflow-x-auto pb-8 hide-scrollbar">
            <motion.div {...revealUp(0.2)} className="min-w-[800px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 px-6 border-b border-gray-800 text-gray-400 font-semibold w-1/4">Sector</th>
                    <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">Insyt</th>
                    <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">Messaging</th>
                    <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">E-Content</th>
                    <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">Marketplace</th>
                    <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">AI Analytics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {SECTORS_DATA.map((sector, i) => (
                    <motion.tr 
                      key={sector.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-5 px-6 font-medium text-gray-200">{sector.name}</td>
                      <td className="py-5 px-4 text-center">
                        {sector.capabilities.some(c => c.name.includes('Insyt') || c.name.includes('Data Collection') || c.name.includes('Farmer Data')) && (
                          <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                        )}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {sector.capabilities.some(c => c.name.includes('Messaging') || c.name.includes('Voice')) && (
                          <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                        )}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {sector.capabilities.some(c => c.name.includes('E-Content')) && (
                          <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                        )}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {sector.capabilities.some(c => c.name.includes('Marketplace') || c.name.includes('Commerce')) && (
                          <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                        )}
                      </td>
                      <td className="py-5 px-4 text-center">
                        {sector.capabilities.some(c => c.name.includes('AI') || c.name.includes('Analytics') || c.name.includes('Intelligence')) && (
                          <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY ESOKO (Universal Capabilities) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <motion.h2 {...revealUp()} className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Enterprise Ready for Any Sector
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MapPin, title: 'Built for the Last Mile', desc: 'Designed for challenging connectivity and real-world field environments. Fully offline capable.' },
              { icon: Database, title: 'Data at Scale', desc: 'Capture and manage massive volumes of field data with complex organizational hierarchies.' },
              { icon: BarChart2, title: 'AI & Intelligence', desc: 'Turn raw field data into actionable insights with built-in analytics and predictive models.' },
              { icon: ShieldCheck, title: 'Secure by Design', desc: 'Role-aware workflows and scalable platform foundations for complex institutional programmes.' }
            ].map((cap, i) => (
              <motion.div
                key={cap.title}
                {...revealUp(i * 0.1)}
                className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                  <cap.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{cap.title}</h3>
                <p className="text-gray-600 leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-50/60 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Customer evidence</p>
            <h2 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">Stories from the field</h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Published customer stories are loaded directly from Esoko’s Resources CMS.
            </p>
          </div>
          <SectorStories />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 bg-[#051f12] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${imgSectorsCta})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/80 to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.h2 {...revealUp()} className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            Your Sector. Your Challenge.<br/>
            <span className="text-emerald-400">Our Technology.</span>
          </motion.h2>
          <motion.p {...revealUp(0.1)} className="text-xl text-emerald-50/70 max-w-2xl mx-auto mb-10 font-light">
            Tell us what you're trying to achieve and we'll help you design the right digital solution for your specific operational context.
          </motion.p>
          <motion.div {...revealUp(0.2)} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-8 py-3 text-lg font-semibold text-white hover:bg-brand/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Talk to Esoko
            </Link>
            <Link
              href="/products-services"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-lg font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explore Products
            </Link>
            <Button
              onClick={openBookDemo}
              className="rounded-full bg-white px-8 py-6 text-lg font-semibold text-emerald-950 hover:bg-emerald-50"
            >
              Book a Demo
            </Button>
          </motion.div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
