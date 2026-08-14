import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowRight, ExternalLink, CheckCircle2, Zap, Globe, Smartphone,
  BarChart2, Users, ShoppingCart, MessageSquare, BookOpen,
  ClipboardList, Cloud, Brain, Wifi, Database, Layers,
  Phone, Radio, Mic, Send, CloudRain, Thermometer, Apple,
  DollarSign, Bell, MapPin, Code, Cpu, Satellite,
  ChevronRight, Star,
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useBookDemo } from '@/context/BookDemoContext';

/* ─── SEO helpers ────────────────────────────────────────────────────────── */
function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
  el.content = content;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 'insyt',
    name: 'Insyt & Survey',
    category: 'Data Collection Platform',
    desc: 'AI-powered field operations and data collection — from GPS-tagged farm boundaries to biometric beneficiary registration and offline-first mobile surveys.',
    url: 'https://insyt-survey.esoko.com/',
    icon: ClipboardList,
    color: '#0B4D2E',
    bg: 'from-[#0B4D2E] to-[#1a6b40]',
    features: ['Offline data collection', 'GPS farm boundaries', 'Biometric verification', 'AI validation', 'Real-time dashboards', 'M&E frameworks'],
    badge: 'Powered by Insyt',
  },
  {
    id: 'push',
    name: 'Push Messaging',
    category: 'Multi-channel Communications',
    desc: 'Reach millions of farmers instantly via SMS, Voice-SMS, IVR, USSD, and WhatsApp — even on feature phones with zero data, in 45+ local languages.',
    url: 'https://push.esoko.com/',
    icon: MessageSquare,
    color: '#7c2d12',
    bg: 'from-[#7c2d12] to-[#9a3412]',
    features: ['Bulk SMS campaigns', 'Voice-SMS & IVR', 'USSD short codes', 'WhatsApp Business', 'Emergency alerts', 'Segmented targeting'],
    badge: 'Powered by Push',
  },
  {
    id: 'econtent',
    name: 'E Content',
    category: 'Agricultural Advisory',
    desc: 'Personalized weather forecasts, crop advisories, market intelligence, and nutrition guidance delivered to every farmer — at the right moment in their season.',
    url: 'https://content-web.esoko.com/',
    icon: BookOpen,
    color: '#166534',
    bg: 'from-[#14532d] to-[#166534]',
    features: ['Hyper-local weather', 'Climate-smart advice', 'Market price alerts', 'Nutrition guidance', 'Pest & disease alerts', 'Multilingual delivery'],
    badge: 'Powered by E Content',
  },
  {
    id: 'marketplace',
    name: 'Esoko Marketplace',
    category: 'Digital Trade Platform',
    desc: 'A verified digital marketplace connecting smallholder farmers directly to buyers, aggregators, and input suppliers — with integrated logistics and digital payments.',
    url: 'https://marketplace.esoko.com/',
    icon: ShoppingCart,
    color: '#1e3a5f',
    bg: 'from-[#1e3a5f] to-[#1d4ed8]',
    features: ['Direct farmer-to-buyer', 'Verified seller profiles', 'Logistics coordination', 'Digital payments', 'Live market prices', 'Quality assurance'],
    badge: 'Powered by Marketplace',
  },
];

const SOFTWARE_SERVICES = [
  { icon: Smartphone, title: 'Mobile & Web Data Collection', desc: 'Custom offline-first apps for any data collection programme — built on the Insyt & Survey engine.' },
  { icon: Brain, title: 'AI & Analytics', desc: 'Predictive models, satellite monitoring, yield forecasting, and natural-language dashboards tailored to your data.' },
  { icon: CloudRain, title: 'Climate-Smart Agronomy', desc: 'Season-specific advisory content generation, weather integration, and climate risk scoring for outgrower programmes.' },
  { icon: BarChart2, title: 'Market Pricing Information', desc: 'Real-time price collection, validation, and dissemination systems — from field to farmer in minutes.' },
  { icon: Phone, title: 'Call Center Services', desc: 'IVR flows, agent scripting, and farmer helpdesk infrastructure — powered by Push Messaging.' },
];

const MESSAGING_CHANNELS = [
  { icon: MessageSquare, label: 'SMS', desc: 'Targeted text messages with 95%+ delivery rate' },
  { icon: Mic,            label: 'Voice-SMS', desc: 'Pre-recorded audio in any local language' },
  { icon: Phone,          label: 'IVR', desc: 'Interactive voice response, no data required' },
  { icon: Radio,          label: 'USSD', desc: 'Keypad menus on any feature phone' },
];

const CONTENT_CATEGORIES = [
  { icon: CloudRain, label: 'Weather Forecasts' },
  { icon: Thermometer, label: 'Climate-Smart Farming' },
  { icon: Apple, label: 'Nutrition & Health' },
  { icon: DollarSign, label: 'Financial Literacy' },
  { icon: Globe, label: 'Gender & Social Inclusion' },
  { icon: BarChart2, label: 'Market Intelligence' },
  { icon: Bell, label: 'Pest & Disease Alerts' },
];

const TECH_CHIPS = [
  'Mobile-first', 'Offline-ready', 'Cloud-native', 'AI-powered',
  'GIS & Mapping', 'Analytics', 'Multi-channel Messaging',
  'REST APIs', 'Data Intelligence', 'Satellite Monitoring',
  'Biometrics', 'Open Standards',
];

const ECOSYSTEM_NODES = [
  { label: 'Insyt & Survey',   angle: -60,  color: '#0B4D2E', icon: ClipboardList },
  { label: 'Push Messaging',   angle: 0,    color: '#7c2d12', icon: MessageSquare },
  { label: 'E Content',        angle: 60,   color: '#166534', icon: BookOpen },
  { label: 'Marketplace',      angle: 120,  color: '#1e3a5f', icon: ShoppingCart },
  { label: 'AI & Analytics',   angle: 180,  color: '#0369a1', icon: BarChart2 },
  { label: 'Field Operations', angle: -120, color: '#7e22ce', icon: MapPin },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function PoweredBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
      style={{ background: color }}
    >
      <Zap className="w-2.5 h-2.5" /> {label}
    </span>
  );
}

/* Mini app-preview mockup for product cards */
function ProductMockup({ p }: { p: typeof PRODUCTS[number] }) {
  const Icon = p.icon;
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded text-[10px] text-gray-400 px-2 py-0.5 border border-gray-200 truncate">
          {p.url.replace('https://', '')}
        </div>
      </div>
      {/* App UI */}
      <div className="flex" style={{ height: 140 }}>
        {/* Sidebar */}
        <div className="w-24 bg-gray-50 border-r border-gray-100 p-2 space-y-1 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2">
            <div className="w-4 h-4 rounded" style={{ background: p.color }} />
            <div className="h-2 w-10 rounded bg-gray-300" />
          </div>
          {[0.9, 0.6, 0.5, 0.45].map((op, i) => (
            <div key={i} className={`h-6 rounded flex items-center gap-1.5 px-2 ${i === 0 ? 'bg-white shadow-sm' : ''}`}>
              <div className="w-3 h-3 rounded-sm" style={{ background: p.color, opacity: op * 0.5 }} />
              <div className="h-1.5 rounded flex-1 bg-gray-200" style={{ opacity: op * 0.7 }} />
            </div>
          ))}
        </div>
        {/* Main pane */}
        <div className="flex-1 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-2.5 w-20 rounded bg-gray-800 mb-1" />
              <div className="h-1.5 w-28 rounded bg-gray-300" />
            </div>
            <div className="h-6 w-14 rounded-full text-white text-[9px] flex items-center justify-center font-bold" style={{ background: p.color }}>
              + New
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-1.5">
            {['4.2M', '98%', '847'].map((v, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-1.5 border border-gray-100">
                <div className="text-[10px] font-bold" style={{ color: p.color }}>{v}</div>
                <div className="h-1 w-8 rounded bg-gray-200 mt-0.5" />
              </div>
            ))}
          </div>
          {/* Chart */}
          <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 flex items-end gap-0.5 px-2 py-1.5">
            {[55, 72, 48, 85, 60, 90, 70, 82, 65, 95].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, background: p.color, opacity: 0.2 + (i / 10) * 0.7 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ p, index, reduced }: { p: typeof PRODUCTS[number]; index: number; reduced: boolean }) {
  const Icon = p.icon;
  return (
    <motion.div
      {...(reduced ? {} : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.5, delay: (index % 2) * 0.1 },
        whileHover: { y: -6, transition: { duration: 0.2 } },
      })}
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      {/* Product preview area */}
      <div className={`relative bg-gradient-to-br ${p.bg} p-6 pb-8`}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)',
        }} />
        <ProductMockup p={p} />
      </div>

      <div className="p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full mt-1">
            {p.category}
          </span>
        </div>

        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">{p.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {p.features.map(f => (
            <span key={f} className="inline-flex items-center gap-1 text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${p.name} platform — opens in a new tab`}
          className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full text-white transition-all duration-200 shadow-sm hover:shadow-lg active:scale-95 w-fit"
          style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)` }}
        >
          Launch {p.name} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}

function EcosystemDiagram({ reduced }: { reduced: boolean }) {
  const R = 130; // radius in px — adjust for mobile via scale
  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="-200 -200 400 400"
        className="w-full max-w-[420px] mx-auto"
        aria-hidden="true"
      >
        {/* Animated connecting lines */}
        {ECOSYSTEM_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = R * Math.cos(rad);
          const y = R * Math.sin(rad);
          return (
            <motion.line
              key={i}
              x1={0} y1={0} x2={x} y2={y}
              stroke={node.color}
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity={0.5}
              {...(reduced ? {} : {
                initial: { pathLength: 0 },
                animate: { pathLength: 1 },
                transition: { duration: 0.8, delay: 0.3 + i * 0.1 },
              })}
            />
          );
        })}

        {/* Outer nodes */}
        {ECOSYSTEM_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = R * Math.cos(rad);
          const y = R * Math.sin(rad);
          const Icon = node.icon;
          return (
            <motion.g
              key={i}
              {...(reduced ? {} : {
                initial: { opacity: 0, scale: 0.5 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.4, delay: 0.5 + i * 0.1 },
              })}
            >
              <circle cx={x} cy={y} r={28} fill="white" stroke={node.color} strokeWidth={2} filter="url(#shadow)" />
              <foreignObject x={x - 12} y={y - 12} width={24} height={24}>
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon className="w-4 h-4" style={{ color: node.color }} />
                </div>
              </foreignObject>
              <text
                x={x}
                y={y + 42}
                textAnchor="middle"
                fontSize={8}
                fill={node.color}
                fontWeight={600}
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {node.label}
              </text>
            </motion.g>
          );
        })}

        {/* Centre node */}
        <motion.g
          {...(reduced ? {} : {
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5, delay: 0.2 },
          })}
        >
          <circle cx={0} cy={0} r={46} fill="#0B4D2E" />
          <circle cx={0} cy={0} r={38} fill="white" opacity={0.15} />
          <text x={0} y={-6} textAnchor="middle" fontSize={9} fill="white" fontWeight={700} fontFamily="Plus Jakarta Sans, sans-serif">
            Farmer /
          </text>
          <text x={0} y={8} textAnchor="middle" fontSize={9} fill="white" fontWeight={700} fontFamily="Plus Jakarta Sans, sans-serif">
            Organisation
          </text>
        </motion.g>

        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function ProductsServicesPage() {
  const { open: openBookDemo } = useBookDemo();
  const reduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLDivElement>(null);

  // SEO
  useEffect(() => {
    document.title = 'Products & Services | Esoko — Agricultural Technology Platform';
    setMeta('description', 'Explore Esoko\'s complete product ecosystem — Insyt & Survey, Push Messaging, E Content, and Esoko Marketplace — alongside professional services for deployments, software development, and agricultural advisory.');
    return () => { document.title = 'Esoko — Agricultural Market Data & Advisory Services'; };
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  const fadeUp = (delay = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay },
  };

  const revealUp = (delay = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.45, delay },
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#051f12]"
        aria-label="Hero"
      >
        {/* Background photograph — African farmer with smartphone */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1595547802775-6ac58ff5dc9e?w=1600&auto=format&fit=crop&q=80')",
          }}
          aria-hidden="true"
        />
        {/* Dark gradient overlay over photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#051f12]/92 via-[#0B4D2E]/80 to-[#051f12]/95" />

        {/* Animated data-dot grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {Array.from({ length: 28 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-emerald-400"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0 }}
              {...(reduced ? {} : {
                animate: {
                  opacity: [0, 0.6, 0],
                  y: [0, -20, -40],
                },
                transition: {
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 6,
                  ease: 'easeInOut',
                },
              })}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-32 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p {...fadeUp(0)} className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-5">
              Esoko Platform Ecosystem
            </motion.p>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-[1.05] mb-6"
            >
              Products &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
                Services
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.14)} className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Four enterprise-grade platforms and a full suite of professional services — powering agricultural transformation across 40+ countries.
            </motion.p>

            <motion.div {...fadeUp(0.2)} className="flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={() => scrollTo('products')}
                className="rounded-full px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base h-auto shadow-xl shadow-emerald-900/40"
              >
                Explore Products <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button
                onClick={openBookDemo}
                variant="outline"
                className="rounded-full px-8 py-3.5 border-white/25 text-white hover:bg-white/10 bg-transparent font-semibold text-base h-auto"
              >
                Talk to Our Team
              </Button>
            </motion.div>
          </div>

          {/* Stat strip */}
          <motion.div
            {...fadeUp(0.3)}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
          >
            {[
              { val: '4', label: 'Live Platforms' },
              { val: '40+', label: 'Countries' },
              { val: '5M+', label: 'Farmers Reached' },
              { val: '18 yrs', label: 'Trusted Since 2006' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-3xl font-heading font-bold text-emerald-400">{s.val}</p>
                <p className="text-xs text-white/50 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => scrollTo('products')}
          aria-label="Scroll to products"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 transition-colors"
          {...(reduced ? {} : { animate: { y: [0, 8, 0] }, transition: { repeat: Infinity, duration: 2 } })}
        >
          <ChevronRight className="w-6 h-6 rotate-90" />
        </motion.button>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PRODUCTS & PLATFORMS
      ══════════════════════════════════════════════════════════════════ */}
      <section id="products" className="py-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.p {...revealUp()} className="text-sm font-bold uppercase tracking-[0.18em] text-brand mb-3">
              Products & Platforms
            </motion.p>
            <motion.h2 {...revealUp(0.08)} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Four platforms. One ecosystem.
            </motion.h2>
            <motion.p {...revealUp(0.14)} className="text-gray-500 text-lg leading-relaxed">
              Each product is a standalone SaaS platform — and a building block of Esoko's integrated agricultural data ecosystem.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRODUCTS.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} reduced={reduced} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          ECOSYSTEM VISUALISATION
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p {...revealUp()} className="text-sm font-bold uppercase tracking-[0.18em] text-brand mb-3">
                Platform Architecture
              </motion.p>
              <motion.h2 {...revealUp(0.08)} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                One Digital Ecosystem.{' '}
                <span className="text-emerald-700">Multiple Solutions.</span>
              </motion.h2>
              <motion.p {...revealUp(0.14)} className="text-gray-500 text-lg leading-relaxed mb-8">
                Every Esoko product connects to a shared data layer — meaning farmer profiles, field data, messages, and market prices all flow between platforms without duplication or manual transfers.
              </motion.p>
              <motion.ul {...revealUp(0.18)} className="space-y-3">
                {[
                  'Farmer registered in Insyt → instantly reachable via Push Messaging',
                  'Survey data → feeds AI analytics without manual export',
                  'Market prices from Marketplace → power E Content advisories',
                  'Deployment outcomes → tracked in real-time dashboards',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </motion.ul>
            </div>

            <motion.div
              {...revealUp(0.1)}
              className="flex items-center justify-center"
            >
              <EcosystemDiagram reduced={reduced} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PRODUCTS vs SERVICES DISTINCTION PANEL
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-[#0B4D2E] to-[#051f12]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...revealUp()} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">
              Products vs Services
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Understand the difference — and how they work together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Products */}
            <motion.div {...revealUp(0.08)} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                <Layers className="w-3.5 h-3.5" /> Products & Platforms
              </div>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Self-service SaaS platforms you deploy and operate independently — each with its own domain, mobile apps, and real-time dashboard.
              </p>
              <div className="space-y-3">
                {PRODUCTS.map(p => {
                  const Icon = p.icon;
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: p.color }}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{p.name}</p>
                        <p className="text-xs text-white/50 truncate">{p.category}</p>
                      </div>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name} — new tab`}
                         className="text-white/40 hover:text-emerald-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Services */}
            <motion.div {...revealUp(0.12)} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                <Users className="w-3.5 h-3.5" /> Professional Services
              </div>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Managed deployments and consulting engagements — Esoko's team designs, implements, and operates solutions for your specific programme.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Deployments', sub: 'Coordinate Field Agents', icon: Users, power: null },
                  { label: 'Software Development', sub: '5 specialist service areas', icon: Code, power: null },
                  { label: 'Messaging Services', sub: 'Managed push campaigns', icon: MessageSquare, power: 'Push' },
                  { label: 'Content Services', sub: 'Editorial & advisory delivery', icon: BookOpen, power: 'E Content' },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{s.label}</p>
                        <p className="text-xs text-white/50">{s.sub}</p>
                      </div>
                      {s.power && (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/15 px-2 py-0.5 rounded-full whitespace-nowrap">
                          via {s.power}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SERVICES SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.p {...revealUp()} className="text-sm font-bold uppercase tracking-[0.18em] text-brand mb-3">
              Professional Services
            </motion.p>
            <motion.h2 {...revealUp(0.08)} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              We don't just build tools.
              <br /><span className="text-emerald-700">We run programmes.</span>
            </motion.h2>
            <motion.p {...revealUp(0.14)} className="text-gray-500 text-lg leading-relaxed">
              Esoko's field operations and technical teams deliver end-to-end managed services — from design and deployment to ongoing operations and analytics.
            </motion.p>
          </div>

          {/* ─── Deployments ─── */}
          <motion.div
            {...revealUp()}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <PoweredBadge label="Powered by Insyt" color="#0B4D2E" />
                <h3 className="text-3xl font-heading font-bold text-gray-900 mt-5 mb-4">Deployments</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Esoko coordinates large-scale field operations — from training and assigning thousands of enumerators to GPS tracking, performance management, and live progress dashboards.
                </p>
                <ul className="grid grid-cols-2 gap-3 mb-8">
                  {['Enumerator coordination', 'GPS agent tracking', 'Attendance management', 'Performance scoring', 'Impact evaluations', 'Automated alerts'].map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/solutions/deployments">
                  <Button className="rounded-full bg-[#0B4D2E] hover:bg-[#0B4D2E]/90 text-white h-auto px-7 py-3">
                    Learn More <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-[#0B4D2E] to-[#1a6b40] flex items-center justify-center p-12 min-h-[280px]">
                <div className="text-center text-white">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-4xl font-heading font-bold">50,000+</p>
                  <p className="text-white/60 mt-1">Field Agents Managed</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Software Development Services ─── */}
          <motion.div {...revealUp()} id="software-dev" className="mb-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 lg:p-14">
              <div className="max-w-xl mb-10">
                <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">Software Development Services</h3>
                <p className="text-gray-500 leading-relaxed">
                  Esoko's engineering team builds custom agricultural technology solutions — from data collection apps to AI analytics dashboards — on top of the Esoko platform.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {SOFTWARE_SERVICES.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.title}
                      {...(reduced ? {} : {
                        initial: { opacity: 0, y: 16 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true },
                        transition: { duration: 0.4, delay: i * 0.08 },
                      })}
                      className="group bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 rounded-2xl p-6 transition-all duration-200 flex flex-col"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center mb-4 transition-colors flex-shrink-0">
                        <Icon className="w-5 h-5 text-emerald-700" />
                      </div>
                      <h4 className="font-heading font-bold text-gray-900 text-sm mb-2">{s.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1">{s.desc}</p>
                      <button
                        onClick={openBookDemo}
                        className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
                      >
                        Discuss this service <ArrowRight className="w-3 h-3" />
                      </button>
                    </motion.div>
                  );
                })}
                <motion.div
                  {...(reduced ? {} : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.4, delay: 0.4 },
                  })}
                  className="bg-[#0B4D2E] rounded-2xl p-6 flex flex-col justify-between"
                >
                  <p className="text-white font-semibold text-sm mb-2">Ready to build something remarkable?</p>
                  <p className="text-white/60 text-xs mb-5">Our engineering team designs, builds, and operates custom AgTech solutions from scratch.</p>
                  <Button
                    onClick={openBookDemo}
                    className="rounded-full bg-white text-[#0B4D2E] hover:bg-white/90 h-auto px-5 py-2.5 text-sm font-bold w-fit"
                  >
                    Talk to Us <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ─── Messaging Service ─── */}
          <motion.div {...revealUp()} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-[#7c2d12] to-[#9a3412] flex items-center justify-center p-12 min-h-[280px] order-last lg:order-first">
                <div className="grid grid-cols-2 gap-4">
                  {MESSAGING_CHANNELS.map(ch => {
                    const Icon = ch.icon;
                    return (
                      <div key={ch.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
                        <Icon className="w-7 h-7 text-white mx-auto mb-2 opacity-80" />
                        <p className="text-white font-bold text-sm">{ch.label}</p>
                        <p className="text-white/50 text-[10px] mt-1">{ch.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-10 lg:p-14">
                <PoweredBadge label="Powered by Push" color="#7c2d12" />
                <h3 className="text-3xl font-heading font-bold text-gray-900 mt-5 mb-4">Messaging Services</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Esoko designs and manages end-to-end messaging campaigns — from content creation and farmer segmentation to delivery optimization and analytics — at millions-per-day scale.
                </p>
                <ul className="space-y-2 mb-8">
                  {['500M+ messages delivered', '95%+ SMS delivery rate', '45+ languages supported', '10-minute campaign setup'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-[#9a3412] flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="https://push.esoko.com/" target="_blank" rel="noopener noreferrer" aria-label="Open Push Messaging platform — new tab">
                  <Button className="rounded-full bg-[#9a3412] hover:bg-[#7c2d12] text-white h-auto px-7 py-3">
                    Explore Push <ExternalLink className="w-4 h-4 ml-1.5" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* ─── Content Service ─── */}
          <motion.div {...revealUp()} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <PoweredBadge label="Powered by E Content" color="#166534" />
                <h3 className="text-3xl font-heading font-bold text-gray-900 mt-5 mb-4">Content Services</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Esoko's content team curates, localizes, and distributes agricultural advisory content across seven thematic areas — with editorial oversight and continuous impact measurement.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {CONTENT_CATEGORIES.map(c => {
                    const Icon = c.icon;
                    return (
                      <span key={c.label} className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full">
                        <Icon className="w-3.5 h-3.5" /> {c.label}
                      </span>
                    );
                  })}
                </div>
                <a href="https://content-web.esoko.com/" target="_blank" rel="noopener noreferrer" aria-label="Open E Content platform — new tab">
                  <Button className="rounded-full bg-[#166534] hover:bg-[#14532d] text-white h-auto px-7 py-3">
                    Explore E Content <ExternalLink className="w-4 h-4 ml-1.5" />
                  </Button>
                </a>
              </div>
              <div className="bg-gradient-to-br from-[#14532d] to-[#166534] flex items-center justify-center p-12 min-h-[280px]">
                <div className="text-center text-white">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-4xl font-heading font-bold">2M+</p>
                  <p className="text-white/60 mt-1">Active Advisory Subscribers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TECHNOLOGY ECOSYSTEM
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.p {...revealUp()} className="text-sm font-bold uppercase tracking-[0.18em] text-brand mb-3">
              Technology Architecture
            </motion.p>
            <motion.h2 {...revealUp(0.08)} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Built for Africa.{' '}
              <span className="text-emerald-700">Designed to Scale.</span>
            </motion.h2>
            <motion.p {...revealUp(0.14)} className="text-gray-500 text-lg">
              Every capability below is live in production across 40+ countries — not a roadmap item.
            </motion.p>
          </div>

          {/* Architecture grid — icon + label nodes arranged in a layered layout */}
          <div className="max-w-4xl mx-auto">
            {/* Layer labels */}
            {[
              {
                layer: 'Data Collection',
                color: '#0B4D2E',
                bg: 'bg-emerald-50',
                border: 'border-emerald-200',
                items: [
                  { icon: Smartphone,  label: 'Mobile-first Apps' },
                  { icon: Globe,       label: 'Progressive Web Apps' },
                  { icon: Wifi,        label: 'Offline-ready Sync' },
                  { icon: MapPin,      label: 'GIS & Mapping' },
                ],
              },
              {
                layer: 'Intelligence',
                color: '#0369a1',
                bg: 'bg-sky-50',
                border: 'border-sky-200',
                items: [
                  { icon: Brain,       label: 'AI & ML Models' },
                  { icon: Satellite,   label: 'Satellite Monitoring' },
                  { icon: BarChart2,   label: 'Predictive Analytics' },
                  { icon: Database,    label: 'Data Intelligence' },
                ],
              },
              {
                layer: 'Delivery',
                color: '#7c2d12',
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                items: [
                  { icon: MessageSquare, label: 'Multi-channel Messaging' },
                  { icon: Code,          label: 'REST APIs' },
                  { icon: Cloud,         label: 'Cloud-native' },
                  { icon: Layers,        label: 'Open Standards' },
                ],
              },
            ].map((row, ri) => (
              <motion.div
                key={row.layer}
                {...(reduced ? {} : {
                  initial: { opacity: 0, x: ri % 2 === 0 ? -30 : 30 },
                  whileInView: { opacity: 1, x: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.5, delay: ri * 0.1 },
                })}
                className="mb-4"
              >
                <div className={`${row.bg} ${row.border} border rounded-2xl p-5`}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: row.color }}>
                    <span className="w-5 h-0.5 inline-block" style={{ background: row.color }} />
                    {row.layer} Layer
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {row.items.map((item, ii) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          {...(reduced ? {} : {
                            initial: { opacity: 0, scale: 0.8 },
                            whileInView: { opacity: 1, scale: 1 },
                            viewport: { once: true },
                            transition: { duration: 0.3, delay: ri * 0.1 + ii * 0.05 },
                          })}
                          className="bg-white rounded-xl p-4 flex flex-col items-center gap-2.5 text-center border border-white shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${row.color}18` }}>
                            <Icon className="w-4.5 h-4.5" style={{ color: row.color }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 leading-tight">{item.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                {/* Connector arrow between layers */}
                {ri < 2 && (
                  <div className="flex justify-center my-1" aria-hidden="true">
                    <ChevronRight className="w-5 h-5 text-gray-300 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden bg-[#051f12]">
        {/* Background photograph — field team with technology */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#051f12]/90 via-[#0B4D2E]/80 to-[#051f12]/95" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.h2 {...revealUp()} className="text-4xl md:text-5xl font-heading font-bold text-white mb-5">
            Ready to transform your programme?
          </motion.h2>
          <motion.p {...revealUp(0.08)} className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Whether you need a single platform or a fully managed deployment — our team is ready to design the right solution for you.
          </motion.p>
          <motion.div {...revealUp(0.14)} className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={openBookDemo}
              className="rounded-full px-10 py-4 bg-brand hover:bg-brand/90 text-white font-bold text-base h-auto shadow-2xl shadow-brand/30"
            >
              Book a Demo <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              onClick={() => scrollTo('products')}
              variant="outline"
              className="rounded-full px-10 py-4 border-white/25 text-white hover:bg-white/10 bg-transparent font-semibold text-base h-auto"
            >
              Explore Products
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
