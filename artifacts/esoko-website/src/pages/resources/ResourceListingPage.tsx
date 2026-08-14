import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'wouter';
import {
  Search, X, ChevronLeft, ChevronRight, BookOpen,
  Calendar, Headphones, Video, FileText, Users,
  ArrowLeft, SlidersHorizontal,
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { ResourceCard, ResourceCardSkeleton } from '@/components/resources/ResourceCard';
import type { ResourceListItem, ResourceCategory, ResourceTag, ListResponse } from '@/lib/resources';
import {
  PUBLIC_TYPE_TO_API, TYPE_LABELS, ALL_PUBLIC_TYPES,
  formatResourceDateTime,
} from '@/lib/resources';

/* ── Type icons ─────────────────────────────────────────────────── */
const TYPE_ICON: Record<string, React.ElementType> = {
  blog: BookOpen, events: Calendar, podcasts: Headphones,
  webinars: Video, research: FileText, 'customer-stories': Users,
};

const TYPE_HERO_STYLE: Record<string, { from: string; accent: string }> = {
  blog:               { from: '#1e3a5f', accent: 'text-blue-300' },
  events:             { from: '#2d1b5e', accent: 'text-purple-300' },
  podcasts:           { from: '#4a2800', accent: 'text-amber-300' },
  webinars:           { from: '#5e1b2d', accent: 'text-rose-300' },
  research:           { from: '#0a2e18', accent: 'text-emerald-300' },
  'customer-stories': { from: '#0d3333', accent: 'text-teal-300' },
};

/* ── Helpers ────────────────────────────────────────────────────── */
const ITEMS_PER_PAGE = 12;
const EVENTS_FETCH_LIMIT = 100; // fetch more for client-side date sort

function isUpcoming(eventStart: string | null | undefined): boolean {
  if (!eventStart) return true; // no date set → treat as upcoming
  return new Date(eventStart) >= new Date();
}

function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

/* ── Filter pill ────────────────────────────────────────────────── */
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
        active
          ? 'bg-emerald-600 text-white border-emerald-600'
          : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
      }`}
    >
      {label}
    </button>
  );
}

/* ── Skeleton grid ──────────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => <ResourceCardSkeleton key={i} />)}
    </div>
  );
}

/* ── Event card (upcoming/past distinction) ─────────────────────── */
function EventCard({ resource, index }: { resource: ResourceListItem; index: number }) {
  const isPast = resource.eventStart ? new Date(resource.eventStart) < new Date() : false;
  return (
    <div className="relative">
      {isPast && (
        <div className="absolute top-3 right-3 z-10 bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
          Past
        </div>
      )}
      <ResourceCard resource={resource} index={index} variant="grid" />
      {resource.eventStart && (
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-purple-500" />
          {formatResourceDateTime(resource.eventStart)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function ResourceListingPage() {
  const { type: typeParam } = useParams<{ type: string }>();
  const base = import.meta.env.BASE_URL;

  // Validate URL type param
  const isValidType = ALL_PUBLIC_TYPES.includes(typeParam as (typeof ALL_PUBLIC_TYPES)[number]);
  const apiType = isValidType ? PUBLIC_TYPE_TO_API[typeParam] : null;
  const label   = isValidType ? TYPE_LABELS[typeParam] : typeParam;
  const Icon    = TYPE_ICON[typeParam] ?? BookOpen;
  const hero    = TYPE_HERO_STYLE[typeParam] ?? { from: '#051c0e', accent: 'text-emerald-300' };
  const isEvents = typeParam === 'events';

  /* ── Filters ─────────────────────────────────────────────────── */
  // Seed search from ?search= URL query param so that navigating from the
  // Resources landing page (which appends ?search=…) actually applies the query.
  const [searchInput, setSearchInput] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') ?? '';
  });
  const search = useDebounce(searchInput, 350);
  // Seed category filter from ?category= URL param so searches submitted from the
  // Resources landing page (which appends ?category=slug) are applied immediately.
  const [categoryFilter, setCategoryFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') ?? '';
  });
  const [tagFilter, setTagFilter] = useState('');
  const [page, setPage] = useState(1);

  /* ── Data ────────────────────────────────────────────────────── */
  const [resources, setResources]   = useState<ResourceListItem[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [tags, setTags]             = useState<ResourceTag[]>([]);
  const [filtersLoaded, setFiltersLoaded] = useState(false);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, categoryFilter, tagFilter]);

  // Fetch categories + tags once
  useEffect(() => {
    if (!isValidType) return;
    Promise.all([
      fetch(`${base}api/resource-categories`).then(r => r.ok ? r.json() : { categories: [] }),
      fetch(`${base}api/resource-tags`).then(r => r.ok ? r.json() : { tags: [] }),
    ]).then(([catRes, tagRes]) => {
      setCategories(catRes.categories ?? []);
      setTags(tagRes.tags ?? []);
    }).catch(() => {}).finally(() => setFiltersLoaded(true));
  }, [base, isValidType]);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    if (!apiType) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)         params.set('search',   search);
      if (categoryFilter) params.set('category', categoryFilter);
      if (tagFilter)      params.set('tag',       tagFilter);
      if (isEvents) {
        // Fetch all events so we can split upcoming/past client-side
        params.set('limit', String(EVENTS_FETCH_LIMIT));
        params.set('page', '1');
      } else {
        params.set('page',  String(page));
        params.set('limit', String(ITEMS_PER_PAGE));
      }

      const res = await fetch(`${base}api/resources/${apiType}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ListResponse = await res.json();
      setResources(data.resources ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch {
      setResources([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [apiType, search, categoryFilter, tagFilter, page, base, isEvents]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  // SEO
  useEffect(() => {
    document.title = `${label} | Esoko Resources`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = `Browse Esoko's ${label} — data, insights, and stories on African agriculture.`;
    return () => {
      document.title = 'Esoko — Agricultural Market Data & Advisory Services';
      const m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (m) m.content = 'Esoko connects farmers, traders, and agribusiness to real-time agricultural market information.';
    };
  }, [label]);

  /* ── Events: split upcoming / past ──────────────────────────── */
  const upcomingEvents = isEvents ? resources.filter(r => isUpcoming(r.eventStart))
    .sort((a, b) => {
      if (!a.eventStart) return 1;
      if (!b.eventStart) return -1;
      return new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime();
    }) : [];
  const pastEvents = isEvents ? resources.filter(r => !isUpcoming(r.eventStart))
    .sort((a, b) => {
      if (!a.eventStart || !b.eventStart) return 0;
      return new Date(b.eventStart).getTime() - new Date(a.eventStart).getTime();
    }) : [];

  /* ── Invalid type ────────────────────────────────────────────── */
  if (!isValidType) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-40 text-center px-4">
          <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-5" />
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-3">Section Not Found</h1>
          <p className="text-gray-500 mb-8">That resource type doesn't exist. Browse our available content below.</p>
          <Link href="/resources" className="text-emerald-600 font-semibold hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasActiveFilters = !!(search || categoryFilter || tagFilter);
  const clearFilters = () => { setSearchInput(''); setCategoryFilter(''); setTagFilter(''); };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative py-16 md:py-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${hero.from} 0%, #051c0e 100%)` }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, #D9531E 0%, transparent 45%)' }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/resources" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Icon className={`w-7 h-7 ${hero.accent}`} />
            </div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="text-3xl md:text-4xl font-heading font-bold text-white"
              >
                {label}
              </motion.h1>
              {!loading && (
                <p className="text-white/50 text-sm mt-1">
                  {total} {total === 1 ? 'item' : 'items'} published
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters bar ──────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3">
          {/* Search */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="search"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}…`}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-gray-50"
              />
            </div>

            {/* Category pills */}
            {filtersLoaded && categories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <FilterPill label="All Categories" active={!categoryFilter} onClick={() => setCategoryFilter('')} />
                {categories.slice(0, 8).map(c => (
                  <FilterPill key={c.id} label={c.name} active={categoryFilter === c.slug} onClick={() => setCategoryFilter(categoryFilter === c.slug ? '' : c.slug)} />
                ))}
              </div>
            )}

            {/* Clear */}
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Tag pills */}
          {filtersLoaded && tags.length > 0 && (
            <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1">
              {tags.slice(0, 12).map(t => (
                <FilterPill key={t.id} label={`#${t.name}`} active={tagFilter === t.slug} onClick={() => setTagFilter(tagFilter === t.slug ? '' : t.slug)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">

        {loading ? (
          <SkeletonGrid />
        ) : isEvents ? (
          /* ── Events: upcoming + past sections ─── */
          <>
            {/* Upcoming events */}
            <section className="mb-12">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Upcoming Events
                <span className="text-sm font-normal text-gray-400">({upcomingEvents.length})</span>
              </h2>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                  <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming events at the moment.</p>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="mt-2 text-sm text-emerald-600 hover:underline">Clear filters</button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((r, i) => <EventCard key={r.id} resource={r} index={i} />)}
                </div>
              )}
            </section>

            {/* Past events */}
            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  Past Events
                  <span className="text-sm font-normal text-gray-400">({pastEvents.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
                  {pastEvents.map((r, i) => <EventCard key={r.id} resource={r} index={i} />)}
                </div>
              </section>
            )}
          </>
        ) : resources.length === 0 ? (
          /* ── Empty state ─────────────────────────── */
          <div className="text-center py-20">
            <Icon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg mb-2">
              {hasActiveFilters ? 'No results found' : `No ${label.toLowerCase()} published yet`}
            </p>
            <p className="text-gray-400 text-sm">
              {hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Check back soon — content is on its way.'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 text-sm text-emerald-600 hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          /* ── Standard grid ───────────────────────── */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r, i) => <ResourceCard key={r.id} resource={r} index={i} variant="grid" />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
