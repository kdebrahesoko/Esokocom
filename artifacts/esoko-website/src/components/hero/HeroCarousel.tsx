import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ArrowRight, Play,
  CloudRain, MessageSquare, Satellite, BrainCircuit,
  MapPin, BarChart2, TrendingUp, Smartphone,
  Leaf, CheckCircle2, Wifi, Signal, CloudLightning,
  Users, Globe2, Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookDemo } from '@/context/BookDemoContext';

/* ─────────────────────────────────────────────────────────────────── */
/*  Constants                                                          */
/* ─────────────────────────────────────────────────────────────────── */

const SLIDE_DURATION = 6000; // ms

/* ─────────────────────────────────────────────────────────────────── */
/*  Slide data                                                         */
/* ─────────────────────────────────────────────────────────────────── */

const SLIDES = [
  {
    id: 0,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80&auto=format&fit=crop',
    imageAlt: 'African farmers working in lush green fields',
    badge: "Africa's #1 Agritech Platform",
    headline: ['Connecting', 'Last-Mile Communities', 'with Digital Innovation'],
    highlightLine: 1,
    sub: 'Esoko bridges the gap between technology and agriculture — empowering governments, NGOs, and agribusinesses with integrated digital tools that reach every farmer, in every village, across Africa.',
    chips: ['Data Collection', 'Digital Advisory', 'Market Access', 'AI Analytics'],
    cta1: { label: 'Explore Platform', href: '#solutions' },
    cta2: { label: 'Watch Demo', href: '#demo' },
    stats: [
      { value: '5M+', label: 'Farmers Reached' },
      { value: '40+', label: 'Countries' },
      { value: '18 Yrs', label: 'Trusted Since 2008' },
    ],
  },
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80&auto=format&fit=crop',
    imageAlt: 'Field agent collecting data on a tablet in rural Africa',
    badge: 'Insyt — Field Operations Platform',
    headline: ['Intelligent Surveys,', 'Beneficiary Registration,', '& Field Operations'],
    highlightLine: 2,
    sub: 'Insyt digitises your entire field operation — from biometric registration and GPS profiling to real-time M&E dashboards. Works fully offline in the most remote communities.',
    chips: ['Offline-First', 'GPS Capture', 'Biometric ID', 'Live Dashboards'],
    cta1: { label: 'Explore Insyt', href: '#solutions' },
    cta2: { label: 'Request Demo', href: '#contact' },
    stats: [
      { value: '2.3M+', label: 'Records Collected' },
      { value: '99.8%', label: 'Data Accuracy' },
      { value: '0 Signal', label: 'Offline Ready' },
    ],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&q=80&auto=format&fit=crop',
    imageAlt: 'Farmer using mobile phone in a field, receiving SMS alerts',
    badge: 'Messaging & Rural Communication',
    headline: ['Reach Millions of', 'Farmers Instantly —', 'In Their Language'],
    highlightLine: 0,
    sub: 'SMS, Voice SMS, IVR, USSD, CATI, and WhatsApp in 30+ local languages. Deliver weather alerts, market prices, pest warnings, and crop advisories at continental scale.',
    chips: ['SMS & Voice', 'IVR / USSD', 'WhatsApp', '30+ Languages'],
    cta1: { label: 'Explore Messaging', href: '#solutions' },
    cta2: { label: 'See Case Studies', href: '#stories' },
    stats: [
      { value: '500M+', label: 'Messages Delivered' },
      { value: '98.4%', label: 'Delivery Rate' },
      { value: '30+', label: 'Local Languages' },
    ],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80&auto=format&fit=crop',
    imageAlt: 'Vibrant African produce market with farmers and buyers',
    badge: 'Marketplace & Digital Farmer Services',
    headline: ['Connecting Farmers', 'Directly to Buyers', '& Digital Markets'],
    highlightLine: 1,
    sub: 'Esoko Marketplace eliminates middlemen — linking verified smallholder farmers to buyers, logistics providers, and financial services. Real prices, real trade, real income growth.',
    chips: ['Direct Trade', 'Live Prices', 'Digital Payments', 'Logistics'],
    cta1: { label: 'Explore Marketplace', href: '#solutions' },
    cta2: { label: 'Become a Partner', href: '#contact' },
    stats: [
      { value: '150K+', label: 'Farmers Connected' },
      { value: '+34%', label: 'Avg. Income Increase' },
      { value: '12', label: 'Commodity Markets' },
    ],
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80&auto=format&fit=crop',
    imageAlt: 'Aerial view of African agricultural landscape at golden hour',
    badge: 'Sustainability & Climate Intelligence',
    headline: ['AI-Powered Climate', 'Intelligence for a', 'Resilient Agriculture'],
    highlightLine: 2,
    sub: 'Combine satellite imagery, AI analytics, and real-time weather data to monitor land use, predict climate risks, support carbon credit programmes, and build genuinely climate-smart farms.',
    chips: ['Satellite Monitoring', 'AI Predictions', 'Carbon Credits', 'Climate Alerts'],
    cta1: { label: 'Explore Climate AI', href: '#solutions' },
    cta2: { label: 'Download Report', href: '#resources' },
    stats: [
      { value: '500K+', label: 'Hectares Monitored' },
      { value: '3', label: 'Satellites Active' },
      { value: '500+', label: 'Carbon Projects' },
    ],
  },
] as const;

/* ─────────────────────────────────────────────────────────────────── */
/*  Floating widgets (per slide)                                       */
/* ─────────────────────────────────────────────────────────────────── */

function Slide0Widgets() {
  return (
    <>
      {/* Live analytics card */}
      <FloatCard className="bottom-28 right-4 md:bottom-36 md:right-8 w-56" delay={0.6} drift={-12}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Live Analytics</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="flex items-end gap-1.5 h-14">
          {[55, 80, 45, 90, 65, 75, 88].map((h, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.07, ease: 'backOut' }}
              style={{ height: `${h}%`, transformOrigin: 'bottom' }}
              className="flex-1 bg-gradient-to-t from-emerald-500/30 to-emerald-400 rounded-sm"
            />
          ))}
        </div>
        <p className="text-[11px] text-white/50 mt-2">Platform activity — last 7 days</p>
      </FloatCard>

      {/* Country badge */}
      <FloatCard className="top-32 right-6 md:top-40 md:right-10 w-44" delay={0.9} drift={10}>
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <div>
            <p className="text-base font-bold text-white leading-none">40+ Countries</p>
            <p className="text-[11px] text-white/60 mt-0.5">Active deployments</p>
          </div>
        </div>
      </FloatCard>

      {/* Farmers counter */}
      <FloatCard className="top-52 right-6 md:top-64 md:right-10 w-44" delay={1.1} drift={-8}>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#F4B400] flex-shrink-0" />
          <div>
            <p className="text-base font-bold text-white leading-none">5M+ Farmers</p>
            <p className="text-[11px] text-white/60 mt-0.5">Reached with Esoko</p>
          </div>
        </div>
      </FloatCard>
    </>
  );
}

function Slide1Widgets() {
  return (
    <>
      {/* GPS card */}
      <FloatCard className="bottom-28 right-4 md:bottom-36 md:right-8 w-52" delay={0.6} drift={-10}>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">GPS Capture</span>
        </div>
        <div className="bg-[#0B6B3A]/40 rounded-lg p-2 relative overflow-hidden">
          {/* Simplified map grid */}
          <div className="grid grid-cols-8 grid-rows-4 gap-px opacity-30">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="bg-white/20 h-3 rounded-[1px]" />
            ))}
          </div>
          {/* GPS pins */}
          {[
            { top: '20%', left: '30%' }, { top: '55%', left: '60%' }, { top: '35%', left: '75%' },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white shadow-lg"
              style={{ top: pos.top, left: pos.left }}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        </div>
        <p className="text-[11px] text-white/50 mt-2">3 agents active in field</p>
      </FloatCard>

      {/* Records badge */}
      <FloatCard className="top-32 right-6 md:top-40 md:right-10 w-48" delay={0.9} drift={12}>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#F4B400] flex-shrink-0" />
          <div>
            <p className="text-base font-bold text-white leading-none">2.3M Records</p>
            <p className="text-[11px] text-white/60 mt-0.5">Collected this season</p>
          </div>
        </div>
      </FloatCard>

      {/* Offline badge */}
      <FloatCard className="top-52 right-6 md:top-64 md:right-10 w-44" delay={1.1} drift={-9}>
        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-white leading-none">Works Offline</p>
            <p className="text-[11px] text-white/60 mt-0.5">Zero connectivity required</p>
          </div>
        </div>
      </FloatCard>
    </>
  );
}

function Slide2Widgets() {
  return (
    <>
      {/* SMS notification bubble */}
      <FloatCard className="bottom-28 right-4 md:bottom-36 md:right-8 w-60" delay={0.6} drift={-10}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[11px] text-white/50 mb-0.5">SMS Alert · Delivered</p>
            <p className="text-xs text-white/90 leading-relaxed">
              "⚠️ Rain expected Thur–Fri. Harvest groundnuts before Wed. — Esoko Advisory"
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] text-white/50">Delivered to 48,200 farmers</span>
        </div>
      </FloatCard>

      {/* Delivery rate */}
      <FloatCard className="top-32 right-6 md:top-40 md:right-10 w-44" delay={0.9} drift={11}>
        <div className="flex items-center gap-2">
          <Signal className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <div>
            <p className="text-base font-bold text-white leading-none">98.4%</p>
            <p className="text-[11px] text-white/60 mt-0.5">Delivery success rate</p>
          </div>
        </div>
      </FloatCard>

      {/* Language badge */}
      <FloatCard className="top-52 right-6 md:top-64 md:right-10 w-44" delay={1.1} drift={-8}>
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-[#F4B400] flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-white leading-none">30+ Languages</p>
            <p className="text-[11px] text-white/60 mt-0.5">Multilingual outreach</p>
          </div>
        </div>
      </FloatCard>
    </>
  );
}

function Slide3Widgets() {
  const prices = [
    { crop: 'Maize', price: 'GH₵ 2.40/kg', change: '+3.2%', up: true },
    { crop: 'Cassava', price: 'GH₵ 1.80/kg', change: '-1.1%', up: false },
    { crop: 'Yam', price: 'GH₵ 4.50/kg', change: '+5.8%', up: true },
  ];
  return (
    <>
      {/* Price ticker */}
      <FloatCard className="bottom-28 right-4 md:bottom-36 md:right-8 w-56" delay={0.6} drift={-10}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#F4B400]" />
          <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Live Prices</span>
        </div>
        <div className="space-y-2">
          {prices.map(p => (
            <div key={p.crop} className="flex items-center justify-between">
              <span className="text-xs text-white/80">{p.crop}</span>
              <span className="text-xs font-medium text-white">{p.price}</span>
              <span className={`text-[11px] font-semibold ${p.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {p.change}
              </span>
            </div>
          ))}
        </div>
      </FloatCard>

      {/* Farmers connected */}
      <FloatCard className="top-32 right-6 md:top-40 md:right-10 w-48" delay={0.9} drift={11}>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-base font-bold text-white leading-none">150K+ Farmers</p>
            <p className="text-[11px] text-white/60 mt-0.5">Marketplace verified</p>
          </div>
        </div>
      </FloatCard>

      {/* Income badge */}
      <FloatCard className="top-52 right-6 md:top-64 md:right-10 w-44" delay={1.1} drift={-9}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#F4B400] flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-white leading-none">+34% Income</p>
            <p className="text-[11px] text-white/60 mt-0.5">Average farm income</p>
          </div>
        </div>
      </FloatCard>
    </>
  );
}

function Slide4Widgets() {
  return (
    <>
      {/* Weather card */}
      <FloatCard className="bottom-28 right-4 md:bottom-36 md:right-8 w-56" delay={0.6} drift={-10}>
        <div className="flex items-center gap-3 mb-3">
          <CloudLightning className="w-6 h-6 text-sky-400" />
          <div>
            <p className="text-sm font-bold text-white">Climate Risk: Low</p>
            <p className="text-[11px] text-white/60">Northern Region · Today</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {[
            { label: 'Rainfall', val: 62, color: 'bg-sky-400' },
            { label: 'Drought Risk', val: 18, color: 'bg-orange-400' },
            { label: 'Pest Pressure', val: 31, color: 'bg-yellow-400' },
          ].map(r => (
            <div key={r.label}>
              <div className="flex justify-between text-[11px] text-white/60 mb-0.5">
                <span>{r.label}</span><span>{r.val}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${r.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.val}%` }}
                  transition={{ duration: 1, delay: 0.9 }}
                />
              </div>
            </div>
          ))}
        </div>
      </FloatCard>

      {/* Satellite badge */}
      <FloatCard className="top-32 right-6 md:top-40 md:right-10 w-46" delay={0.9} drift={12}>
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-white leading-none">3 Satellites</p>
            <p className="text-[11px] text-white/60 mt-0.5">Active monitoring</p>
          </div>
        </div>
      </FloatCard>

      {/* AI insight */}
      <FloatCard className="top-52 right-6 md:top-64 md:right-10 w-52" delay={1.1} drift={-9}>
        <div className="flex items-start gap-2">
          <BrainCircuit className="w-4 h-4 text-[#F4B400] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold text-[#F4B400] mb-0.5">AI INSIGHT</p>
            <p className="text-[11px] text-white/80 leading-relaxed">Optimal planting window: Oct 12–18 for maize in Brong-Ahafo.</p>
          </div>
        </div>
      </FloatCard>
    </>
  );
}

const SLIDE_WIDGETS = [Slide0Widgets, Slide1Widgets, Slide2Widgets, Slide3Widgets, Slide4Widgets];

/* ─────────────────────────────────────────────────────────────────── */
/*  Reusable floating card wrapper                                     */
/* ─────────────────────────────────────────────────────────────────── */

function FloatCard({
  children,
  className = '',
  delay = 0,
  drift = -10,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  drift?: number;
}) {
  return (
    <motion.div
      className={`absolute ${className} bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-20 hidden md:block`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        animate={{ y: [0, drift, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Content stagger variants                                           */
/* ─────────────────────────────────────────────────────────────────── */

const contentContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  exit: { transition: { staggerChildren: 0.05 } },
};
const contentItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.35 } },
};

/* ─────────────────────────────────────────────────────────────────── */
/*  Main Carousel                                                      */
/* ─────────────────────────────────────────────────────────────────── */

const DEMO_CTA_LABELS = new Set(['Request Demo', 'Watch Demo', 'Book a Demo']);

export function HeroCarousel() {
  const { open: openBookDemo } = useBookDemo();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTabVisible = useRef(true);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
    setProgressKey(k => k + 1);
  }, []);

  const advance = useCallback(() => goTo(current + 1), [current, goTo]);
  const retreat = useCallback(() => goTo(current - 1), [current, goTo]);

  /* Autoplay */
  useEffect(() => {
    const start = () => {
      timerRef.current = setInterval(() => {
        if (!isHovered && isTabVisible.current) {
          setCurrent(c => (c + 1) % SLIDES.length);
          setProgressKey(k => k + 1);
        }
      }, SLIDE_DURATION);
    };
    start();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHovered]);

  /* Pause when tab is hidden */
  useEffect(() => {
    const onVisibility = () => { isTabVisible.current = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') retreat();
      if (e.key === 'ArrowRight') advance();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [advance, retreat]);

  const slide = SLIDES[current];
  const WidgetsComponent = SLIDE_WIDGETS[current];

  return (
    <>
      {/* CSS for progress animation & Ken Burns */}
      <style>{`
        @keyframes progressFill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .progress-bar-active {
          transform-origin: left;
          animation: progressFill ${SLIDE_DURATION}ms linear forwards;
        }
        .progress-bar-paused {
          animation-play-state: paused;
        }
      `}</style>

      <section
        className="relative w-full h-screen min-h-[600px] overflow-hidden select-none"
        aria-label="Hero carousel"
        aria-roledescription="carousel"
        aria-live="polite"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid="hero-carousel"
      >
        {/* ── Background images (crossfade + Ken Burns) ── */}
        <AnimatePresence mode="sync">
          <motion.div
            key={`bg-${current}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            {/* Ken Burns zoom */}
            <motion.div
              className="absolute inset-0 will-change-transform"
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 14, ease: 'linear' }}
            >
              <img
                src={slide.image}
                alt={slide.imageAlt}
                loading={current === 0 ? 'eager' : 'lazy'}
                fetchPriority={current === 0 ? 'high' : 'auto'}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>

            {/* Dark gradient overlay ~60% */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Preload next image */}
        <link
          rel="preload"
          as="image"
          href={SLIDES[(current + 1) % SLIDES.length].image}
        />

        {/* ── Floating widgets ── */}
        <AnimatePresence mode="wait">
          <motion.div key={`widgets-${current}`} className="absolute inset-0">
            <WidgetsComponent />
          </motion.div>
        </AnimatePresence>

        {/* ── Main content ── */}
        <div className="relative z-10 h-full flex flex-col justify-center pt-20 pb-36">
          <div className="container mx-auto px-6 md:px-10 max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                variants={contentContainer}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex flex-col gap-5"
              >
                {/* Badge */}
                <motion.div variants={contentItem}>
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-white/90">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={contentItem}
                  className="font-heading font-bold text-white leading-[1.08] tracking-tight"
                  style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)' }}
                >
                  {slide.headline.map((line, i) => (
                    <span key={i} className="block">
                      {i === slide.highlightLine ? (
                        <span className="text-[#F4B400]">{line}</span>
                      ) : line}
                    </span>
                  ))}
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  variants={contentItem}
                  className="text-white/75 max-w-2xl leading-relaxed"
                  style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}
                >
                  {slide.sub}
                </motion.p>

                {/* Feature chips */}
                <motion.div variants={contentItem} className="flex flex-wrap gap-2 mt-1">
                  {slide.chips.map(chip => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-medium text-white/85"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      {chip}
                    </span>
                  ))}
                </motion.div>

                {/* CTAs */}
                <motion.div variants={contentItem} className="flex flex-wrap items-center gap-3 mt-2">
                  <Button
                    size="lg"
                    className="bg-[#C05C0E] hover:bg-[#A84D0A] text-white rounded-full px-8 h-13 text-[0.95rem] font-semibold border-0 shadow-lg shadow-[#C05C0E]/30 group"
                    data-testid="hero-cta-primary"
                  >
                    {slide.cta1.label}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-13 text-[0.95rem] font-semibold bg-transparent group"
                    data-testid="hero-cta-secondary"
                    onClick={DEMO_CTA_LABELS.has(slide.cta2.label) ? openBookDemo : undefined}
                  >
                    <Play className="mr-2 w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    {slide.cta2.label}
                  </Button>
                </motion.div>

                {/* Stat badges */}
                <motion.div variants={contentItem} className="flex flex-wrap items-center gap-5 mt-4 pt-5 border-t border-white/15">
                  {slide.stats.map((s, i) => (
                    <div key={i} className="flex flex-col">
                      <span className="text-xl font-bold text-white font-heading">{s.value}</span>
                      <span className="text-xs text-white/55 mt-0.5">{s.label}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Navigation arrows ── */}
        <button
          onClick={retreat}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label="Previous slide"
          data-testid="carousel-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={advance}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label="Next slide"
          data-testid="carousel-next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ── Progress indicators ── */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
          role="tablist"
          aria-label="Slide navigation"
        >
          {SLIDES.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`relative overflow-hidden rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                i === current
                  ? 'w-12 h-1.5 bg-white/25'
                  : 'w-6 h-1.5 bg-white/30 hover:bg-white/50'
              }`}
              data-testid={`carousel-dot-${i}`}
            >
              {i === current && (
                <span
                  key={progressKey}
                  className={`absolute inset-y-0 left-0 w-full bg-[#C05C0E] progress-bar-active ${
                    isHovered ? 'progress-bar-paused' : ''
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div className="absolute bottom-10 right-6 md:right-10 z-20 text-white/40 text-xs font-medium tabular-nums">
          {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </div>

        {/* ── Scroll hint ── */}
        <motion.div
          className="absolute bottom-10 left-6 md:left-10 z-20 hidden md:flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-transparent to-white/40"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-[11px] text-white/35 uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>
            Scroll
          </span>
        </motion.div>
      </section>
    </>
  );
}
