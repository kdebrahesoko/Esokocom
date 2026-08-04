import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowRight, Play, ChevronDown, Search, Linkedin, Mail,
  Sprout, Cpu, Globe2, TrendingUp, Users, Rocket,
  Heart, BookOpen, Award, Briefcase, Clock, CheckCircle2,
  Stethoscope, GraduationCap, Laptop, Zap, Calendar, Star,
  ShieldCheck, Coffee, MapPin, Building2, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { useBookDemo } from '@/context/BookDemoContext';
import {
  JOBS, PROGRAMMES, FAQ_ITEMS, CAREERS_TEAM,
  type Department, type JobType, type Experience, type TeamCategory,
} from '@/data/careers';

/* ── Easing ─────────────────────────────────────────────────────────── */
const E: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── Motion helper ──────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fp(reduced: boolean, hidden: any, visible: any, delay = 0, dur = 0.65): any {
  if (reduced) return { initial: visible, animate: visible };
  return {
    initial: hidden,
    whileInView: visible,
    viewport: { once: true, margin: '-60px' },
    transition: { duration: dur, ease: E, delay },
  };
}

/* ── Count-up hook ──────────────────────────────────────────────────── */
import { useEffect } from 'react';
function useCountUp(target: number, inView: boolean, reduced: boolean, duration = 1600) {
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

/* ── Static data ────────────────────────────────────────────────────── */
const WHY_JOIN = [
  { icon: Sprout,   title: 'Purpose Driven',          desc: 'Build technology that improves lives and strengthens rural communities across Africa.',            grad: 'from-emerald-400 to-green-600' },
  { icon: Cpu,      title: 'Innovation Culture',       desc: 'Work with AI, cloud, satellite data, mobile technology, and the latest emerging platforms.',      grad: 'from-blue-400 to-blue-600' },
  { icon: Globe2,   title: 'African Impact',           desc: 'Create solutions actively used across 10+ African countries and growing every year.',             grad: 'from-amber-400 to-orange-500' },
  { icon: TrendingUp, title: 'Career Growth',          desc: 'Continuous learning, mentorship programmes, professional certifications, and leadership paths.',   grad: 'from-purple-400 to-violet-600' },
  { icon: Users,    title: 'Collaborative Environment', desc: 'Work with diverse teams spanning engineering, agriculture, business, and field operations.',      grad: 'from-rose-400 to-pink-600' },
  { icon: Rocket,   title: 'Global Vision',            desc: 'Help build agricultural technology with worldwide relevance — from Ghana to the world.',          grad: 'from-cyan-400 to-teal-600' },
];

const BENEFITS = [
  { icon: Stethoscope, label: 'Health Insurance',        desc: 'Comprehensive medical for you and family' },
  { icon: BookOpen,    label: 'Learning Budget',          desc: 'Annual allowance for courses & books' },
  { icon: Award,       label: 'Certifications',           desc: 'Professional certs paid by Esoko' },
  { icon: Clock,       label: 'Flexible Working',         desc: 'Hybrid and flexible hours by role' },
  { icon: TrendingUp,  label: 'Career Development',       desc: 'Regular performance reviews & growth plans' },
  { icon: Star,        label: 'Performance Bonuses',      desc: 'Rewarding impact-driven results' },
  { icon: Coffee,      label: 'Team Events',              desc: 'Team offsites, social events & retreats' },
  { icon: Globe2,      label: 'Conferences',              desc: 'Local and international conference attendance' },
  { icon: Laptop,      label: 'Modern Equipment',         desc: 'Latest hardware from day one' },
  { icon: Calendar,    label: 'Paid Leave',               desc: 'Generous leave and public holidays' },
  { icon: Building2,   label: 'Remote Options',           desc: 'Work from anywhere on eligible roles' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Application',       desc: 'Submit your CV and cover letter through our careers portal.' },
  { num: '02', title: 'HR Review',         desc: 'Our talent team reviews every application personally within 5 days.' },
  { num: '03', title: 'Assessment',        desc: 'A skills-based take-home task relevant to your role.' },
  { num: '04', title: 'Interview',         desc: 'A structured interview with your future team and manager.' },
  { num: '05', title: 'Leadership Round',  desc: 'A final conversation with a senior leader or director.' },
  { num: '06', title: 'Offer',             desc: 'A competitive offer with full package transparency.' },
  { num: '07', title: 'Welcome',           desc: 'Your first day — we make it memorable. Welcome to Esoko.' },
];

const TESTIMONIALS = [
  { quote: 'At Esoko, technology is not just about software. It is about changing people\'s lives.', name: 'Akosua Mensah', role: 'Senior Software Engineer', dept: 'Engineering', initials: 'AM', grad: 'from-blue-500 to-blue-700' },
  { quote: 'I came here to work on meaningful problems. Three years later, I am leading a team of twelve.', name: 'Kofi Asante', role: 'Product Manager', dept: 'Product', initials: 'KA', grad: 'from-emerald-500 to-green-700' },
  { quote: 'Nowhere else in Africa can you work on AI for agriculture at this scale and with this impact.', name: 'Amira Diallo', role: 'Data Scientist', dept: 'Engineering', initials: 'AD', grad: 'from-purple-500 to-purple-700' },
];

const DI_HIGHLIGHTS = ['Gender Inclusion', 'Equal Opportunity', 'Inclusive Hiring', 'Community Impact'];

const MOSAIC_IMAGES = [
  { src: '/about-hero.jpg',   alt: 'Esoko field agent at market', cls: 'row-span-2' },
  { src: '/hero-slide-2.jpg', alt: 'Esoko team with technology', cls: '' },
  { src: '/hero-slide-3.jpg', alt: 'Agricultural technology', cls: '' },
  { src: '/about-team.jpg',   alt: 'Esoko team group photo', cls: 'row-span-2' },
  { src: '/hero-slide-4.jpg', alt: 'Farmer with mobile device', cls: '' },
  { src: '/hero-slide-5.jpg', alt: 'Innovation in agriculture', cls: '' },
];

const HERO_STATS = [
  { num: 18, unit: '+', label: 'Years of Innovation' },
  { num: 2000000, unit: '+', label: 'Farmers Impacted', display: '2M+' },
  { num: 10, unit: '+', label: 'African Countries' },
  { num: 100, unit: '+', label: 'Professionals' },
];

/* ── Hero stat counter ──────────────────────────────────────────────── */
function StatCounter({ num, unit, label, display, inView, reduced }: {
  num: number; unit: string; label: string; display?: string;
  inView: boolean; reduced: boolean;
}) {
  const val = useCountUp(num, inView, reduced);
  const shown = display ?? `${val.toLocaleString()}${unit}`;
  return (
    <div className="flex flex-col items-center">
      <p className="text-3xl md:text-4xl font-heading font-bold text-white">{shown}</p>
      <p className="text-white/50 text-xs mt-1 text-center">{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                   */
/* ═══════════════════════════════════════════════════════════════════════ */

export default function CareersPage() {
  const { open: openBookDemo } = useBookDemo();
  const reduced = useReducedMotion() ?? false;

  /* Stat counters inView */
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  /* Open Positions filters */
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<Department | 'All'>('All');
  const [locFilter, setLocFilter] = useState<'All' | 'Ghana' | 'Africa' | 'Remote'>('All');
  const [typeFilter, setTypeFilter] = useState<JobType | 'All'>('All');
  const [expFilter, setExpFilter] = useState<Experience | 'All'>('All');

  const filteredJobs = JOBS.filter(j => {
    if (search && !`${j.title} ${j.department} ${j.skills.join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter !== 'All' && j.department !== deptFilter) return false;
    if (typeFilter !== 'All' && j.type !== typeFilter) return false;
    if (expFilter !== 'All' && j.experience !== expFilter) return false;
    if (locFilter !== 'All') {
      if (locFilter === 'Remote' && !j.location.includes('Remote')) return false;
      if (locFilter === 'Ghana' && !j.location.includes('Accra') && !j.location.includes('Ghana')) return false;
      // 'Africa' shows all
    }
    return true;
  });

  /* Team filter */
  const [teamFilter, setTeamFilter] = useState<TeamCategory | 'All'>('All');
  const filteredTeam = teamFilter === 'All' ? CAREERS_TEAM : CAREERS_TEAM.filter(m => m.category === teamFilter);

  /* FAQ open state */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── Video modal ── */
  const [videoOpen, setVideoOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const openVideo = () => setVideoOpen(true);
  const closeVideo = () => { setVideoOpen(false); requestAnimationFrame(() => playRef.current?.focus()); };

  useEffect(() => {
    if (!videoOpen) return;
    requestAnimationFrame(() => closeRef.current?.focus());
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeVideo(); return; }
      if (e.key === 'Tab' && dialogRef.current) {
        const nodes = dialogRef.current.querySelectorAll<HTMLElement>('button, iframe, [tabindex]:not([tabindex="-1"])');
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus(); } }
        else { if (document.activeElement === last) { e.preventDefault(); first?.focus(); } }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ══ S1 HERO ═════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#051c0e' }}>
        <div className="absolute inset-0">
          <img src="/hero-slide-1.jpg" alt="Esoko team at work" className="w-full h-full object-cover object-center" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051c0e]/85 via-[#051c0e]/65 to-[#051c0e]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#051c0e]/50 via-transparent to-[#051c0e]/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-40 md:py-52">
          <motion.span
            {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0, 0.5)}
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-6 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20"
          >
            Careers at Esoko
          </motion.span>

          <motion.h1
            {...fp(reduced, { opacity: 0, y: 32 }, { opacity: 1, y: 0 }, 0.1, 0.7)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white max-w-5xl mx-auto leading-[1.06] mb-6"
          >
            Build Technology That<br className="hidden md:block" />{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-[#D9531E] bg-clip-text text-transparent">
              Transforms Africa
            </span>
          </motion.h1>

          <motion.p
            {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.25, 0.65)}
            className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join Esoko and help create digital solutions that connect millions of farmers, empower communities, and build a sustainable agricultural future.
          </motion.p>

          <motion.div
            {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.38, 0.55)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              asChild
              className="bg-[#D9531E] hover:bg-[#C84B16] text-white rounded-full px-8 h-13 text-base font-semibold shadow-[0_8px_32px_rgba(217,83,30,0.45)]"
            >
              <a href="#open-positions">View Open Positions <ArrowRight className="ml-2 w-4 h-4" /></a>
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 h-13 text-base font-semibold border-white/30 text-white hover:bg-white/10 hover:border-white/50 bg-transparent"
            >
              Join Talent Community
            </Button>
            <button
              ref={playRef}
              onClick={openVideo}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full px-2"
              aria-label="Watch Life at Esoko video"
            >
              <span className="w-9 h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center hover:bg-white/25 transition-colors">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              </span>
              Watch Life at Esoko
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            ref={statsRef}
            {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.5, 0.55)}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto border-t border-white/10 pt-10"
          >
            {HERO_STATS.map(s => (
              <StatCounter key={s.label} {...s} inView={statsInView} reduced={reduced} />
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={reduced ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/30" />
        </motion.div>
      </section>

      {/* ══ S2 WHY JOIN ═════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
              Why Esoko
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Why Join Esoko?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Work with passionate people solving meaningful challenges across agriculture, technology, and sustainability.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_JOIN.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  {...fp(reduced, { opacity: 0, y: 24, scale: 0.97 }, { opacity: 1, y: 0, scale: 1 }, i * 0.07)}
                  className="group relative bg-white border border-gray-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)]
                    transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(0,0,0,0.1)] hover:border-gray-200 cursor-default"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.grad} flex items-center justify-center mb-5 shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">{c.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{c.desc}</p>
                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br ${c.grad} opacity-0 group-hover:opacity-[0.04]`} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ S3 LIFE AT ESOKO ════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #061a0d 0%, #0a2010 100%)' }}>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
              Our Culture
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Life at Esoko</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From Accra to the field, we are building something extraordinary — together.
            </p>
          </motion.div>

          {/* Photo mosaic */}
          <motion.div
            {...fp(reduced, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1 }, 0.1, 0.7)}
            className="grid grid-cols-3 grid-rows-2 gap-3 h-[420px] mb-16 rounded-3xl overflow-hidden"
          >
            {MOSAIC_IMAGES.map((img, i) => (
              <div key={i} className={`overflow-hidden ${img.cls}`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" loading="lazy" />
              </div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                {...fp(reduced, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, i * 0.1)}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:border-white/20 transition-colors"
              >
                <p className="text-white/80 text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-bold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role} · {t.dept}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Video card */}
          <motion.div
            {...fp(reduced, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1 }, 0.2, 0.7)}
            className="relative mx-auto max-w-4xl group"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/15 transition-transform duration-500 group-hover:scale-[1.012]">
              <img src="/hero-slide-2.jpg" alt="Life at Esoko" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={openVideo}
                  aria-label="Watch Life at Esoko video (opens video)"
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-2xl hover:bg-white/30 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </button>
              </div>
              <div className="absolute bottom-6 left-7 pointer-events-none">
                <p className="text-white font-heading font-bold text-xl">Life at Esoko</p>
                <p className="text-white/50 text-sm">See what drives us every day</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ S4 OPEN POSITIONS ═══════════════════════════════════════════ */}
      <section id="open-positions" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
              Open Roles
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Explore Opportunities</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Find a role where your skills create meaningful impact across African agriculture.
            </p>
          </motion.div>

          {/* Search + Filters */}
          <motion.div
            {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.1)}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8"
          >
            {/* Search bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search by title, department, or skill…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-gray-50"
              />
            </div>

            {/* Filter chips row */}
            <div className="flex flex-wrap gap-3">
              {/* Department */}
              <FilterSelect
                label="Department"
                value={deptFilter}
                onChange={v => setDeptFilter(v as Department | 'All')}
                options={['All', 'Engineering', 'Product', 'Agriculture', 'Operations', 'Marketing', 'Finance', 'HR']}
              />
              {/* Location */}
              <FilterSelect
                label="Location"
                value={locFilter}
                onChange={v => setLocFilter(v as 'All' | 'Ghana' | 'Africa' | 'Remote')}
                options={['All', 'Ghana', 'Africa', 'Remote']}
              />
              {/* Type */}
              <FilterSelect
                label="Type"
                value={typeFilter}
                onChange={v => setTypeFilter(v as JobType | 'All')}
                options={['All', 'Full Time', 'Contract', 'Internship', 'Graduate']}
              />
              {/* Experience */}
              <FilterSelect
                label="Experience"
                value={expFilter}
                onChange={v => setExpFilter(v as Experience | 'All')}
                options={['All', 'Entry Level', 'Mid Level', 'Senior', 'Leadership']}
              />
              {(search || deptFilter !== 'All' || locFilter !== 'All' || typeFilter !== 'All' || expFilter !== 'All') && (
                <button
                  onClick={() => { setSearch(''); setDeptFilter('All'); setLocFilter('All'); setTypeFilter('All'); setExpFilter('All'); }}
                  className="text-xs text-gray-500 hover:text-gray-800 underline underline-offset-2 px-2"
                >
                  Clear all
                </button>
              )}
            </div>
          </motion.div>

          {/* Job count */}
          <p className="text-sm text-gray-500 mb-5">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} found
          </p>

          {/* Job cards */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No positions match your filters.</p>
              <button onClick={() => { setSearch(''); setDeptFilter('All'); setLocFilter('All'); setTypeFilter('All'); setExpFilter('All'); }} className="mt-2 text-sm text-emerald-600 hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, i * 0.04)}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${DEPT_COLORS[job.department] ?? 'bg-gray-100 text-gray-600'}`}>
                      {job.department}
                    </span>
                    <span className="text-xs text-gray-400">Posted {job.postedDaysAgo}d ago</span>
                  </div>
                  <h3 className="font-heading font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-700 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Briefcase className="w-3.5 h-3.5" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <TrendingUp className="w-3.5 h-3.5" /> {job.experience}
                    </span>
                  </div>
                  <Link
                    href={`/careers/${job.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group-hover:gap-3 transition-all"
                  >
                    View Position <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ S5 INTERNSHIP & GRADUATE ════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#D9531E]/80 mb-4 bg-orange-50 px-5 py-2 rounded-full border border-orange-100">
              Early Careers
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Start Your Technology Journey With Esoko
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Develop your skills while contributing to meaningful digital agriculture solutions that change lives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMMES.map((p, i) => (
              <motion.div
                key={p.id}
                {...fp(reduced, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, i * 0.08)}
                className="relative bg-white border border-gray-100 rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300"
              >
                <span className={`text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block ${p.type === 'Internship' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {p.type}
                </span>
                <h3 className="font-heading font-bold text-gray-900 text-lg mb-1">{p.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                  <Clock className="w-3.5 h-3.5" /> {p.duration}
                </div>
                <p className="text-sm text-gray-500 mb-4"><span className="font-medium text-gray-700">Eligibility:</span> {p.eligibility}</p>
                <ul className="space-y-1.5 mb-6">
                  {p.outcomes.map(o => (
                    <li key={o} className="flex items-start gap-2 text-xs text-gray-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" /> {o}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" size="sm" className="w-full rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  Apply Now
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ S6 RECRUITMENT PROCESS ══════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #061a0d 0%, #0a2010 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
              The Process
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Our Recruitment Process</h2>
            <p className="text-white/50 max-w-xl mx-auto">Simple, transparent, and respectful of your time — typically 3 to 5 weeks end to end.</p>
          </motion.div>

          {/* Horizontal scrollable timeline */}
          <div className="overflow-x-auto hide-scrollbar pb-6">
            <div className="relative flex items-start min-w-max px-6 md:px-12 gap-0">
              {/* Connecting track */}
              <div className="absolute top-8 left-20 right-20 h-px bg-white/10" />
              <motion.div
                className="absolute top-8 left-20 h-px bg-gradient-to-r from-emerald-500 to-[#D9531E]"
                {...(reduced
                  ? { style: { width: 'calc(100% - 10rem)' } }
                  : { initial: { width: 0 }, whileInView: { width: 'calc(100% - 10rem)' }, viewport: { once: true }, transition: { duration: 2.2, ease: 'easeOut', delay: 0.3 } }
                )}
              />

              {PROCESS_STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, i * 0.1)}
                  className="relative flex flex-col items-center w-40 flex-shrink-0"
                >
                  {/* Node */}
                  <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4
                    ${i === 6 ? 'bg-gradient-to-br from-[#D9531E] to-[#C84B16] shadow-[0_0_24px_rgba(217,83,30,0.5)]' : 'bg-white/10 border border-white/20 backdrop-blur-sm'}`}>
                    <span className={`font-heading font-bold text-sm ${i === 6 ? 'text-white' : 'text-emerald-400'}`}>{step.num}</span>
                  </div>
                  <h4 className={`text-sm font-bold text-center mb-1.5 ${i === 6 ? 'text-[#D9531E]' : 'text-white'}`}>{step.title}</h4>
                  <p className="text-white/40 text-[11px] text-center leading-relaxed px-2">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ S7 BENEFITS ═════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
              Perks & Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">We Take Care of Our Team</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Competitive, comprehensive benefits to support your work, health, and growth.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.label}
                  {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, i * 0.04)}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-100 hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-colors">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{b.label}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ S8 DIVERSITY & INCLUSION ════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-slide-4.jpg" alt="Diverse Esoko team" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#042B10]/97 via-[#042B10]/85 to-[#042B10]/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <div className="max-w-2xl">
            <motion.span
              {...fp(reduced, { opacity: 0, x: -20 }, { opacity: 1, x: 0 })}
              className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-5 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20"
            >
              Diversity & Inclusion
            </motion.span>
            <motion.h2
              {...fp(reduced, { opacity: 0, x: -24 }, { opacity: 1, x: 0 }, 0.1, 0.7)}
              className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-[1.1]"
            >
              Innovation Happens When<br className="hidden md:block" /> Everyone Belongs
            </motion.h2>
            <motion.p
              {...fp(reduced, { opacity: 0, x: -20 }, { opacity: 1, x: 0 }, 0.2, 0.65)}
              className="text-white/65 text-lg leading-relaxed mb-10"
            >
              Esoko values diverse perspectives and creates an inclusive environment where people from different backgrounds can contribute, grow, and succeed. Our team of 30+ nationalities is our greatest strength.
            </motion.p>
            <motion.div
              {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.3)}
              className="flex flex-wrap gap-3"
            >
              {DI_HIGHLIGHTS.map(h => (
                <span key={h} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-5 py-2 rounded-full">
                  {h}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ S9 MEET THE TEAM ════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
              The People
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Talented people from across Africa and beyond — united by a mission to transform agriculture.</p>
          </motion.div>

          {/* Category filters */}
          <motion.div
            {...fp(reduced, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.1)}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {(['All', 'Leadership', 'Technology', 'Operations', 'Agriculture'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setTeamFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${teamFilter === cat
                    ? 'bg-emerald-600 text-white shadow-[0_4px_16px_rgba(5,150,105,0.4)]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredTeam.map((m, i) => (
                <motion.div
                  key={m.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: reduced ? 0 : i * 0.05 }}
                  className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className={`h-40 bg-gradient-to-br ${m.grad} relative flex items-center justify-center`}>
                    <span className="text-4xl font-heading font-bold text-white/90 z-10">{m.initials}</span>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -top-3 -left-3 w-14 h-14 rounded-full bg-white/10" />
                  </div>
                  <div className="p-4">
                    <p className="font-heading font-bold text-gray-900 text-sm leading-snug">{m.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 mb-3 leading-snug">{m.role}</p>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{m.bio}</p>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button aria-label={`${m.name} LinkedIn`} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors">
                        <Linkedin className="w-3.5 h-3.5 text-gray-500 hover:text-blue-600" />
                      </button>
                      <button aria-label={`Email ${m.name}`} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══ S10 FAQ ══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <motion.div {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })} className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
              FAQs
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Common Questions</h2>
            <p className="text-gray-500">Everything you need to know about working at Esoko.</p>
          </motion.div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                {...fp(reduced, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, i * 0.05)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(prev => prev === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-2xl"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-gray-800 text-sm pr-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-500 text-sm leading-relaxed px-6 pb-5">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero-slide-5.jpg" alt="Future of African agriculture" className="w-full h-full object-cover animate-hero-zoom" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#042B10]/90 via-[#042B10]/80 to-[#042B10]/95" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
          <motion.div {...fp(reduced, { opacity: 0, y: 24 }, { opacity: 1, y: 0 })} className="max-w-3xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-6 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
              Join the Mission
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-[1.1]">
              Ready to Build the<br className="hidden md:block" /> Future of Agriculture?
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Your next role could help feed millions. Take a look at our open positions and find where you belong.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                className="bg-[#D9531E] hover:bg-[#C84B16] text-white rounded-full px-8 h-13 text-base font-semibold shadow-[0_8px_32px_rgba(217,83,30,0.45)]"
              >
                <a href="#open-positions">Browse Jobs <ArrowRight className="ml-2 w-4 h-4" /></a>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 h-13 text-base font-semibold border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                Submit Your CV
              </Button>
              <Button
                variant="outline"
                onClick={openBookDemo}
                className="rounded-full px-8 h-13 text-base font-semibold border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10 bg-transparent"
              >
                Join Talent Community
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* ══ VIDEO MODAL ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/92 backdrop-blur-sm cursor-pointer" onClick={closeVideo} aria-hidden />
            <motion.div
              ref={dialogRef}
              role="dialog" aria-modal="true" aria-label="Life at Esoko video"
              className="relative w-full max-w-5xl"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                ref={closeRef}
                onClick={closeVideo}
                aria-label="Close video"
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
              >
                <span>Close</span><span className="text-lg leading-none" aria-hidden>✕</span>
              </button>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10">
                <iframe
                  src="https://www.youtube-nocookie.com/embed/5TRjt4fyrU0?autoplay=1&rel=0"
                  title="Life at Esoko"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen className="w-full h-full" tabIndex={0}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Filter select helper ─────────────────────────────────────────────── */
function FilterSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`pl-3 pr-8 py-2 rounded-xl border text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-400/30 cursor-pointer transition-colors
          ${value !== 'All'
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
          }`}
        aria-label={`Filter by ${label}`}
      >
        {options.map(o => (
          <option key={o} value={o}>{o === 'All' ? `${label}: All` : o}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-current opacity-50 pointer-events-none" />
    </div>
  );
}

/* ── Department colour map ────────────────────────────────────────────── */
const DEPT_COLORS: Record<string, string> = {
  Engineering:  'bg-blue-50 text-blue-700',
  Product:      'bg-purple-50 text-purple-700',
  Agriculture:  'bg-emerald-50 text-emerald-700',
  Operations:   'bg-amber-50 text-amber-700',
  Marketing:    'bg-rose-50 text-rose-700',
  Finance:      'bg-teal-50 text-teal-700',
  HR:           'bg-indigo-50 text-indigo-700',
};
