import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  BookOpen, Calendar, Headphones, Video, FileText, Users,
  ArrowRight, Search, Loader2,
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { ResourceCard, ResourceCardSkeleton } from '@/components/resources/ResourceCard';
import type { ResourceListItem } from '@/lib/resources';
import { ALL_PUBLIC_TYPES, TYPE_LABELS } from '@/lib/resources';

/* ── Constants ──────────────────────────────────────────────────── */
const TYPE_META: Record<string, { icon: React.ElementType; desc: string; grad: string; iconColor: string }> = {
  blog:               { icon: BookOpen,  desc: 'Insights on African agriculture, technology, and impact', grad: 'from-blue-500 to-blue-700',    iconColor: 'text-blue-100' },
  events:             { icon: Calendar,  desc: 'Conferences, field days, and partner summits',           grad: 'from-purple-500 to-purple-700', iconColor: 'text-purple-100' },
  podcasts:           { icon: Headphones,desc: 'Conversations with farmers, policymakers, and innovators', grad: 'from-amber-500 to-orange-600', iconColor: 'text-amber-100' },
  webinars:           { icon: Video,     desc: 'Live and on-demand learning from Esoko experts',          grad: 'from-rose-500 to-rose-700',    iconColor: 'text-rose-100' },
  research:           { icon: FileText,  desc: 'Data-driven analysis of African food systems',            grad: 'from-emerald-500 to-green-700', iconColor: 'text-emerald-100' },
  'customer-stories': { icon: Users,     desc: 'How organisations are transforming agriculture with Esoko', grad: 'from-teal-500 to-teal-700',  iconColor: 'text-teal-100' },
};

/* ── Motion helper ──────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fp(hidden: any, visible: any, delay = 0): any {
  return { initial: hidden, whileInView: visible, viewport: { once: true }, transition: { duration: 0.5, delay } };
}

export default function ResourcesPage() {
  const base = import.meta.env.BASE_URL;

  const [featured, setFeatured] = useState<ResourceListItem[]>([]);
  const [recent,   setRecent]   = useState<ResourceListItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    document.title = 'Knowledge & Resources | Esoko';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = 'Explore Esoko\'s library of blog posts, research reports, podcasts, webinars, events, and customer success stories.';
    return () => {
      document.title = 'Esoko — Agricultural Market Data & Advisory Services';
      const m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (m) m.content = 'Esoko connects farmers, traders, and agribusiness to real-time agricultural market information, price alerts, and agronomy advisory services across Africa.';
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      fetch(`${base}api/resources?featured=true&limit=6`).then(r => r.ok ? r.json() : { resources: [] }),
      fetch(`${base}api/resources?limit=9`).then(r => r.ok ? r.json() : { resources: [] }),
    ]).then(([featuredRes, recentRes]) => {
      if (cancelled) return;
      setFeatured((featuredRes.resources ?? []).slice(0, 3));
      // Exclude IDs already shown as featured from recent feed
      const featuredIds = new Set((featuredRes.resources ?? []).slice(0, 3).map((r: ResourceListItem) => r.id));
      setRecent((recentRes.resources ?? []).filter((r: ResourceListItem) => !featuredIds.has(r.id)).slice(0, 6));
    }).catch(() => {
      // silently fail — empty states cover this
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [base]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `${import.meta.env.BASE_URL}resources/blog?search=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg, #051c0e 0%, #0a2e18 60%, #0d3820 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 15% 60%, #22c55e 0%, transparent 45%), radial-gradient(circle at 85% 20%, #D9531E 0%, transparent 40%)' }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.span
            {...fp({ opacity: 0, y: 12 }, { opacity: 1, y: 0 })}
            className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-emerald-400 mb-5 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20"
          >
            Knowledge Hub
          </motion.span>
          <motion.h1
            {...fp({ opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.08)}
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white max-w-3xl mx-auto leading-tight mb-5"
          >
            Knowledge &amp; Resources
          </motion.h1>
          <motion.p
            {...fp({ opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.16)}
            className="text-white/60 text-lg max-w-xl mx-auto mb-10"
          >
            Data, insights, and stories from the frontier of African agricultural technology.
          </motion.p>
          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            {...fp({ opacity: 0, y: 12 }, { opacity: 1, y: 0 }, 0.24)}
            className="flex items-center max-w-lg mx-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 gap-3 focus-within:border-white/40 transition-colors"
          >
            <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resources…"
              className="flex-1 bg-transparent text-white placeholder-white/40 text-sm focus:outline-none"
            />
            <button type="submit" className="text-xs font-semibold text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full">
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* ── Type navigation grid ─────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            {...fp({ opacity: 0, y: 16 }, { opacity: 1, y: 0 })}
            className="text-2xl font-heading font-bold text-gray-900 mb-8 text-center"
          >
            Browse by Type
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ALL_PUBLIC_TYPES.map((slug, i) => {
              const meta = TYPE_META[slug];
              const Icon = meta?.icon ?? BookOpen;
              return (
                <motion.div
                  key={slug}
                  {...fp({ opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1 }, i * 0.06)}
                >
                  <Link href={`/resources/${slug}`}>
                    <div className="group flex flex-col items-center text-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta?.grad ?? 'from-gray-400 to-gray-600'} flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow`}>
                        <Icon className={`w-6 h-6 ${meta?.iconColor ?? 'text-white'}`} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{TYPE_LABELS[slug]}</p>
                      <p className="text-xs text-gray-400 leading-relaxed hidden md:block">{meta?.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured resources ───────────────────────────────────── */}
      {(loading || featured.length > 0) && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div {...fp({ opacity: 0, y: 16 }, { opacity: 1, y: 0 })} className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-bold text-gray-900">Featured</h2>
              <Link href="/resources/blog" className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map(i => <ResourceCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} index={i} variant="featured" />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Recent resources ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fp({ opacity: 0, y: 16 }, { opacity: 1, y: 0 })} className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900">Recent</h2>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map(i => <ResourceCardSkeleton key={i} />)}
            </div>
          ) : recent.length === 0 && featured.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No resources published yet.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon for articles, reports, and more.</p>
            </div>
          ) : recent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((r, i) => (
                <ResourceCard key={r.id} resource={r} index={i} variant="grid" />
              ))}
            </div>
          ) : null}

          {/* Loading spinner if still loading with no items yet */}
          {loading && featured.length === 0 && recent.length === 0 && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
