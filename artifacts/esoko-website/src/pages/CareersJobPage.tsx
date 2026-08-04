import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams } from 'wouter';
import {
  ArrowLeft, MapPin, Briefcase, TrendingUp, Clock, Calendar,
  CheckCircle2, Lightbulb, Zap, Users, Star, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { JOBS, type Job } from '@/data/careers';

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

/* ── Skeleton ────────────────────────────────────────────────────── */
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

export default function CareersJobPage() {
  const { id } = useParams<{ id: string }>();
  const reduced = useReducedMotion() ?? false;

  /* ── Fetch job from API; fall back to static on error ─────────── */
  const [job, setJob] = useState<Job | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>(JOBS);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetch(`${import.meta.env.BASE_URL}api/jobs/${id}`)
      .then(async res => {
        if (!res.ok) {
          if (res.status === 404) {
            // API doesn't know it — fall back to static
            const staticJob = JOBS.find(j => j.id === id);
            if (!cancelled) {
              if (staticJob) setJob(staticJob);
              else setNotFound(true);
            }
          } else {
            throw new Error(`HTTP ${res.status}`);
          }
          return;
        }
        const data = (await res.json()) as { job: Job };
        if (!cancelled) setJob(data.job);
      })
      .catch(() => {
        // Network error — fall back to static
        if (!cancelled) {
          const staticJob = JOBS.find(j => j.id === id);
          if (staticJob) setJob(staticJob);
          else setNotFound(true);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    // Also load all published jobs for the "more positions" sidebar
    fetch(`${import.meta.env.BASE_URL}api/jobs`)
      .then(async res => {
        if (!res.ok) return;
        const data = (await res.json()) as { jobs: Job[] };
        if (!cancelled && data.jobs.length > 0) setAllJobs(data.jobs);
      })
      .catch(() => { /* keep static fallback */ });

    return () => { cancelled = true; };
  }, [id]);

  /* ── Not found ───────────────────────────────────────────────────── */
  if (!loading && (notFound || !job)) {
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

  /* ── Loading skeleton ─────────────────────────────────────────── */
  if (loading || !job) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="py-16 bg-[#051c0e] px-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <Skeleton className="h-4 w-40 bg-white/10" />
            <Skeleton className="h-10 w-96 bg-white/10" />
            <Skeleton className="h-5 w-60 bg-white/10" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[100, 80, 90, 70, 85].map((w, i) => (
              <Skeleton key={i} className={`h-4 w-[${w}%]`} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const deptColor = DEPT_COLORS[job.department] ?? 'bg-gray-50 text-gray-700 border-gray-100';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 relative overflow-hidden" style={{ background: '#051c0e' }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 40%)' }} />
        <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
          {/* Breadcrumb */}
          <motion.div {...fp(reduced, { opacity: 0 }, { opacity: 1 }, 0, 0.4)} className="mb-6">
            <Link href="/careers" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> All Positions
            </Link>
          </motion.div>

          {/* Chips */}
          <motion.div {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.05)} className="flex flex-wrap gap-2 mb-5">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${deptColor}`}>{job.department}</span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/70">{job.type}</span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/70">{job.experience}</span>
          </motion.div>

          {/* Title */}
          <motion.h1 {...fp(reduced, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.1)} className="text-3xl md:text-5xl font-heading font-bold text-white mb-5 leading-tight">
            {job.title}
          </motion.h1>

          {/* Meta */}
          <motion.div {...fp(reduced, { opacity: 0 }, { opacity: 1 }, 0.2)} className="flex flex-wrap gap-4 text-white/60 text-sm mb-8">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />Posted {job.postedDaysAgo === 0 ? 'today' : `${job.postedDaysAgo}d ago`}</span>
            {job.deadline && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />Deadline: {job.deadline}</span>}
          </motion.div>

          {/* CTA */}
          <motion.div {...fp(reduced, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.25)}>
            <Button
              onClick={() => {
                const el = document.getElementById('apply-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#f97316] hover:bg-[#ea6a0a] text-white rounded-full px-8 py-6 text-base font-semibold shadow-xl shadow-orange-900/30"
            >
              Apply Now <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">

          {/* About */}
          <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.1)}>
            <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" /> About the Role
            </h2>
            <p className="text-gray-600 leading-relaxed">{job.about}</p>
          </motion.section>

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.15)}>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" /> What You'll Do
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{r}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.2)}>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-emerald-600" /> What We're Looking For
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />{r}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Nice to have */}
          {job.niceToHave.length > 0 && (
            <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.25)}>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" /> Nice to Have
              </h2>
              <ul className="space-y-3">
                {job.niceToHave.map((r, i) => (
                  <li key={i} className="flex gap-3 text-gray-500">
                    <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />{r}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <motion.section {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.3)}>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" /> What We Offer
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-xl text-emerald-800 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{b}
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Apply anchor */}
          <motion.section id="apply-section" {...fp(reduced, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.35)}>
            <div className="bg-gradient-to-br from-[#051c0e] to-[#0a3320] rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Ready to Join Us?</h2>
              <p className="text-white/60 text-sm mb-6">Send your CV and cover letter to <a href="mailto:careers@esoko.com" className="text-emerald-400 hover:underline">careers@esoko.com</a> quoting the role title, or use the button below.</p>
              <a
                href={`mailto:careers@esoko.com?subject=Application: ${encodeURIComponent(job.title)}`}
                className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6a0a] text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
              >
                Apply for {job.title} <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Key skills */}
          {job.skills.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-gray-900 text-sm mb-3">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s, i) => (
                  <span key={i} className="text-xs px-3 py-1 bg-white border border-gray-200 rounded-full text-gray-700 font-medium">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Quick facts */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-heading font-bold text-gray-900 text-sm mb-1">Quick Facts</h3>
            {[
              { icon: MapPin,     label: 'Location',   val: job.location },
              { icon: Briefcase,  label: 'Type',       val: job.type },
              { icon: TrendingUp, label: 'Level',      val: job.experience },
              { icon: Calendar,   label: 'Deadline',   val: job.deadline || 'Open' },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-700">{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* More positions */}
          {allJobs.filter(j => j.id !== job.id).length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="font-heading font-bold text-gray-900 text-sm mb-3">More Positions</h3>
              <div className="space-y-2">
                {allJobs.filter(j => j.id !== job.id).slice(0, 4).map(j => (
                  <Link key={j.id} href={`/careers/${j.id}`}
                    className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-colors group">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-emerald-700">{j.title}</p>
                      <p className="text-xs text-gray-400">{j.department}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 flex-shrink-0" />
                  </Link>
                ))}
              </div>
              <Link href="/careers" className="block text-xs text-emerald-600 hover:underline mt-3 text-center">
                View all openings →
              </Link>
            </div>
          )}
        </aside>
      </div>

      <Footer />
    </div>
  );
}
