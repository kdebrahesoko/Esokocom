import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, MapPin, Users, Calendar, Globe2, ChevronDown,
  Wifi, CloudRain, Thermometer, MessageSquare, TrendingUp,
  BarChart2, Award, Briefcase, Leaf, Zap
} from 'lucide-react';
import { Link } from 'wouter';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { useBookDemo } from '@/context/BookDemoContext';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Data                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

const HERO_STATS = [
  { value: '18+', label: 'Years of Innovation' },
  { value: '2M+', label: 'Farmers Reached' },
  { value: '10+', label: 'African Countries' },
  { value: '1.9M', label: 'Verified Farmer Profiles' },
  { value: '58', label: 'Agricultural Value Chains' },
];

const TIMELINE = [
  { year: '2008', title: 'Founded', detail: 'Launched SMS crop price alerts, connecting smallholder farmers in Ghana with real-time market data for the first time.' },
  { year: '2010', title: 'Market Network', detail: "Built Ghana's first agricultural market price network, giving thousands of farmers daily commodity pricing across regions." },
  { year: '2013', title: 'Continental Reach', detail: 'Expanded operations into 10+ African countries, scaling field data collection and advisory services across diverse agricultural ecosystems.' },
  { year: '2016', title: 'Voice & IVR', detail: 'Launched a Voice & IVR platform supporting 15 local languages — bridging the literacy gap and reaching last-mile communities.' },
  { year: '2018', title: 'Social Protection', detail: 'Digitised large-scale social protection programmes, managing beneficiary registries and government-to-farmer payments at national scale.' },
  { year: '2022', title: 'Marketplace', detail: 'Launched a Digital Marketplace connecting smallholder farmers directly to certified buyers, financial institutions, and input suppliers.' },
  { year: '2024', title: 'AI Platform', detail: 'Introduced an AI & Digital Agriculture Platform with satellite imagery, predictive analytics, and automated agronomic advisory.' },
  { year: '2026+', title: 'Rural Infrastructure', detail: 'National Rural Infrastructure rollout underway — bringing digital identity, connectivity, and services to the most remote farming communities in Africa.' },
];

const KPI_CARDS = [
  { value: '2M+', label: 'Farmers Reached', icon: Users, color: 'from-emerald-500 to-green-700' },
  { value: '58', label: 'Value Chains', icon: Leaf, color: 'from-[#D9531E] to-[#C84B16]' },
  { value: '10+', label: 'Countries', icon: Globe2, color: 'from-blue-500 to-blue-700' },
  { value: '150+', label: 'Programmes', icon: Zap, color: 'from-amber-500 to-orange-600' },
];

const VALUES = [
  { icon: Globe2, title: 'Inclusive by design', desc: 'Every product decision starts with the last-mile farmer in mind.' },
  { icon: Users, title: 'Partnership first', desc: 'We build long-term relationships, not transactional deployments.' },
  { icon: Calendar, title: 'Proven at scale', desc: 'Over 18 years of on-the-ground delivery across 40+ countries.' },
  { icon: MapPin, title: 'Africa-rooted', desc: 'Headquartered in Accra, operating across the continent.' },
];

const TEAM = [
  { initials: 'BG', name: 'Brian Gyamfi', title: 'Chief Executive Officer', color: 'from-[#E07020] to-[#C05C0E]' },
  { initials: 'KM', name: 'Dr. Kwame Mensah', title: 'Chief Technology Officer', color: 'from-blue-400 to-blue-700' },
  { initials: 'AA', name: 'Ama Asante', title: 'Chief Operating Officer', color: 'from-orange-400 to-red-600' },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Particle field (pure CSS, reduced-motion safe)                            */
/* ─────────────────────────────────────────────────────────────────────────── */

const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.round((i * 137.5) % 100),
  y: Math.round((i * 91.3) % 100),
  size: 2 + (i % 3),
  delay: (i * 0.4) % 4,
  duration: 5 + (i % 5),
}));

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Floating hero widgets                                                      */
/* ─────────────────────────────────────────────────────────────────────────── */

function WeatherWidget() {
  return (
    <motion.div
      className="absolute top-24 right-[8%] hidden xl:block w-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
      animate={{ y: [0, -10, 0] }}
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

function SMSWidget() {
  return (
    <motion.div
      className="absolute bottom-36 left-[6%] hidden xl:block w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
      animate={{ y: [0, 10, 0] }}
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

function MapWidget() {
  return (
    <motion.div
      className="absolute top-36 left-[5%] hidden xl:block w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl overflow-hidden"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 8, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-3.5 h-3.5 text-brand" />
        <span className="text-white/70 text-xs font-medium">Active Farms</span>
      </div>
      {/* Mini map grid */}
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

function AnalyticsWidget() {
  const bars = [60, 80, 45, 90, 70, 85, 55, 75];
  return (
    <motion.div
      className="absolute bottom-40 right-[6%] hidden xl:block w-52 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl"
      animate={{ y: [0, 12, 0] }}
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
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
          />
        ))}
      </div>
      <p className="text-white/40 text-[10px] mt-2">+23% avg yield improvement</p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Animated illustration (Company Overview left panel)                        */
/* ─────────────────────────────────────────────────────────────────────────── */

function FarmerNetworkIllustration() {
  const nodes = [
    { x: 50, y: 15, label: 'Market Hub', icon: '🏪', color: '#D9531E' },
    { x: 20, y: 45, label: 'Farmer A', icon: '👨‍🌾', color: '#059669' },
    { x: 80, y: 45, label: 'Farmer B', icon: '👩‍🌾', color: '#059669' },
    { x: 50, y: 72, label: 'Esoko App', icon: '📱', color: '#2563EB' },
    { x: 15, y: 80, label: 'Farmer C', icon: '🌾', color: '#059669' },
    { x: 85, y: 80, label: 'Buyer', icon: '🚛', color: '#D97706' },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [3, 1], [3, 2], [3, 4], [3, 5], [1, 4],
  ];

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto select-none">
      {/* SVG connections */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke="url(#netGrad)"
            strokeWidth="0.5"
            strokeDasharray="3 2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.8 }}
          />
        ))}
        <defs>
          <linearGradient id="netGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#D9531E" />
          </linearGradient>
        </defs>
        {/* Animated pulse rings on market hub */}
        {[1.5, 2.5, 3.5].map((r, i) => (
          <motion.circle
            key={i}
            cx={nodes[0].x} cy={nodes[0].y} r={r}
            fill="none"
            stroke="#D9531E"
            strokeWidth="0.4"
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ delay: i * 0.8, duration: 2.4, repeat: Infinity }}
          />
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.15, type: 'spring', stiffness: 200 }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white/20"
            style={{ backgroundColor: node.color + '22', borderColor: node.color + '55' }}
          >
            {node.icon}
          </div>
          <span className="text-[10px] text-gray-500 whitespace-nowrap font-medium bg-white/80 px-1.5 py-0.5 rounded-full">
            {node.label}
          </span>
        </motion.div>
      ))}

      {/* Background hexagon grid */}
      <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 100 100">
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <polygon
              key={`${row}-${col}`}
              points="10,0 20,0 25,8.66 20,17.32 10,17.32 5,8.66"
              transform={`translate(${col * 22 + (row % 2) * 11}, ${row * 18})`}
              fill="none"
              stroke="#059669"
              strokeWidth="0.5"
            />
          ))
        )}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Timeline                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function Timeline() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="timeline" className="py-24 bg-gradient-to-b from-[#0a1f0f] to-[#0f2318] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-4 py-1.5 rounded-full">
            Our Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            18 Years of African Agricultural Innovation
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            From a single SMS service to a continent-wide digital agriculture platform — every milestone built on the last.
          </p>
        </motion.div>

        {/* Horizontal scrollable timeline */}
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-8 hide-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-0 min-w-max relative px-8 md:px-16">
            {/* Connector line */}
            <div className="absolute top-8 left-16 right-16 h-px bg-white/10" />
            <motion.div
              className="absolute top-8 left-16 h-px bg-gradient-to-r from-emerald-500 to-[#D9531E]"
              initial={{ width: 0 }}
              whileInView={{ width: 'calc(100% - 8rem)' }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: 'easeOut' }}
            />

            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                className="relative flex flex-col items-center w-40 flex-shrink-0 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Node */}
                <button
                  className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    activeIdx === i
                      ? 'bg-[#D9531E] border-[#D9531E] scale-150 shadow-[0_0_16px_rgba(217,83,30,0.6)]'
                      : 'bg-emerald-500 border-emerald-500 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(5,150,105,0.5)]'
                  }`}
                  onClick={() => setActiveIdx(prev => prev === i ? null : i)}
                  aria-expanded={activeIdx === i}
                  aria-label={`${item.year}: ${item.title}`}
                />

                {/* Year label */}
                <span className={`mt-3 text-sm font-bold transition-colors ${activeIdx === i ? 'text-[#D9531E]' : 'text-white/70 group-hover:text-white'}`}>
                  {item.year}
                </span>

                {/* Title */}
                <span className={`text-xs font-medium mt-1 text-center transition-colors ${activeIdx === i ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                  {item.title}
                </span>

                {/* Expandable detail */}
                <AnimatePresence>
                  {activeIdx === i && (
                    <motion.div
                      className="absolute top-20 left-1/2 -translate-x-1/2 w-56 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 z-20 shadow-2xl"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-white/80 text-xs leading-relaxed">{item.detail}</p>
                      <div className="mt-2 h-px bg-gradient-to-r from-emerald-500 to-[#D9531E]" />
                      <span className="text-emerald-400 text-[10px] font-semibold mt-2 block">{item.year} — {item.title}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-4">
          Click any milestone to learn more
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Floating KPI card (used in Company Overview)                               */
/* ─────────────────────────────────────────────────────────────────────────── */

function KpiCard({ kpi, index }: { kpi: typeof KPI_CARDS[0]; index: number }) {
  const Icon = kpi.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      animate={{ y: [0, index % 2 === 0 ? -6 : 6, 0] }}
      // @ts-ignore framer can combine initial and animate
      className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center gap-4"
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-heading font-bold text-foreground">{kpi.value}</p>
        <p className="text-xs text-muted-foreground">{kpi.label}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Page                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function CompanyPage() {
  const { open: openBookDemo } = useBookDemo();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#042B10] via-[#0a1f0f] to-[#0f1e30]"
      >
        {/* Parallax background layer */}
        <motion.div className="absolute inset-0" style={{ y: heroY, opacity: heroOpacity }}>
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_40%,rgba(5,150,105,0.18),transparent)]" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-[#D9531E]/5 blur-3xl" />
          <ParticleField />
        </motion.div>

        {/* Floating widgets */}
        <WeatherWidget />
        <SMSWidget />
        <MapWidget />
        <AnalyticsWidget />

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-32 md:py-40">
          <motion.span
            className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-6 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Esoko
          </motion.span>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white max-w-5xl mx-auto leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Transforming African Agriculture Through{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-[#D9531E] bg-clip-text text-transparent">
              Digital Innovation
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Since 2008, Esoko has been connecting rural communities with markets, knowledge, financial services,
            and technology to create a more sustainable and prosperous agricultural future.
          </motion.p>

          {/* Stat badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            {HERO_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.07, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.12)' }}
              >
                <span className="text-xl md:text-2xl font-heading font-bold text-white">{s.value}</span>
                <span className="text-[11px] text-white/50 mt-0.5 whitespace-nowrap">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
          >
            <button
              onClick={() => scrollTo('timeline')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white rounded-full px-8 py-3.5 font-semibold text-sm shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore Our Journey <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('leadership')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-full px-8 py-3.5 font-semibold text-sm hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-sm"
            >
              Meet Our Team
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ── Company Overview ─────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: animated illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl p-8 border border-emerald-100">
                <FarmerNetworkIllustration />
                {/* Floating label */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-5 py-2 shadow-lg border border-gray-100 text-sm font-semibold text-foreground whitespace-nowrap">
                  <span className="text-emerald-600">●</span> 2,000,000+ farmers connected
                </div>
              </div>
            </motion.div>

            {/* Right: content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-4 bg-brand/10 px-4 py-1.5 rounded-full">
                  Who We Are
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-5 leading-tight">
                  Africa's Leading AgriTech Platform
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Esoko was established in 2008 and has grown into one of Africa's leading AgriTech companies.
                  Through mobile technology, AI, and digital innovation, Esoko empowers governments,
                  agribusinesses, NGOs, financial institutions, and rural communities to improve agricultural
                  productivity, increase market access, strengthen food security, and enhance livelihoods.
                </p>

                {/* Mission & Vision cards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Mission</span>
                    </div>
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      Connecting last-mile communities with services through digital innovations.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-brand" />
                      <span className="text-xs font-bold uppercase tracking-wider text-brand">Vision</span>
                    </div>
                    <p className="text-sm text-foreground font-medium leading-relaxed">
                      Empowering Farmers. Restoring Earth.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating KPI grid */}
              <div className="grid grid-cols-2 gap-4">
                {KPI_CARDS.map((kpi, i) => (
                  <KpiCard key={kpi.label} kpi={kpi} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values bar ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{v.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <Timeline />

      {/* ── Leadership ───────────────────────────────────────────────────── */}
      <section id="leadership" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-4 bg-brand/10 px-4 py-1.5 rounded-full">
              Our Team
            </span>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-3">
              Leadership
            </h2>
            <p className="text-muted-foreground mb-12 max-w-md mx-auto">
              Seasoned leaders combining deep African agricultural expertise with global technology vision.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-10">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center gap-3 group"
              >
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform`}
                >
                  {member.initials}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Awards / trust bar ───────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-gradient-to-r from-[#042B10] to-[#0f2318]">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-white">
              <Award className="w-8 h-8 text-amber-400" />
              <div>
                <p className="font-heading font-bold text-lg">Africa AgriTech 100</p>
                <p className="text-white/50 text-sm">Recognised global innovator</p>
              </div>
            </div>
            <div className="h-px sm:h-10 sm:w-px bg-white/10 w-full sm:w-auto" />
            <div className="text-center sm:text-left text-white">
              <p className="font-heading font-bold text-lg">CGIAR & FAO Partner</p>
              <p className="text-white/50 text-sm">Trusted by international institutions</p>
            </div>
            <div className="h-px sm:h-10 sm:w-px bg-white/10 w-full sm:w-auto" />
            <div className="text-center sm:text-right text-white">
              <p className="font-heading font-bold text-lg">ISO-aligned Delivery</p>
              <p className="text-white/50 text-sm">Enterprise-grade data standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-4 bg-brand/10 px-4 py-1.5 rounded-full">
              Get Involved
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 leading-tight">
              Ready to transform agriculture in your region?
            </h2>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              Whether you're designing a government programme or scaling an existing agribusiness,
              Esoko has the platform, data, and expertise to make it work at scale.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={openBookDemo}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Book a Demo <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/solutions/insyt"
                className="inline-flex items-center justify-center gap-2 border-2 border-brand text-brand rounded-full px-8 py-4 font-semibold hover:bg-brand/5 hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Solutions
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
