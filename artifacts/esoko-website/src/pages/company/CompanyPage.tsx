import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, CloudRain, Thermometer, MessageSquare, MapPin, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { TrustSection } from '@/components/sections/TrustSection';
import { useBookDemo } from '@/context/BookDemoContext';

import { CompanyNav } from './CompanyNav';
import { 
  MissionSection, OverviewSection, ImpactSection, JourneySection, 
  PresenceSection, MarketOpportunitySection, WhyEsokoSection, 
  ProductEcosystemSection, FinalStorySection, ValuesSection
} from './CompanySections';
import { GallerySection } from './GallerySection';
import { TeamSection } from './TeamSection';

// Shared Easing & Motion Helpers
const E: [number, number, number, number] = [0.22, 1, 0.36, 1];
function fp(reduced: boolean, hidden: any, visible: any, delay = 0, duration = 0.65): any {
  if (reduced) return { initial: visible, animate: visible };
  return {
    initial: hidden,
    whileInView: visible,
    viewport: { once: true, margin: '-60px' },
    transition: { duration, ease: E, delay },
  };
}

// Hero Widgets
function WeatherWidget({ reduced }: { reduced: boolean }) {
  return (
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
  );
}

function SMSWidget({ reduced }: { reduced: boolean }) {
  return (
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
  );
}

function MapWidget({ reduced }: { reduced: boolean }) {
  return (
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
  );
}

function AnalyticsWidget({ reduced }: { reduced: boolean }) {
  const bars = [60, 80, 45, 90, 70, 85, 55, 75];
  return (
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
  );
}

export default function CompanyPage() {
  const { open: openBookDemo } = useBookDemo();
  const reduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Handle wouter hash links correctly on mount
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(id))?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      });
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <CompanyNav />
      <main>

      {/* 1. CINEMATIC HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#042B10' }}
      >
        <motion.div className="absolute inset-0" style={reduced ? {} : { y: heroY, opacity: heroOpacity }}>
          <img
            src="/about-hero.jpg"
            alt="Esoko field agent in action"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#042B10]/80 via-[#042B10]/60 to-[#042B10]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#042B10]/60 via-transparent to-[#042B10]/40" />
        </motion.div>

        <WeatherWidget reduced={reduced} />
        <SMSWidget reduced={reduced} />
        <MapWidget reduced={reduced} />
        <AnalyticsWidget reduced={reduced} />

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-36">
          <motion.span
            {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0, 0.5)}
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-6 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20"
          >
            About Esoko
          </motion.span>
          <motion.h1
            {...fp(reduced, { opacity: 0, y: 32 }, { opacity: 1, y: 0 }, 0.1, 0.7)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white max-w-5xl mx-auto leading-[1.08] mb-6"
          >
            Empowering Farmers.<br />
            <span className="bg-gradient-to-r from-emerald-400 to-[#D9531E] bg-clip-text text-transparent">
              Restoring Earth.
            </span>
          </motion.h1>
          <motion.p
            {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.25, 0.65)}
            className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Since 2008, Esoko has been building digital solutions that connect people, data and services to create meaningful impact across Africa.
          </motion.p>
          <motion.div
            {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.38, 0.55)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="company-button-explore-story"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Our Story <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={openBookDemo}
              data-testid="company-button-work-with-esoko"
              className="inline-flex items-center gap-2 border border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              Work With Esoko
            </button>
          </motion.div>
        </div>
      </section>

      <div id="partners" className="scroll-mt-24">
        <TrustSection />
      </div>

      {/* 2. WHO WE ARE INTRO */}
      <section id="about" className="scroll-mt-24 py-24 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div {...fp(reduced, { opacity: 0, x: -30 }, { opacity: 1, x: 0 })} className="lg:col-span-5">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 leading-tight">
                Technology Built Around People.
              </h2>
            </motion.div>
            
            <div className="hidden lg:block lg:col-span-1 h-32 w-px bg-gradient-to-b from-gray-200 to-transparent mx-auto" />
            
            <motion.div {...fp(reduced, { opacity: 0, x: 30 }, { opacity: 1, x: 0 }, 0.2)} className="lg:col-span-6 space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Esoko addresses the complex challenges of agriculture, climate change, and development in Africa by building digital platforms that work where others don't.
              </p>
              <p>
                We believe that connecting rural communities to accurate data, reliable communication, and essential services is the foundation of inclusive economic growth. From farmer advisory via SMS to large-scale biometric registries and agricultural marketplaces, our platforms are designed to bridge the last-mile connectivity gap.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <MissionSection reduced={reduced} />
      <OverviewSection reduced={reduced} />
      <JourneySection reduced={reduced} />
      <ImpactSection reduced={reduced} />
      <PresenceSection reduced={reduced} />
      <TeamSection reduced={reduced} />
      <GallerySection reduced={reduced} />
      
      <MarketOpportunitySection reduced={reduced} />
      <WhyEsokoSection reduced={reduced} />
      <ProductEcosystemSection reduced={reduced} />
      <ValuesSection reduced={reduced} />
      <FinalStorySection reduced={reduced} />

      {/* FINAL CTA */}
      <section className="py-24 bg-[#042B10] text-center px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Let's Create Impact Together.</h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Whether you're looking to deploy technology, build a partnership or explore what Esoko can do for your organisation, let's start a conversation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openBookDemo}
              data-testid="company-button-final-work-with-esoko"
              className="inline-flex items-center gap-2 bg-[#D9531E] hover:bg-[#c84b16] text-white rounded-full px-8 py-4 font-semibold transition-colors"
            >
              Work With Esoko <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/products-services"
              data-testid="company-link-products-services"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-4 font-semibold transition-colors"
            >
              Explore Products & Services
            </Link>
            <Link
              href="/#contact"
              data-testid="company-link-contact"
              className="inline-flex items-center gap-2 border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 rounded-full px-8 py-4 font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
