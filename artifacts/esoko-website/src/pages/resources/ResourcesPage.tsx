import { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import {
  BookOpen, Calendar, Headphones, Video, FileText, Users,
  ArrowRight, Search, X, ChevronDown, Loader2, Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { ResourceCard, ResourceCardSkeleton } from '@/components/resources/ResourceCard';
import type { ResourceListItem } from '@/lib/resources';
import {
  PUBLIC_TYPE_TO_API, API_TYPE_TO_PUBLIC, TYPE_LABELS,
  formatResourceDate, resolveImageUrl, estimateReadTime,
} from '@/lib/resources';
import type { ResourceCategory } from '@/lib/resources';

/* ── Constants ───────────────────────────────────────────────────── */
// Only the six canonical DB content types are shown as browsable category cards.
// "reports" and "guides" are client-side aliases that share backend types with
// research-report and blog respectively — they have no dedicated counts and
// showing them as distinct categories would display misleading "Coming Soon"
// badges while content actually exists under their aliased types.
const CATEGORY_CARDS = [
  { slug: 'blog',             icon: BookOpen,   grad: 'from-blue-500 to-blue-700',      iconColor: 'text-blue-100',    desc: 'Insights on African agriculture, technology, and impact',  unit: 'Article' },
  { slug: 'events',           icon: Calendar,   grad: 'from-purple-500 to-purple-700',  iconColor: 'text-purple-100',  desc: 'Conferences, field days, and partner summits',              unit: 'Event'   },
  { slug: 'podcasts',         icon: Headphones, grad: 'from-amber-500 to-orange-600',   iconColor: 'text-amber-100',   desc: 'Conversations with farmers, policymakers, and innovators',  unit: 'Episode' },
  { slug: 'webinars',         icon: Video,      grad: 'from-rose-500 to-rose-700',      iconColor: 'text-rose-100',    desc: 'Live and on-demand learning from Esoko experts',            unit: 'Session' },
  { slug: 'research',         icon: FileText,   grad: 'from-emerald-500 to-green-700',  iconColor: 'text-emerald-100', desc: 'Data-driven analysis of African food systems',              unit: 'Report'  },
  { slug: 'customer-stories', icon: Users,      grad: 'from-teal-500 to-teal-700',      iconColor: 'text-teal-100',    desc: 'How organisations are transforming agriculture with Esoko',  unit: 'Story'   },
] as const;

const TYPE_PILLS = [
  { label: 'All',             slug: 'all' },
  { label: 'Blog',            slug: 'blog' },
  { label: 'Events',          slug: 'events' },
  { label: 'Podcasts',        slug: 'podcasts' },
  { label: 'Webinars',        slug: 'webinars' },
  { label: 'Research',        slug: 'research' },
  { label: 'Customer Stories',slug: 'customer-stories' },
  { label: 'Reports',         slug: 'reports' },
  { label: 'Guides',          slug: 'guides' },
];

// Topic and Country dropdowns are replaced by real category data fetched from the API.

function useDebounce<T>(value: T, ms: number): T {
  const [d, setD] = useState(value);
  useEffect(() => { const t = setTimeout(() => setD(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return d;
}

/* ── Fade-up helper (respects reduced-motion) ────────────────────── */
function fadeUp(delay = 0, reduced = false) {
  return reduced
    ? {}
    : {
        initial:     { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0  },
        viewport:    { once: true },
        transition:  { duration: 0.5, delay },
      };
}

/* ── Large featured card ─────────────────────────────────────────── */
function FeaturedHeroCard({ resource, base, reduced }: { resource: ResourceListItem; base: string; reduced: boolean }) {
  const imgSrc = resolveImageUrl(resource.featuredImageUrl, base);
  // resource.typeSlug is the API type slug (e.g. "event", "research-report");
  // convert to the public URL segment used in page routes.
  const pubSlug = API_TYPE_TO_PUBLIC[resource.typeSlug] ?? 'blog';
  const href = `/resources/${pubSlug}/${resource.slug}`;
  const readTime = estimateReadTime(resource.body);

  return (
    <motion.div {...fadeUp(0, reduced)}>
      <Link href={href}>
        <div className="group grid grid-cols-1 md:grid-cols-5 bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Image — 3/5 width */}
          <div className="md:col-span-3 relative min-h-[240px] md:min-h-[340px] overflow-hidden bg-gradient-to-br from-emerald-800 to-green-900">
            {imgSrc ? (
              <img src={imgSrc} alt={resource.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-20 h-20 text-emerald-600/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 md:to-black/30" />
            {resource.featured && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                <Sparkles className="w-3 h-3" /> Featured
              </div>
            )}
          </div>

          {/* Content — 2/5 width */}
          <div className="md:col-span-2 p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {resource.categoryName && (
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                    {resource.categoryName}
                  </span>
                )}
                <span className="text-xs text-gray-400">{TYPE_LABELS[resource.typeSlug] ?? resource.contentType}</span>
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug mb-3 line-clamp-3">
                {resource.title}
              </h3>
              {resource.shortDescription && (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5">
                  {resource.shortDescription}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
                <span>Esoko</span>
                <span>·</span>
                <span>{formatResourceDate(resource.publishedAt)}</span>
                <span>·</span>
                <span>{readTime} min read</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:gap-2.5 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Category card ───────────────────────────────────────────────── */
function CategoryCard({
  card, count, index, reduced,
}: {
  card: typeof CATEGORY_CARDS[number];
  count: number | undefined;
  index: number;
  reduced: boolean;
}) {
  const Icon = card.icon;
  const hasCount = count !== undefined && count > 0;

  return (
    <motion.div {...(reduced ? {} : {
      initial:     { opacity: 0, y: 20, scale: 0.97 },
      whileInView: { opacity: 1, y: 0,  scale: 1    },
      viewport:    { once: true },
      transition:  { duration: 0.45, delay: index * 0.06 },
    })}>
      <Link href={`/resources/${card.slug}`}>
        <div className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.grad} flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${card.iconColor}`} />
          </div>
          <p className="text-sm font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
            {TYPE_LABELS[card.slug]}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-3">{card.desc}</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            {hasCount ? (
              <>
                {count} {card.unit}{count !== 1 ? 's' : ''}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </>
            ) : (
              <span className="text-gray-300 font-medium">Coming Soon</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Dropdown ────────────────────────────────────────────────────── */
function SelectDropdown({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 cursor-pointer hover:border-gray-300 transition-colors"
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function ResourcesPage() {
  const base          = import.meta.env.BASE_URL ?? '/';
  const reduced       = useReducedMotion() ?? false;
  const [, navigate]  = useLocation();

  /* Refs */
  const contentRef  = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  /* Filter state */
  const [search,        setSearch]        = useState('');
  const [activeType,    setActiveType]    = useState('all');
  const [activeCategory,setActiveCategory]= useState(''); // category slug from real API data
  const [sortBy,        setSortBy]        = useState<'newest' | 'featured'>('newest');
  const debouncedSearch = useDebounce(search, 350);

  /* Categories fetched from /api/resource-categories */
  const [categories, setCategories] = useState<ResourceCategory[]>([]);

  /* Data state */
  const [featured,       setFeatured]       = useState<ResourceListItem[]>([]);
  const [counts,         setCounts]         = useState<Record<string, number>>({});
  const [latestItems,    setLatestItems]    = useState<ResourceListItem[]>([]);
  const [latestTotal,    setLatestTotal]    = useState(0);
  const [latestPage,     setLatestPage]     = useState(1);
  const [loadingFeatured,setLoadingFeatured]= useState(true);
  const [loadingCounts,  setLoadingCounts]  = useState(true);
  const [loadingLatest,  setLoadingLatest]  = useState(true);
  const [loadingMore,    setLoadingMore]    = useState(false);

  /* Filter change key — reset pagination when any filter changes */
  const filterKey = `${debouncedSearch}|${activeType}|${activeCategory}|${sortBy}`;
  const prevFilterKey = useRef(filterKey);

  useEffect(() => {
    if (filterKey !== prevFilterKey.current) {
      prevFilterKey.current = filterKey;
      setLatestPage(1);
      setLatestItems([]);
    }
  }, [filterKey]);

  /* SEO */
  useEffect(() => {
    document.title = 'Knowledge Hub | Esoko Resources';
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = 'Explore Esoko\'s library of blog posts, research reports, podcasts, webinars, events, and customer success stories shaping digital agriculture across Africa.';
    return () => {
      document.title = 'Esoko — Agricultural Market Data & Advisory Services';
      const m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (m) m.content = 'Esoko connects farmers, traders, and agribusiness to real-time agricultural market information.';
    };
  }, []);

  /* Fetch categories (once, for Topic dropdown) */
  useEffect(() => {
    fetch(`${base}api/resource-categories`)
      .then(r => r.ok ? r.json() : { categories: [] })
      .then(d => setCategories(d.categories ?? []))
      .catch(() => {});
  }, [base]);

  /* Fetch featured (once) */
  useEffect(() => {
    setLoadingFeatured(true);
    fetch(`${base}api/resources?featured=true&limit=4`)
      .then(r => r.ok ? r.json() : { resources: [] })
      .then(d => setFeatured(d.resources ?? []))
      .catch(() => setFeatured([]))
      .finally(() => setLoadingFeatured(false));
  }, [base]);

  /* Fetch counts (once) */
  useEffect(() => {
    setLoadingCounts(true);
    fetch(`${base}api/resources/counts`)
      .then(r => r.ok ? r.json() : { counts: {} })
      .then(d => setCounts(d.counts ?? {}))
      .catch(() => setCounts({}))
      .finally(() => setLoadingCounts(false));
  }, [base]);

  /* Fetch latest (depends on filters + page) */
  useEffect(() => {
    const isLoadMore = latestPage > 1;
    if (!isLoadMore) setLoadingLatest(true);
    else setLoadingMore(true);

    const params = new URLSearchParams({ limit: '6', page: String(latestPage) });

    // Effective search: combine text + topic + country
    if (debouncedSearch) params.set('search', debouncedSearch);

    // Category filter — passes the slug directly to the API's structured ?category= param
    if (activeCategory) params.set('category', activeCategory);

    // Type filter
    if (activeType !== 'all') {
      const apiType = PUBLIC_TYPE_TO_API[activeType];
      if (apiType) params.set('type', apiType);
    }

    // Sort
    if (sortBy === 'featured') params.set('featured', 'true');

    const url = `${base}api/resources?${params}`;
    let cancelled = false;

    fetch(url)
      .then(r => r.ok ? r.json() : { resources: [], total: 0 })
      .then(d => {
        if (cancelled) return;
        const items: ResourceListItem[] = d.resources ?? [];
        setLatestTotal(d.total ?? 0);
        if (isLoadMore) {
          setLatestItems(prev => [...prev, ...items]);
        } else {
          setLatestItems(items);
        }
      })
      .catch(() => { if (!cancelled) setLatestItems([]); })
      .finally(() => {
        if (!cancelled) {
          setLoadingLatest(false);
          setLoadingMore(false);
        }
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, filterKey, latestPage]);

  /* Handlers */
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    const typeRoute = activeType !== 'all' ? activeType : 'blog';
    const qs = new URLSearchParams({ search: search.trim() });
    if (activeCategory) qs.set('category', activeCategory);
    navigate(`/resources/${typeRoute}?${qs}`);
  };

  const clearFilters = useCallback(() => {
    setSearch('');
    setActiveType('all');
    setActiveCategory('');
    setSortBy('newest');
  }, []);

  const hasActiveFilters = search || activeType !== 'all' || activeCategory || sortBy !== 'newest';
  const hasMoreLatest = latestItems.length < latestTotal;

  const scrollToContent  = () => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToCategory = () => categoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ══════════ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-[72vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #021208 0%, #041f0e 40%, #062c12 70%, #082f14 100%)' }}>
        {/* Decorative radial glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand/5 blur-3xl" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-28 relative z-10 text-center">
          <motion.span
            {...(reduced ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } })}
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-5 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20"
          >
            Knowledge Hub
          </motion.span>

          <motion.h1
            {...(reduced ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.1 } })}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white max-w-4xl mx-auto leading-[1.1] mb-5"
          >
            Resources<span className="block text-emerald-400">Insights. Ideas. Knowledge.</span>
          </motion.h1>

          <motion.p
            {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 } })}
            className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Explore Esoko's latest insights, research, events, webinars, podcasts, guides, and stories shaping the future of digital agriculture across Africa.
          </motion.p>

          <motion.div
            {...(reduced ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.3 } })}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={scrollToContent}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3.5 rounded-full transition-colors shadow-lg hover:shadow-emerald-900/40"
            >
              Explore Latest Insights <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToCategory}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-full border border-white/20 transition-colors"
            >
              Browse All Resources
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════ SEARCH & FILTER BAR ═══════════════════════════════ */}
      <section className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            {/* Search row */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search resources…"
                  className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 bg-gray-50 transition-colors"
                />
              </div>
              {/* Topic — populated from real /api/resource-categories data */}
              <div className="relative">
                <select
                  value={activeCategory}
                  onChange={e => setActiveCategory(e.target.value)}
                  className="appearance-none text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 cursor-pointer hover:border-gray-300 transition-colors"
                >
                  <option value="">Topic</option>
                  {categories.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'newest' | 'featured')}
                className="appearance-none text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 cursor-pointer hover:border-gray-300 transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="featured">Featured</option>
              </select>
              {hasActiveFilters && (
                <button type="button" onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>

            {/* Type pills */}
            <div className="flex items-center gap-2 flex-wrap overflow-x-auto pb-0.5">
              {TYPE_PILLS.map(pill => (
                <button
                  key={pill.slug}
                  type="button"
                  onClick={() => setActiveType(pill.slug)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
                    activeType === pill.slug
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* ══════════ FEATURED INSIGHTS ══════════════════════════════════ */}
      <div ref={contentRef} id="featured-insights" />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp(0, reduced)} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900">Featured Insights</h2>
              <p className="text-sm text-gray-400 mt-0.5">Hand-picked by the Esoko team</p>
            </div>
            <Link href="/resources/blog" className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loadingFeatured ? (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 h-[300px] animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[0, 1, 2].map(i => <ResourceCardSkeleton key={i} />)}
              </div>
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-gray-50">
              <Sparkles className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">New insights are coming soon.</p>
              <p className="text-gray-400 text-sm mt-1">Published content will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Large hero card */}
              <FeaturedHeroCard resource={featured[0]} base={base} reduced={reduced} />
              {/* 3 smaller cards */}
              {featured.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featured.slice(1, 4).map((r, i) => (
                    <ResourceCard key={r.id} resource={r} index={i} variant="featured" />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ BROWSE BY TYPE ══════════════════════════════════════ */}
      <div ref={categoryRef} />
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp(0, reduced)} className="text-center mb-10">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">Browse by Type</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Dive into the format that works best for you — from short reads to in-depth research.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORY_CARDS.map((card, i) => (
              <CategoryCard
                key={card.slug}
                card={card}
                count={loadingCounts ? undefined : counts[card.slug]}
                index={i}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ LATEST FROM ESOKO ═══════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp(0, reduced)} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-gray-900">Latest from Esoko</h2>
              {latestTotal > 0 && !loadingLatest && (
                <p className="text-sm text-gray-400 mt-0.5">{latestTotal} {latestTotal === 1 ? 'resource' : 'resources'} {hasActiveFilters ? 'matching your filters' : 'published'}</p>
              )}
            </div>
          </motion.div>

          {loadingLatest ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map(i => <ResourceCardSkeleton key={i} />)}
            </div>
          ) : latestItems.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-gray-50">
              <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {hasActiveFilters ? 'No resources match your filters.' : 'No resources published yet.'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-3 text-sm text-emerald-600 hover:underline font-medium">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestItems.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} index={i % 6} variant="grid" />
                ))}
              </div>

              {hasMoreLatest && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setLatestPage(p => p + 1)}
                    disabled={loadingMore}
                    className="flex items-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-700 font-semibold text-sm px-7 py-3 rounded-full transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {loadingMore ? 'Loading…' : `Load More (${latestTotal - latestItems.length} remaining)`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
