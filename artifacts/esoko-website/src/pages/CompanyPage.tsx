import { useState, useEffect, useRef } from 'react';
import {
  motion, AnimatePresence, useScroll, useTransform,
  useInView, useReducedMotion,
} from 'framer-motion';
import {
  ArrowRight, ChevronDown, Play, Linkedin, Mail,
  Globe2, Users, Leaf, Zap, CloudRain, Thermometer,
  MessageSquare, TrendingUp, MapPin, Lightbulb,
  ShieldCheck, Handshake, Sparkles, TreePine, Star,
  BarChart2,
} from 'lucide-react';
import { Link } from 'wouter';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { TrustSection } from '@/components/sections/TrustSection';
import { useBookDemo } from '@/context/BookDemoContext';

/* ── Easing ──────────────────────────────────────────────────────────── */
const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── Helper: returns safe motion props gated on reduced-motion ────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fp(reduced: boolean, hidden: any, visible: any, delay = 0, duration = 0.65): any {
  if (reduced) return { initial: visible, animate: visible };
  return {
    initial: hidden,
    whileInView: visible,
    viewport: { once: true, margin: '-60px' },
    transition: { duration, ease: E, delay },
  };
}

/* ── Count-up hook ───────────────────────────────────────────────────── */
function useCountUp(target: number, inView: boolean, reduced: boolean, duration = 1800) {
  const [val, setVal] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced) { setVal(target); return; }
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduced]);
  return val;
}

/* ── Data ────────────────────────────────────────────────────────────── */
const IMPACT_STATS = [
  { num: 2, unit: 'M+', label: 'Farmers Reached',   icon: Users,    glow: '#059669' },
  { num: 18, unit: '+', label: 'Years of Impact',    icon: Star,     glow: '#D9531E' },
  { num: 58, unit: '',  label: 'Value Chains',       icon: Leaf,     glow: '#16a34a' },
  { num: 10, unit: '+', label: 'Countries',          icon: Globe2,   glow: '#2563EB' },
  { num: 150, unit: '+', label: 'Programmes',        icon: Zap,      glow: '#D97706' },
];

const TIMELINE = [
  { year: '2008', title: 'Founded',               detail: 'Launched SMS crop price alerts, connecting smallholder farmers in Ghana with real-time market data for the first time.' },
  { year: '2010', title: 'Market Network',         detail: "Built Ghana's first agricultural market price network, giving thousands of farmers daily commodity pricing across regions." },
  { year: '2013', title: 'Continental Expansion',  detail: 'Expanded into 10+ African countries, scaling field data collection and advisory services across diverse agricultural ecosystems.' },
  { year: '2016', title: 'Voice & IVR',            detail: 'Launched Voice & IVR platform supporting 15 local languages — bridging the literacy gap and reaching last-mile communities.' },
  { year: '2018', title: 'Social Protection',      detail: 'Digitised large-scale social protection programmes, managing beneficiary registries and government-to-farmer payments at national scale.' },
  { year: '2022', title: 'Marketplace',            detail: 'Launched a Digital Marketplace connecting smallholder farmers directly to certified buyers, financial institutions, and input suppliers.' },
  { year: '2024', title: 'AI Platform',            detail: 'Introduced AI & Digital Agriculture Platform with satellite imagery, predictive analytics, and automated agronomic advisory.' },
  { year: '2026+', title: 'Rural Infrastructure', detail: 'National Rural Infrastructure rollout — bringing digital identity, connectivity, and services to the most remote farming communities in Africa.' },
];

const TEAM = [
  { initials: 'BG', name: 'Brian Gyamfi',        role: 'Chief Executive Officer',        bio: 'Visionary entrepreneur with 18+ years transforming African agriculture through digital innovation and strategic partnerships.', grad: 'from-[#D9531E] to-[#C84B16]' },
  { initials: 'KM', name: 'Dr. Kwame Mensah',    role: 'Chief Technology Officer',       bio: 'PhD in Computer Science. Architect of Esoko\'s AI platform, satellite analytics engine, and offline-first mobile infrastructure.', grad: 'from-blue-500 to-blue-700' },
  { initials: 'AA', name: 'Ama Asante',          role: 'Chief Operating Officer',        bio: 'Operations leader driving delivery excellence across 10+ countries, managing complex multi-stakeholder development programmes.', grad: 'from-emerald-500 to-green-700' },
  { initials: 'DE', name: 'Daniel Eshun',        role: 'Director of Engineering',        bio: 'Full-stack engineering leader overseeing Esoko\'s core platform, mobile apps, and API infrastructure serving millions of users.', grad: 'from-purple-500 to-purple-700' },
  { initials: 'FO', name: 'Fatima Ouedraogo',    role: 'Director of Operations',         bio: 'Programme management specialist with expertise in large-scale beneficiary registration and government digital transformation.', grad: 'from-amber-500 to-orange-600' },
  { initials: 'PK', name: 'Philip Kojo',         role: 'Director of Product',            bio: 'Human-centred product designer bringing Esoko\'s farmer-first philosophy to every feature, flow, and user interface.', grad: 'from-cyan-500 to-teal-600' },
  { initials: 'SA', name: 'Serena Abbiw',        role: 'Director of Partnerships',       bio: 'International development specialist managing Esoko\'s relationships with donors, governments, and agribusiness partners.', grad: 'from-rose-500 to-pink-600' },
  { initials: 'CK', name: 'Charles Kofi',        role: 'Chief Finance Officer',          bio: 'Finance leader with 15+ years in tech and development finance, overseeing Esoko\'s financial strategy and investor relations.', grad: 'from-slate-500 to-slate-700' },
];

const VALUES = [
  { icon: Lightbulb,  title: 'Innovation',     desc: 'We build transformative technology that solves real problems for farming communities across Africa.',         grad: 'from-amber-400 to-orange-500' },
  { icon: ShieldCheck, title: 'Integrity',     desc: 'We act with transparency, honesty, and accountability in every partnership and programme we deliver.',       grad: 'from-emerald-400 to-green-600' },
  { icon: Zap,        title: 'Impact',         desc: 'Every decision is measured against one question: does it meaningfully improve the lives of farmers?',        grad: 'from-blue-400 to-blue-600' },
  { icon: Handshake,  title: 'Collaboration',  desc: 'We build long-term, trust-based partnerships — with governments, NGOs, donors, and farming communities.',    grad: 'from-purple-400 to-violet-600' },
  { icon: Users,      title: 'Diversity',      desc: 'A team of 30+ nationalities, with women in leadership — our diversity is our strength and competitive edge.', grad: 'from-rose-400 to-pink-600' },
  { icon: TreePine,   title: 'Sustainability', desc: 'We design for the long term — climate-smart agriculture, carbon programmes, and regenerative farming practices.', grad: 'from-teal-400 to-emerald-600' },
];

/* ── Floating hero widgets ───────────────────────────────────────────── */
function WeatherWidget({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="absolute top-28 right-[7%] hidden xl:block w-52 bg-glass rounded-2xl p-4 shadow-2xl"
      animate={reduced ? {} : { y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <CloudRain className="w-4 h-4 text-blue-300" />
        <span className="text-white/70 text-xs font-medium">Accra, Ghana</span>
      </div>
      <div className="flex items-end gap-1">
        <Thermometer className="w-5 h-5 text-amber-400 mb-0.5" />
        <span className="text-white text-2xl font-bold">28°C</span>
        <span className="text-white/50 text-xs ml-1 mb-1">Partly cloudy</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400" />
      </div>
      <p className="text-white/40 text-[10px] mt-1">Good planting conditions</p>
    </motion.div>
  );
}

function SMSWidget({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="absolute bottom-40 left-[5%] hidden xl:block w-56 bg-glass rounded-2xl p-4 shadow-2xl"
      animate={reduced ? {} : { y: [0, 10, 0] }}
      transition={{ duration: 7, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-emerald-500/30 flex items-center justify-center">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
        </div>
        <span className="text-white text-xs font-semibold">Price Alert</span>
        <span className="ml-auto text-white/40 text-[10px]">Just now</span>
      </div>
      <p className="text-white/70 text-xs leading-relaxed">
        Maize: GHS 320/bag ↑8%<br />
        Tomato: GHS 45/crate ↓3%<br />
        Cassava: GHS 180/bag →
      </p>
    </motion.div>
  );
}

function MapWidget({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      className="absolute top-36 left-[4%] hidden xl:block w-48 bg-glass rounded-2xl p-4 shadow-2xl"
      animate={reduced ? {} : { y: [0, -8, 0] }}
      transition={{ duration: 8, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-3.5 h-3.5 text-brand" />
        <span className="text-white/70 text-xs font-medium">Active Farms</span>
      </div>
      <div className="relative h-24 rounded-lg overflow-hidden bg-emerald-900/40">
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-5 gap-px p-1">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className={`rounded-sm ${i % 7 === 0 ? 'bg-emerald-400/60' : i % 5 === 0 ? 'bg-amber-400/40' : 'bg-white/5'}`} />
          ))}
        </div>
        <div className="absolute bottom-1 right-1 text-[9px] text-white/40">Northern Ghana</div>
      </div>
      <p className="text-white/50 text-[10px] mt-2">1,247 farms active today</p>
    </motion.div>
  );
}

function AnalyticsWidget({ reduced }: { reduced: boolean }) {
  const bars = [60, 80, 45, 90, 70, 85, 55, 75];
  return (
    <motion.div
      className="absolute bottom-44 right-[5%] hidden xl:block w-52 bg-glass rounded-2xl p-4 shadow-2xl"
      animate={reduced ? {} : { y: [0, 12, 0] }}
      transition={{ duration: 9, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span className="text-white text-xs font-semibold">Yield Analytics</span>
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
      <p className="text-white/40 text-[10px] mt-2">+23% avg yield improvement</p>
    </motion.div>
  );
}

/* ── Impact stat counter card ────────────────────────────────────────── */
function ImpactCard({ stat, inView, reduced, delay }: {
  stat: typeof IMPACT_STATS[0]; inView: boolean; reduced: boolean; delay: number;
}) {
  const Icon = stat.icon;
  const count = useCountUp(stat.num, inView, reduced);
  return (
    <motion.div
      {...fp(reduced, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, delay)}
      className="flex flex-col items-center text-center px-6 py-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/25 transition-colors"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${stat.glow}22`, boxShadow: `0 0 24px ${stat.glow}44` }}
      >
        <Icon className="w-7 h-7" style={{ color: stat.glow }} />
      </div>
      <p className="text-4xl md:text-5xl font-heading font-bold text-white">
        {count}{stat.unit}
      </p>
      <p className="text-white/50 text-sm mt-1">{stat.label}</p>
    </motion.div>
  );
}

/* ── Team profile card ───────────────────────────────────────────────── */
function TeamCard({ member, delay, reduced }: {
  member: typeof TEAM[0]; delay: number; reduced: boolean;
}) {
  return (
    <motion.div
      {...fp(reduced, { opacity: 0, y: 28 }, { opacity: 1, y: 0 }, delay)}
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:border-white/25"
    >
      {/* Portrait placeholder with gradient */}
      <div className={`relative h-52 bg-gradient-to-br ${member.grad} flex items-center justify-center overflow-hidden`}>
        <span className="text-5xl font-heading font-bold text-white/90 select-none z-10">
          {member.initials}
        </span>
        {/* Decorative circles */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-white/10" />
        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-5">
        <p className="font-heading font-bold text-white text-lg leading-snug">{member.name}</p>
        <p className={`text-xs font-semibold mt-0.5 mb-3 bg-gradient-to-r ${member.grad} bg-clip-text text-transparent`}>
          {member.role}
        </p>
        <p className="text-white/55 text-xs leading-relaxed line-clamp-3">{member.bio}</p>

        {/* Social icons — fade in on hover */}
        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            aria-label={`${member.name} LinkedIn`}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <Linkedin className="w-4 h-4 text-white/70" />
          </button>
          <button
            aria-label={`Email ${member.name}`}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <Mail className="w-4 h-4 text-white/70" />
          </button>
          <span className="ml-auto text-[10px] text-white/30 font-medium">View Profile →</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Values card ─────────────────────────────────────────────────────── */
function ValueCard({ v, delay, reduced }: {
  v: typeof VALUES[0]; delay: number; reduced: boolean;
}) {
  const Icon = v.icon;
  return (
    <motion.div
      {...fp(reduced, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1 }, delay)}
      className="group relative bg-white rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.grad} flex items-center justify-center mb-5 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="font-heading font-bold text-gray-900 text-lg mb-2">{v.title}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
    </motion.div>
  );
}

/* ── Interactive Timeline ────────────────────────────────────────────── */
function OurJourney({ reduced }: { reduced: boolean }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="journey" className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #061a0d 0%, #0a2010 50%, #061a0d 100%)' }}>
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
            Our Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            18 Years of African Agricultural Innovation
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-base">
            From a single SMS service to a continent-wide digital agriculture platform — every milestone built on the last.
          </p>
        </motion.div>

        {/* Scrollable horizontal timeline */}
        <div className="overflow-x-auto pb-32 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex relative px-8 md:px-16 min-w-max">
            {/* Track */}
            <div className="absolute top-7 left-16 right-16 h-px bg-white/10" />
            <motion.div
              className="absolute top-7 left-16 h-px bg-gradient-to-r from-emerald-500 to-[#D9531E]"
              {...(reduced
                ? { style: { width: 'calc(100% - 8rem)' } }
                : { initial: { width: 0 }, whileInView: { width: 'calc(100% - 8rem)' }, viewport: { once: true }, transition: { duration: 2.4, ease: 'easeOut' } })}
            />

            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, i * 0.1)}
                className="relative flex flex-col items-center w-44 flex-shrink-0 group"
              >
                <button
                  onClick={() => setActive(prev => prev === i ? null : i)}
                  aria-expanded={active === i}
                  aria-label={`${item.year}: ${item.title}`}
                  className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    active === i
                      ? 'bg-[#D9531E] border-[#D9531E] scale-150 shadow-[0_0_18px_rgba(217,83,30,0.7)]'
                      : 'bg-emerald-500 border-emerald-500 group-hover:scale-125 group-hover:shadow-[0_0_14px_rgba(5,150,105,0.6)]'
                  }`}
                />
                <span className={`mt-3 text-sm font-bold transition-colors ${active === i ? 'text-[#D9531E]' : 'text-white/70 group-hover:text-white'}`}>
                  {item.year}
                </span>
                <span className={`text-xs font-medium mt-1 text-center transition-colors ${active === i ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                  {item.title}
                </span>

                <AnimatePresence>
                  {active === i && (
                    <motion.div
                      className="absolute top-20 left-1/2 -translate-x-1/2 w-60 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 z-20 shadow-2xl"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.22 }}
                    >
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest block mb-2">
                        {item.year} — {item.title}
                      </span>
                      <div className="h-px bg-gradient-to-r from-emerald-500/50 to-[#D9531E]/50 mb-3" />
                      <p className="text-white/80 text-xs leading-relaxed">{item.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="text-center text-white/30 text-xs -mt-4">Click any milestone to expand</p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                  */
/* ══════════════════════════════════════════════════════════════════════ */
export default function CompanyPage() {
  const { open: openBookDemo } = useBookDemo();
  const reduced = useReducedMotion() ?? false;

  // Parallax hero
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Impact section inView for count-up
  const impactRef = useRef<HTMLDivElement>(null);
  const impactInView = useInView(impactRef, { once: true, margin: '-80px' });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ══ S1 CINEMATIC HERO ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: '#042B10' }}
      >
        {/* Parallax background image */}
        <motion.div
          className="absolute inset-0"
          style={reduced ? {} : { y: heroY, opacity: heroOpacity }}
        >
          <img
            src="/hero-slide-1.jpg"
            alt="Farmers using Esoko mobile app in a cornfield"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Dark-green cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#042B10]/80 via-[#042B10]/60 to-[#042B10]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#042B10]/60 via-transparent to-[#042B10]/40" />
        </motion.div>

        {/* Floating widgets */}
        <WeatherWidget reduced={reduced} />
        <SMSWidget     reduced={reduced} />
        <MapWidget     reduced={reduced} />
        <AnalyticsWidget reduced={reduced} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-36 md:py-44">
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
            Transforming African Agriculture<br className="hidden md:block" /> Through{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-[#D9531E] bg-clip-text text-transparent">
              Digital Innovation
            </span>
          </motion.h1>

          <motion.p
            {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.25, 0.65)}
            className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Since 2008, Esoko has been connecting rural communities with markets, knowledge,
            financial services, and digital technology to build resilient agricultural systems across Africa.
          </motion.p>

          <motion.div
            {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.38, 0.55)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Our Journey <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 border border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              Meet Our Team
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {!reduced && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        )}
      </section>

      {/* ══ S2 WHO WE ARE ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left image */}
            <motion.div
              {...fp(reduced, { opacity: 0, x: -40 }, { opacity: 1, x: 0 }, 0, 0.7)}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="/hero-slide-1.jpg"
                alt="Esoko field agents using smartphones with farmers"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
                <p className="font-heading font-bold text-gray-900 text-lg">Africa's #1</p>
                <p className="text-xs text-gray-500">Digital Agriculture Platform</p>
              </div>
            </motion.div>

            {/* Right glass panel */}
            <motion.div
              {...fp(reduced, { opacity: 0, x: 40 }, { opacity: 1, x: 0 }, 0.15, 0.7)}
              className="bg-gradient-to-br from-[#042B10] to-[#0a2010] rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-5 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
                Who We Are
              </span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6 leading-snug">
                Africa's Leading<br />Digital Agriculture Platform
              </h2>

              <div className="space-y-5 mb-8">
                <div>
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">Mission</p>
                  <p className="text-white/75 text-sm leading-relaxed">
                    Connecting last-mile communities with services through digital innovations —
                    empowering farmers, governments, and enterprises across Africa.
                  </p>
                </div>
                <div className="h-px bg-white/10" />
                <div>
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">Vision</p>
                  <p className="text-white/75 text-sm leading-relaxed">
                    Empowering Farmers. Restoring Earth.<br />
                    A digitally connected, climate-resilient Africa.
                  </p>
                </div>
              </div>

              {/* Animated stat badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { val: '18+', label: 'Years' },
                  { val: '2M+', label: 'Farmers' },
                  { val: '58',  label: 'Value Chains' },
                  { val: '10+', label: 'Countries' },
                  { val: '150+', label: 'Projects' },
                ].map((s, i) => (
                  <motion.div
                    key={s.val}
                    {...fp(reduced, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1 }, 0.3 + i * 0.07)}
                    className="bg-white/8 border border-white/10 rounded-2xl px-3 py-3 text-center"
                  >
                    <p className="font-heading font-bold text-white text-xl">{s.val}</p>
                    <p className="text-white/40 text-[10px]">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ S3 FEATURED VIDEO ════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-slide-5.jpg" alt="" aria-hidden className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#042B10]/85 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div {...fp(reduced, { opacity: 0, y: 24 }, { opacity: 1, y: 0 })}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
              Experience the Esoko Story
            </h2>
            <p className="text-white/55 max-w-xl mx-auto mb-10 text-base">
              Discover how Esoko is transforming agriculture across Africa through innovation, partnerships, and technology.
            </p>
          </motion.div>

          {/* 16:9 video placeholder */}
          <motion.div
            {...fp(reduced, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1 }, 0.2, 0.7)}
            className="relative mx-auto max-w-4xl group cursor-pointer"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/15
              transition-transform duration-500 group-hover:scale-[1.015]"
            >
              <img
                src="/hero-slide-2.jpg"
                alt="Esoko story — watch our impact video"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-2xl"
                  whileHover={reduced ? {} : { scale: 1.12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </motion.div>
              </div>

              {/* "Watch Our Story" + duration badge */}
              <div className="absolute bottom-5 left-6 text-left">
                <p className="text-white font-heading font-bold text-lg">Watch Our Story</p>
                <p className="text-white/60 text-xs">4 min</p>
              </div>
            </div>
          </motion.div>

          {/* 3 highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto mt-10">
            {[
              { icon: Lightbulb, title: 'Digital Innovation',   sub: 'AI, IoT & satellite technology' },
              { icon: Users,     title: '2M+ Farmers Connected', sub: 'Across 10+ African countries' },
              { icon: Star,      title: '18+ Years of Impact',   sub: 'Trusted since 2008' },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.4 + i * 0.1)}
                  className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-5 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">{c.title}</p>
                    <p className="text-white/45 text-xs">{c.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ S4 MISSION & VISION ═════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-slide-4.jpg" alt="" aria-hidden className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[#042B10]/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
              Our Purpose
            </h2>
            <p className="text-white/50 max-w-md mx-auto">The principles that guide everything we build and every partnership we forge.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                label: 'Mission',
                icon: '🌍',
                text: 'Connecting last-mile communities with services through digital innovations — empowering farmers, governments, and enterprises to build resilient agricultural systems across Africa.',
                delay: 0.1,
              },
              {
                label: 'Vision',
                icon: '🌱',
                text: 'Empowering Farmers. Restoring Earth. A digitally connected, climate-resilient Africa where every farming community has access to the markets, knowledge, and services they need to thrive.',
                delay: 0.25,
              },
            ].map(card => (
              <motion.div
                key={card.label}
                {...fp(reduced, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, card.delay, 0.65)}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-3 bg-emerald-400/10 px-3 py-1 rounded-full">
                  {card.label}
                </span>
                <p className="text-white/80 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S5 OUR IMPACT ════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #021608 0%, #042B10 50%, #021608 100%)' }}>
        {/* Satellite-map dot grid */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
              Our Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
              Numbers That Tell Our Story
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">18 years of measurable impact — in farmers reached, countries served, and lives transformed.</p>
          </motion.div>

          <div ref={impactRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {IMPACT_STATS.map((stat, i) => (
              <ImpactCard key={stat.label} stat={stat} inView={impactInView} reduced={reduced} delay={0.1 + i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ S6 OUR JOURNEY ══════════════════════════════════════════════ */}
      <OurJourney reduced={reduced} />

      {/* ══ S7 OUR TEAM ════════════════════════════════════════════════ */}
      <section id="team" className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #061a0d 0%, #0d2416 60%, #061a0d 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          {/* CEO quote panel */}
          <motion.div
            {...fp(reduced, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0, 0.65)}
            className="max-w-3xl mx-auto mb-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl px-10 py-10 text-center shadow-2xl"
          >
            <div className="text-5xl text-emerald-500/40 font-serif leading-none mb-4">"</div>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed italic mb-6">
              Our people are our greatest strength. Together, we combine innovation, technology, and local
              expertise to create lasting impact for farming communities across Africa.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D9531E] to-[#C84B16] flex items-center justify-center">
                <span className="text-white text-sm font-bold">BG</span>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Brian Gyamfi</p>
                <p className="text-white/40 text-xs">Chief Executive Officer, Esoko</p>
              </div>
            </div>
          </motion.div>

          {/* Section header */}
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.1)} className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">Meet Our Team</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Seasoned leaders combining deep African agricultural expertise with global technology vision.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} member={member} delay={0.05 + i * 0.07} reduced={reduced} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ S8 OUR VALUES ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-3">
              What We Stand For
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Six principles that define how we work, build, and partner across Africa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <ValueCard key={v.title} v={v} delay={0.08 + i * 0.08} reduced={reduced} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ S9 TRUSTED BY ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Faint world-map grid background */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <TrustSection />
      </div>

      {/* ══ S10 CALL TO ACTION ══════════════════════════════════════════ */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        {/* Slow-zoom background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/hero-slide-3.jpg"
            alt=""
            aria-hidden
            className={`w-full h-full object-cover ${reduced ? '' : 'animate-hero-zoom'}`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#042B10]/75 via-[#042B10]/65 to-[#042B10]/80" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-24">
          <motion.div {...fp(reduced, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0, 0.65)}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-5 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
              Get Started
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 leading-tight max-w-3xl mx-auto">
              Ready to Transform Agriculture Together?
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              Whether you're designing a government programme or scaling an agribusiness, Esoko has the
              platform, data, and expertise to make it work at scale.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openBookDemo}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-[#D9531E]/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Book a Demo <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/solutions/insyt"
                className="inline-flex items-center gap-2 border border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Solutions
              </Link>
              <button
                onClick={openBookDemo}
                className="inline-flex items-center gap-2 border border-emerald-400/40 text-emerald-400 rounded-full px-8 py-4 font-semibold hover:bg-emerald-400/10 hover:-translate-y-0.5 transition-all duration-200"
              >
                Become a Partner
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
