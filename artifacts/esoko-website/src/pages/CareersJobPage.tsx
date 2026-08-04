import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams } from 'wouter';
import {
  ArrowLeft, MapPin, Briefcase, TrendingUp, Clock, Calendar,
  CheckCircle2, Lightbulb, Zap, Users, Star, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { JOBS } from '@/data/careers';

/* ── Easing ──────────────────────────────────────────────────────── */
const E: [number, number, number, number] = [0.22, 1, 0.36, 1];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fp(reduced: boolean, hidden: any, visible: any, delay = 0, dur = 0.6): any {
  if (reduced) return { initial: visible, animate: visible };
  return { initial: hidden, animate: visible, transition: { duration: dur, ease: E, delay } };
}

/* ── Dept colour ─────────────────────────────────────────────────── */
const DEPT_COLORS: Record<string, string> = {
  Engineering:  'bg-blue-50 text-blue-700 border-blue-100',
  Product:      'bg-purple-50 text-purple-700 border-purple-100',
  Agriculture:  'bg-emerald-50 text-emerald-700 border-emerald-100',
  Operations:   'bg-amber-50 text-amber-700 border-amber-100',
  Marketing:    'bg-rose-50 text-rose-700 border-rose-100',
  Finance:      'bg-teal-50 text-teal-700 border-teal-100',
  HR:           'bg-indigo-50 text-indigo-700 border-indigo-100',
};

export default function CareersJobPage() {
  const { id } = useParams<{ id: string }>();
  const reduced = useReducedMotion() ?? false;

  const job = JOBS.find(j => j.id === id);

  /* ── Not found ───────────────────────────────────────────────────── */
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-40 text-center px-4">
          <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-6" />
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-3">Position Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-sm">This position may have been filled or removed. Browse our current openings below.</p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
            <Link href="/careers">← View All Positions</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const deptColor = DEPT_COLORS[job.department] ?? 'bg-gray-50 text-gray-700 border-gray-100';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #042B10 0%, #0a3d1a 60%, #1a4a2e 100%)' }}>
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div
            {...fp(reduced, { opacity: 0, x: -16 }, { opacity: 1, x: 0 }, 0, 0.45)}
            className="flex items-center gap-2 text-white/40 text-sm mb-8"
          >
            <Link href="/careers" className="hover:text-white/70 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Careers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span className="text-white/60">{job.department}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span className="text-white/80 font-medium truncate max-w-xs">{job.title}</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <motion.span
                {...fp(reduced, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.05)}
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-4 ${deptColor}`}
              >
                {job.department}
              </motion.span>
              <motion.h1
                {...fp(reduced, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.1, 0.7)}
                className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-5 leading-[1.1]"
              >
                {job.title}
              </motion.h1>
              <motion.div
                {...fp(reduced, { opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.2)}
                className="flex flex-wrap gap-4 text-white/60 text-sm"
              >
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-400" /> {job.type}</span>
                <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-emerald-400" /> {job.experience}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> Posted {job.postedDaysAgo} days ago</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#D9531E]" /> Deadline: {job.deadline}</span>
              </motion.div>
            </div>

            <motion.div
              {...fp(reduced, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1 }, 0.25)}
              className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end"
            >
              <Button className="bg-[#D9531E] hover:bg-[#C84B16] text-white rounded-full px-8 h-12 text-sm font-semibold shadow-[0_6px_24px_rgba(217,83,30,0.45)] whitespace-nowrap">
                Apply Now
              </Button>
              <Button variant="outline" className="rounded-full px-6 h-12 text-sm border-white/25 text-white/80 hover:bg-white/10 bg-transparent whitespace-nowrap">
                Save for Later
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About the role */}
            <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 })}>
              <SectionHeading icon={Lightbulb} label="About the Role" />
              <p className="text-gray-600 leading-relaxed">{job.about}</p>
            </motion.section>

            {/* Responsibilities */}
            <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.05)}>
              <SectionHeading icon={CheckCircle2} label="Key Responsibilities" />
              <ul className="space-y-3">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </span>
                    <span className="text-gray-600 text-sm leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Requirements */}
            <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.1)}>
              <SectionHeading icon={Star} label="Required Qualifications" />
              <ul className="space-y-3">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-3 h-3 text-blue-500" />
                    </span>
                    <span className="text-gray-600 text-sm leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Nice to have */}
            {job.niceToHave.length > 0 && (
              <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.15)}>
                <SectionHeading icon={Zap} label="Nice to Have" />
                <ul className="space-y-3">
                  {job.niceToHave.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Zap className="w-3 h-3 text-amber-500" />
                      </span>
                      <span className="text-gray-600 text-sm leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Benefits */}
            <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.2)}>
              <SectionHeading icon={Users} label="What We Offer" />
              <div className="flex flex-wrap gap-2">
                {job.benefits.map(b => (
                  <span key={b} className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-1.5 rounded-full text-sm font-medium">
                    {b}
                  </span>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply CTA */}
            <motion.div
              {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.15)}
              className="bg-gradient-to-br from-[#042B10] to-[#0a3d1a] rounded-3xl p-7 text-center sticky top-28"
            >
              <div className="w-12 h-12 bg-emerald-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-heading font-bold text-white text-lg mb-2">Interested?</h3>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                We'd love to hear from you. Send us your CV and a short note about why you'd be a great fit.
              </p>
              <Button className="w-full bg-[#D9531E] hover:bg-[#C84B16] text-white rounded-full h-11 font-semibold mb-3 shadow-[0_4px_20px_rgba(217,83,30,0.4)]">
                Apply Now
              </Button>
              <Button variant="outline" className="w-full rounded-full h-10 text-sm border-white/20 text-white/70 hover:bg-white/10 bg-transparent">
                Save Position
              </Button>

              {/* Skills */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/40 text-xs uppercase font-semibold tracking-widest mb-3">Key Skills</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {job.skills.map(s => (
                    <span key={s} className="bg-white/10 text-white/70 px-3 py-1 rounded-full text-xs">{s}</span>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-2 justify-center text-white/40 text-xs">
                <Calendar className="w-3.5 h-3.5 text-[#D9531E]" />
                <span>Applications close {job.deadline}</span>
              </div>
            </motion.div>

            {/* Other jobs */}
            <motion.div
              {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.25)}
              className="bg-gray-50 rounded-3xl p-6"
            >
              <h4 className="font-heading font-bold text-gray-800 text-sm mb-4">More Open Positions</h4>
              <div className="space-y-3">
                {JOBS.filter(j => j.id !== job.id).slice(0, 4).map(j => (
                  <Link key={j.id} href={`/careers/${j.id}`} className="block group">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-emerald-700 transition-colors leading-snug">{j.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{j.department} · {j.location}</p>
                  </Link>
                ))}
              </div>
              <Link href="/careers" className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                View all positions <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Bottom Apply CTA ────────────────────────────────────────── */}
      <section className="border-t border-gray-100 py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-xl mb-1">{job.title}</h3>
            <p className="text-gray-500 text-sm">{job.location} · {job.type} · Deadline: {job.deadline}</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button asChild variant="outline" className="rounded-full px-6 border-gray-200">
              <Link href="/careers">← All Jobs</Link>
            </Button>
            <Button className="bg-[#D9531E] hover:bg-[#C84B16] text-white rounded-full px-8 shadow-[0_4px_20px_rgba(217,83,30,0.35)]">
              Apply Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Section heading helper ─────────────────────────────────────────── */
function SectionHeading({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
        <Icon className="w-4 h-4 text-emerald-600" />
      </div>
      <h2 className="font-heading font-bold text-gray-900 text-xl">{label}</h2>
    </div>
  );
}
