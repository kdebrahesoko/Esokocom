import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useParams } from 'wouter';
import {
  Search, X, ChevronLeft, ChevronRight, BookOpen,
  Calendar, Headphones, Video, FileText, Users, ArrowLeft,
  SlidersHorizontal, Download, Play, ExternalLink, ArrowRight,
  Clock, Mic, Music, Radio, Building2,
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { ResourceCardSkeleton } from '@/components/resources/ResourceCard';
import type { ResourceListItem, ResourceCategory, ResourceTag, ListResponse } from '@/lib/resources';
import {
  PUBLIC_TYPE_TO_API, TYPE_LABELS, ALL_PUBLIC_TYPES,
  formatResourceDate, formatResourceDateTime, resolveImageUrl, estimateReadTime,
} from '@/lib/resources';

/* ── Type hero configs ───────────────────────────────────────────────── */
const TYPE_HERO: Record<string, { bg: string; accent: string; tagline: string }> = {
  blog:               { bg: 'linear-gradient(135deg,#1e3a5f 0%,#051c0e 100%)',  accent: 'text-blue-300',    tagline: 'Insights from Esoko' },
  events:             { bg: 'linear-gradient(135deg,#2d1b5e 0%,#051c0e 100%)',  accent: 'text-purple-300',  tagline: 'Join us at our upcoming events' },
  podcasts:           { bg: 'linear-gradient(135deg,#4a2800 0%,#051c0e 100%)',  accent: 'text-amber-300',   tagline: 'Listen to the Esoko Podcast' },
  webinars:           { bg: 'linear-gradient(135deg,#5e1b2d 0%,#051c0e 100%)',  accent: 'text-rose-300',    tagline: 'Deepen your expertise with Esoko experts' },
  research:           { bg: 'linear-gradient(135deg,#0a2e18 0%,#051c0e 100%)',  accent: 'text-emerald-300', tagline: 'Data-driven research on African food systems' },
  'customer-stories': { bg: 'linear-gradient(135deg,#0d3333 0%,#051c0e 100%)',  accent: 'text-teal-300',    tagline: 'Real impact. Real organisations.' },
  reports:            { bg: 'linear-gradient(135deg,#1e2a4a 0%,#051c0e 100%)',  accent: 'text-indigo-300',  tagline: 'Publications and white papers from Esoko' },
  guides:             { bg: 'linear-gradient(135deg,#003344 0%,#051c0e 100%)',  accent: 'text-cyan-300',    tagline: 'Step-by-step guides for your work' },
};

const TYPE_ICON: Record<string, React.ElementType> = {
  blog: BookOpen, events: Calendar, podcasts: Headphones,
  webinars: Video, research: FileText, 'customer-stories': Users,
  reports: FileText, guides: BookOpen,
};

const TYPE_SEO_DESC: Record<string, string> = {
  blog:               "Read Esoko's latest blog posts — insights on digital agriculture, African food systems, and technology impact.",
  events:             "Discover Esoko's upcoming conferences, field days, and partner events across Africa.",
  webinars:           "Watch or register for Esoko webinars — live and on-demand learning for agri-professionals.",
  podcasts:           "Listen to the Esoko Podcast — conversations with farmers, policymakers, and innovators.",
  research:           "Download Esoko's research reports and white papers on African agriculture and food security.",
  'customer-stories': "Read how organisations across Africa are transforming agriculture with Esoko's platform.",
  reports:            "Browse Esoko's publications, industry benchmarks, and policy papers.",
  guides:             "Step-by-step guides for farmers, extensionists, and agri-business partners.",
};

/* ── Constants ───────────────────────────────────────────────────────── */
const ITEMS_PER_PAGE    = 12;
const EVENTS_FETCH_LIMIT = 100;

/* ── Helpers ─────────────────────────────────────────────────────────── */
function useDebounce<T>(value: T, ms: number): T {
  const [d, setD] = useState(value);
  useEffect(() => { const t = setTimeout(() => setD(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return d;
}

function isUpcoming(eventStart: string | null | undefined): boolean {
  if (!eventStart) return true;
  return new Date(eventStart) >= new Date();
}

type WebinarStatus = 'upcoming' | 'live' | 'on-demand';

function getWebinarStatus(ext: Record<string, unknown> | null | undefined): WebinarStatus {
  if (!ext) return 'upcoming';
  if (ext.recordingUrl) return 'on-demand';
  if (ext.meetingUrl)   return 'live';
  return 'upcoming';
}

function buildGCalUrl(title: string, start: string, end?: string | null): string {
  const fmt = (s: string) => new Date(s).toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text:   title,
    dates:  `${fmt(start)}/${end ? fmt(end) : fmt(start)}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function fmtFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024)          return `${bytes} B`;
  if (bytes < 1024 * 1024)   return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Shared sub-components ───────────────────────────────────────────── */
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

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => <ResourceCardSkeleton key={i} />)}
    </div>
  );
}

function EmptyState({
  Icon, label, hasFilters, onClear,
}: { Icon: React.ElementType; label: string; hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
      <Icon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-600 font-medium text-lg mb-2">
        {hasFilters ? 'No results found' : `No ${label.toLowerCase()} published yet`}
      </p>
      <p className="text-gray-400 text-sm">
        {hasFilters ? 'Try adjusting your search or filters.' : 'Check back soon — content is on its way.'}
      </p>
      {hasFilters && (
        <button onClick={onClear} className="mt-4 text-sm text-emerald-600 hover:underline">
          Clear all filters
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   BLOG CARDS
   ══════════════════════════════════════════════════════════════════════ */

function FeaturedBlogCard({ resource, base, reduced }: { resource: ResourceListItem; base: string; reduced: boolean }) {
  const imgSrc   = resolveImageUrl(resource.featuredImageUrl, base);
  const readTime = estimateReadTime(resource.body);
  const href     = `/resources/blog/${resource.slug}`;

  return (
    <motion.div
      {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } })}
      className="mb-8"
    >
      <Link href={href}>
        <div className="group grid grid-cols-1 md:grid-cols-5 bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Image — 3 / 5 */}
          <div className="md:col-span-3 relative min-h-[220px] md:min-h-[300px] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
            {imgSrc
              ? <img src={imgSrc} alt={resource.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="eager" />
              : <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="w-20 h-20 text-blue-200" /></div>
            }
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100">
              Featured Article
            </div>
          </div>
          {/* Content — 2 / 5 */}
          <div className="md:col-span-2 p-7 flex flex-col justify-between">
            <div>
              {resource.categoryName && (
                <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full mb-3">
                  {resource.categoryName}
                </span>
              )}
              <h3 className="text-xl font-heading font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug mb-3 line-clamp-3">
                {resource.title}
              </h3>
              {resource.shortDescription && (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{resource.shortDescription}</p>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                <span>Esoko</span><span>·</span>
                <span>{formatResourceDate(resource.publishedAt)}</span><span>·</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{readTime} min read</span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all">
                Read Article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function BlogCard({ resource, index, base, reduced }: { resource: ResourceListItem; index: number; base: string; reduced: boolean }) {
  const imgSrc   = resolveImageUrl(resource.featuredImageUrl, base);
  const readTime = estimateReadTime(resource.body);
  const href     = `/resources/blog/${resource.slug}`;

  return (
    <motion.div
      {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: (index % 3) * 0.06 } })}
      className="h-full"
    >
      <Link href={href}>
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full">
          <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
            {imgSrc
              ? <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-10 h-10 text-blue-200" /></div>
            }
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {resource.categoryName && (
                <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">{resource.categoryName}</span>
              )}
              {resource.featured && (
                <span className="text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full">Featured</span>
              )}
            </div>
            <h3 className="font-heading font-semibold text-gray-900 text-base mb-1.5 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {resource.title}
            </h3>
            {resource.shortDescription && (
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-3">{resource.shortDescription}</p>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto flex-wrap">
              <span>{formatResourceDate(resource.publishedAt)}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{readTime} min</span>
              {resource.tags[0] && <><span>·</span><span className="text-emerald-600 font-medium">#{resource.tags[0].name}</span></>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WEBINAR CARD
   ══════════════════════════════════════════════════════════════════════ */

const WEBINAR_STATUS_CFG: Record<WebinarStatus, { label: string; cls: string; ctaLabel: string }> = {
  upcoming:   { label: 'Upcoming',  cls: 'bg-blue-50 text-blue-700 border-blue-200',       ctaLabel: 'Register' },
  live:       { label: 'Live Now',  cls: 'bg-red-50 text-red-700 border-red-200',           ctaLabel: 'Join Now' },
  'on-demand':{ label: 'On Demand', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', ctaLabel: 'Watch Recording' },
};

function WebinarCard({ resource, index, base, reduced }: { resource: ResourceListItem; index: number; base: string; reduced: boolean }) {
  const imgSrc   = resolveImageUrl(resource.featuredImageUrl, base);
  const ext      = resource.extension;
  const status   = getWebinarStatus(ext);
  const { label: statusLabel, cls: statusCls, ctaLabel } = WEBINAR_STATUS_CFG[status];
  const ctaUrl   = (ext?.recordingUrl ?? ext?.meetingUrl ?? ext?.registrationUrl) as string | undefined;
  const speakers = Array.isArray(ext?.speakers) ? (ext!.speakers as Array<{ name: string }>) : [];
  const href     = `/resources/webinars/${resource.slug}`;

  return (
    <motion.div
      {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: (index % 3) * 0.06 } })}
      className="h-full"
    >
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {/* Thumbnail with play overlay */}
        <Link href={href}>
          <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-rose-50 to-rose-100 cursor-pointer">
            {imgSrc
              ? <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center"><Video className="w-10 h-10 text-rose-200" /></div>
            }
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-rose-600 ml-0.5" />
              </div>
            </div>
            <div className={`absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${statusCls}`}>
              {status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />}
              {statusLabel}
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {resource.categoryName && <p className="text-xs text-gray-400 mb-1">{resource.categoryName}</p>}
          <Link href={href}>
            <h3 className="font-heading font-semibold text-gray-900 text-base mb-2 line-clamp-2 hover:text-rose-700 transition-colors cursor-pointer">
              {resource.title}
            </h3>
          </Link>
          {resource.shortDescription && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-3">{resource.shortDescription}</p>
          )}
          {speakers.length > 0 && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 truncate">
              <Mic className="w-3 h-3 text-rose-400 flex-shrink-0" />
              {speakers.map(s => s.name).join(', ')}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-gray-400">{formatResourceDate(resource.publishedAt)}</span>
            {ctaUrl ? (
              <a href={ctaUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-full transition-colors"
                onClick={e => e.stopPropagation()}>
                {ctaLabel} <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <Link href={href}>
                <span className="text-xs font-semibold text-rose-600 hover:underline">{ctaLabel}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   EVENT CARD
   ══════════════════════════════════════════════════════════════════════ */

function EnhancedEventCard({ resource, index, base, reduced }: { resource: ResourceListItem; index: number; base: string; reduced: boolean }) {
  const imgSrc = resolveImageUrl(resource.featuredImageUrl, base);
  const isPast = resource.eventStart ? new Date(resource.eventStart) < new Date() : false;
  const href   = `/resources/events/${resource.slug}`;
  const gcalUrl = resource.eventStart
    ? buildGCalUrl(resource.title, resource.eventStart, resource.eventEnd)
    : null;

  return (
    <motion.div
      {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: (index % 3) * 0.06 } })}
      className="h-full"
    >
      <div className={`group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full${isPast ? ' opacity-80' : ''}`}>
        {/* Image */}
        <Link href={href}>
          <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100">
            {imgSrc
              ? <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center"><Calendar className="w-10 h-10 text-purple-200" /></div>
            }
            <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border ${isPast ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-purple-600 text-white border-purple-600'}`}>
              {isPast ? 'Past' : 'Upcoming'}
            </div>
          </div>
        </Link>

        {/* Date strip */}
        {resource.eventStart && (
          <div className="px-5 py-2.5 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-purple-700 truncate">{formatResourceDateTime(resource.eventStart)}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {resource.categoryName && <p className="text-xs text-gray-400 mb-1">{resource.categoryName}</p>}
          <Link href={href}>
            <h3 className="font-heading font-semibold text-gray-900 text-base mb-2 line-clamp-2 hover:text-purple-700 transition-colors">
              {resource.title}
            </h3>
          </Link>
          {resource.shortDescription && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-3">{resource.shortDescription}</p>
          )}
          <div className="flex items-center gap-3 mt-auto">
            <Link href={href}>
              <span className="text-xs font-semibold text-purple-600 hover:underline">
                {isPast ? 'View Recap →' : 'Register →'}
              </span>
            </Link>
            {!isPast && gcalUrl && (
              <a href={gcalUrl} target="_blank" rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                title="Add to Google Calendar" onClick={e => e.stopPropagation()}>
                <Calendar className="w-3 h-3" /> Add to calendar
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PODCAST CARD + PLATFORM LINKS
   ══════════════════════════════════════════════════════════════════════ */

function PodcastCard({ resource, index, base, reduced }: { resource: ResourceListItem; index: number; base: string; reduced: boolean }) {
  const imgSrc     = resolveImageUrl(resource.featuredImageUrl, base);
  const ext        = resource.extension;
  const episodeNum = ext?.episodeNumber as number | undefined;
  const season     = ext?.season as number | undefined;
  const host       = ext?.host as string | undefined;
  const audioUrl   = ext?.audioUrl as string | undefined;
  const guests     = Array.isArray(ext?.guests) ? (ext!.guests as Array<{ name: string }>) : [];
  const href       = `/resources/podcasts/${resource.slug}`;

  return (
    <motion.div
      {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: (index % 3) * 0.06 } })}
      className="h-full"
    >
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {/* Cover + episode info */}
        <div className="flex gap-4 p-5 border-b border-gray-50">
          <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
            {imgSrc
              ? <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center"><Headphones className="w-8 h-8 text-amber-300" /></div>
            }
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {(season || episodeNum) && (
              <p className="text-xs font-bold text-amber-600 mb-0.5">
                {season ? `S${season}` : ''}{season && episodeNum ? ' · ' : ''}{episodeNum ? `Ep. ${episodeNum}` : ''}
              </p>
            )}
            <Link href={href}>
              <h3 className="font-heading font-semibold text-gray-900 text-sm line-clamp-2 hover:text-amber-700 transition-colors cursor-pointer">
                {resource.title}
              </h3>
            </Link>
            {host && (
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 truncate">
                <Mic className="w-3 h-3 flex-shrink-0" />
                {host}{guests.length > 0 ? ` with ${guests[0].name}` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Description + CTA */}
        <div className="p-5 flex flex-col flex-1">
          {resource.shortDescription && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-3">{resource.shortDescription}</p>
          )}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xs text-gray-400">{formatResourceDate(resource.publishedAt)}</span>
            {audioUrl ? (
              <a href={audioUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-full transition-colors">
                <Play className="w-3 h-3 ml-0.5" /> Listen
              </a>
            ) : (
              <Link href={href}>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:underline">
                  <Play className="w-3 h-3" /> Listen
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const PLATFORM_CFG: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  spotify: { label: 'Spotify',        icon: Music, cls: 'text-green-600 bg-green-50 border-green-200' },
  apple:   { label: 'Apple Podcasts', icon: Music, cls: 'text-purple-600 bg-purple-50 border-purple-200' },
  youtube: { label: 'YouTube',        icon: Radio, cls: 'text-red-600 bg-red-50 border-red-200' },
  rss:     { label: 'RSS',            icon: Radio, cls: 'text-orange-600 bg-orange-50 border-orange-200' },
};

function PlatformLinks({ base }: { base: string }) {
  const [platforms, setPlatforms] = useState<[string, string][]>([]);

  useEffect(() => {
    fetch(`${base}api/resources/podcast-platforms`)
      .then(r => r.ok ? r.json() : { platforms: {} })
      .then((data: { platforms: Record<string, string> }) => {
        setPlatforms(
          Object.entries(data.platforms ?? {}).filter(([k]) => PLATFORM_CFG[k]) as [string, string][]
        );
      })
      .catch(() => {});
  }, [base]);

  if (platforms.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8">
      <p className="text-xs font-semibold text-amber-700 mb-3 uppercase tracking-widest">Listen on</p>
      <div className="flex items-center gap-3 flex-wrap">
        {platforms.map(([key, url]) => {
          const cfg = PLATFORM_CFG[key];
          const PlatformIcon = cfg.icon;
          return (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border hover:shadow-sm transition-all ${cfg.cls}`}>
              <PlatformIcon className="w-4 h-4" /> {cfg.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   REPORT / RESEARCH CARD
   ══════════════════════════════════════════════════════════════════════ */

function ReportCard({ resource, index, base, reduced, pubSlug }: {
  resource: ResourceListItem; index: number; base: string; reduced: boolean; pubSlug: string;
}) {
  const imgSrc  = resolveImageUrl(resource.featuredImageUrl, base);
  const ext     = resource.extension;
  const rawFileUrl = ext?.fileUrl as string | null | undefined;
  // Resolve stored object paths through the public storage endpoint (same pattern as detail page)
  const fileUrl = rawFileUrl
    ? (rawFileUrl.startsWith('http') ? rawFileUrl : `${base}api/storage/public-objects/${rawFileUrl}`)
    : null;
  const fileType= ext?.fileType as string | null | undefined;
  const fileSize= ext?.fileSize as number | null | undefined;
  const org     = ext?.organisation as string | null | undefined;
  const year    = ext?.publicationYear as number | null | undefined;
  const href    = `/resources/${pubSlug}/${resource.slug}`;

  return (
    <motion.div
      {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: (index % 3) * 0.06 } })}
      className="h-full"
    >
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
        {/* Cover */}
        <Link href={href}>
          <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100">
            {imgSrc
              ? <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              : <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <FileText className="w-12 h-12 text-emerald-200" />
                  {fileType && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                      {fileType}
                    </span>
                  )}
                </div>
            }
            {fileType && imgSrc && (
              <div className="absolute bottom-3 left-3 text-xs font-bold text-emerald-700 bg-white/90 border border-emerald-100 px-2 py-0.5 rounded uppercase">
                {fileType}
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {resource.categoryName && <p className="text-xs text-gray-400 mb-1">{resource.categoryName}</p>}
          <Link href={href}>
            <h3 className="font-heading font-semibold text-gray-900 text-base mb-2 line-clamp-2 hover:text-emerald-700 transition-colors">
              {resource.title}
            </h3>
          </Link>
          {resource.shortDescription && (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-3">{resource.shortDescription}</p>
          )}
          {(org || year || fileSize) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3 flex-wrap">
              {org && <><Building2 className="w-3 h-3 flex-shrink-0" /><span>{org}</span></>}
              {year && <><span>·</span><span>{year}</span></>}
              {fileSize && <><span>·</span><span>{fmtFileSize(fileSize)}</span></>}
            </div>
          )}
          <div className="flex items-center gap-3 mt-auto">
            {fileUrl ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-full transition-colors"
                onClick={e => e.stopPropagation()}>
                <Download className="w-3 h-3" /> Download
              </a>
            ) : (
              <Link href={href}>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline">
                  Read Report <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CUSTOMER STORY CARD
   ══════════════════════════════════════════════════════════════════════ */

function StoryCard({ resource, index, base, reduced }: { resource: ResourceListItem; index: number; base: string; reduced: boolean }) {
  const imgSrc = resolveImageUrl(resource.featuredImageUrl, base);
  const href   = `/resources/customer-stories/${resource.slug}`;

  return (
    <motion.div
      {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: (index % 2) * 0.08 } })}
      className="h-full"
    >
      <Link href={href}>
        <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
          {/* Photography */}
          <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100">
            {imgSrc
              ? <img src={imgSrc} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center"><Users className="w-12 h-12 text-teal-200" /></div>
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            {resource.categoryName && (
              <div className="absolute bottom-4 left-4 bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {resource.categoryName}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-1">
            <h3 className="font-heading font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors">
              {resource.title}
            </h3>
            {resource.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {resource.tags.slice(0, 3).map(t => (
                  <span key={t.id} className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">
                    {t.name}
                  </span>
                ))}
              </div>
            )}
            {resource.shortDescription && (
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">{resource.shortDescription}</p>
            )}
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400">{formatResourceDate(resource.publishedAt)}</span>
              <span className="text-sm font-semibold text-teal-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Case Study <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════════════ */

export default function ResourceListingPage() {
  const { type: typeParam }  = useParams<{ type: string }>();
  const base    = import.meta.env.BASE_URL;
  const reduced = useReducedMotion() ?? false;

  const isValidType = ALL_PUBLIC_TYPES.includes(typeParam as (typeof ALL_PUBLIC_TYPES)[number]);
  const apiType     = isValidType ? PUBLIC_TYPE_TO_API[typeParam] : null;
  const label       = isValidType ? (TYPE_LABELS[typeParam] ?? typeParam) : typeParam;
  const Icon        = TYPE_ICON[typeParam] ?? BookOpen;
  const heroStyle   = TYPE_HERO[typeParam] ?? { bg: 'linear-gradient(135deg,#051c0e 0%,#0a1a0a 100%)', accent: 'text-emerald-300', tagline: '' };

  /* Content-type flags */
  const isEvents  = typeParam === 'events';
  const isPodcast = typeParam === 'podcasts';
  const isWebinar = typeParam === 'webinars';
  const isReport  = typeParam === 'research' || typeParam === 'reports';
  const isStory   = typeParam === 'customer-stories';
  const isBlog    = typeParam === 'blog' || typeParam === 'guides';

  /* ── Filters ─────────────────────────────────────────────────────── */
  const [searchInput, setSearchInput] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') ?? '';
  });
  const search = useDebounce(searchInput, 350);

  const [categoryFilter, setCategoryFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('category') ?? '';
  });
  const [tagFilter,            setTagFilter]            = useState('');
  const [webinarStatusFilter,  setWebinarStatusFilter]  = useState<WebinarStatus | 'all'>('all');
  const [page,                 setPage]                 = useState(1);

  /* ── Data ────────────────────────────────────────────────────────── */
  const [resources,    setResources]    = useState<ResourceListItem[]>([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [categories,   setCategories]   = useState<ResourceCategory[]>([]);
  const [tags,         setTags]         = useState<ResourceTag[]>([]);
  const [filtersLoaded,setFiltersLoaded]= useState(false);

  useEffect(() => { setPage(1); }, [search, categoryFilter, tagFilter, webinarStatusFilter]);

  /* Fetch categories + tags once */
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

  /* Fetch resources */
  const fetchResources = useCallback(async () => {
    if (!apiType) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)         params.set('search',   search);
      if (categoryFilter) params.set('category', categoryFilter);
      if (tagFilter)      params.set('tag',       tagFilter);
      if (isEvents) {
        params.set('limit', String(EVENTS_FETCH_LIMIT));
        params.set('page',  '1');
      } else {
        params.set('page',  String(page));
        params.set('limit', String(ITEMS_PER_PAGE));
      }
      // Webinar status — server-side filter so it works across all pages
      if (isWebinar && webinarStatusFilter !== 'all') {
        params.set('webinarStatus', webinarStatusFilter);
      }
      const res = await fetch(`${base}api/resources/${apiType}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ListResponse = await res.json();
      setResources(data.resources ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch {
      setResources([]); setTotal(0); setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [apiType, search, categoryFilter, tagFilter, page, base, isEvents, isWebinar, webinarStatusFilter]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  /* SEO */
  useEffect(() => {
    document.title = `${label} | Esoko Resources`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = TYPE_SEO_DESC[typeParam] ?? `Browse Esoko's ${label} — data, insights, and stories on African agriculture.`;
    return () => {
      document.title = 'Esoko — Agricultural Market Data & Advisory Services';
      const m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (m) m.content = 'Esoko connects farmers, traders, and agribusiness to real-time agricultural market information.';
    };
  }, [label, typeParam]);

  /* ── Derived ──────────────────────────────────────────────────────── */
  const upcomingEvents = useMemo(() =>
    isEvents
      ? resources.filter(r => isUpcoming(r.eventStart))
          .sort((a, b) => !a.eventStart ? 1 : !b.eventStart ? -1 : new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime())
      : [],
  [isEvents, resources]);

  const pastEvents = useMemo(() =>
    isEvents
      ? resources.filter(r => !isUpcoming(r.eventStart))
          .sort((a, b) => !a.eventStart || !b.eventStart ? 0 : new Date(b.eventStart).getTime() - new Date(a.eventStart).getTime())
      : [],
  [isEvents, resources]);

  // Webinar status is now filtered server-side via ?webinarStatus= param, so just use resources directly
  const filteredWebinars = resources;

  const hasActiveFilters = !!(search || categoryFilter || tagFilter || (isWebinar && webinarStatusFilter !== 'all'));
  const clearFilters = () => {
    setSearchInput(''); setCategoryFilter(''); setTagFilter(''); setWebinarStatusFilter('all');
  };

  /* ── Invalid type ─────────────────────────────────────────────────── */
  if (!isValidType) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-40 text-center px-4">
          <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-5" />
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-3">Section Not Found</h1>
          <p className="text-gray-500 mb-8">That resource type doesn't exist.</p>
          <Link href="/resources" className="text-emerald-600 font-semibold hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Resources
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative py-14 overflow-hidden" style={{ background: heroStyle.bg }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 30%, #D9531E 0%, transparent 45%)' }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/resources" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Resources
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Icon className={`w-7 h-7 ${heroStyle.accent}`} />
            </div>
            <div>
              <motion.h1
                {...(reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45 } })}
                className="text-3xl md:text-4xl font-heading font-bold text-white"
              >
                {label}
              </motion.h1>
              {heroStyle.tagline && (
                <p className="text-white/50 text-sm mt-1">{heroStyle.tagline}</p>
              )}
              {!loading && total > 0 && (
                <p className="text-white/40 text-xs mt-0.5">{total} {total === 1 ? 'item' : 'items'} published</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
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
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1 min-w-0">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <FilterPill label="All" active={!categoryFilter} onClick={() => setCategoryFilter('')} />
                {categories.slice(0, 8).map(c => (
                  <FilterPill key={c.id} label={c.name} active={categoryFilter === c.slug}
                    onClick={() => setCategoryFilter(categoryFilter === c.slug ? '' : c.slug)} />
                ))}
              </div>
            )}

            {/* Webinar status pills */}
            {isWebinar && (
              <div className="flex items-center gap-2 flex-wrap">
                {(['all', 'upcoming', 'live', 'on-demand'] as const).map(s => (
                  <FilterPill key={s}
                    label={s === 'all' ? 'All' : s === 'on-demand' ? 'On Demand' : s.charAt(0).toUpperCase() + s.slice(1)}
                    active={webinarStatusFilter === s}
                    onClick={() => setWebinarStatusFilter(s)} />
                ))}
              </div>
            )}

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
                <FilterPill key={t.id} label={`#${t.name}`} active={tagFilter === t.slug}
                  onClick={() => setTagFilter(tagFilter === t.slug ? '' : t.slug)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-10">

        {loading ? (
          <SkeletonGrid count={isStory ? 4 : 6} />

        ) : isEvents ? (
          /* Events: upcoming + past ─────────────────────────────────── */
          <>
            <section className="mb-12">
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Upcoming Events
                <span className="text-sm font-normal text-gray-400 ml-1">({upcomingEvents.length})</span>
              </h2>
              {upcomingEvents.length === 0 ? (
                <EmptyState Icon={Calendar} label="upcoming events" hasFilters={hasActiveFilters} onClear={clearFilters} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((r, i) => (
                    <EnhancedEventCard key={r.id} resource={r} index={i} base={base} reduced={reduced} />
                  ))}
                </div>
              )}
            </section>

            {pastEvents.length > 0 && (
              <section>
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  Past Events
                  <span className="text-sm font-normal text-gray-400 ml-1">({pastEvents.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((r, i) => (
                    <EnhancedEventCard key={r.id} resource={r} index={i} base={base} reduced={reduced} />
                  ))}
                </div>
              </section>
            )}
          </>

        ) : resources.length === 0 ? (
          /* Empty state ─────────────────────────────────────────────── */
          <EmptyState Icon={Icon} label={label} hasFilters={hasActiveFilters} onClear={clearFilters} />

        ) : isBlog ? (
          /* Blog: featured large + editorial grid ───────────────────── */
          <>
            {resources[0] && <FeaturedBlogCard resource={resources[0]} base={base} reduced={reduced} />}
            {resources.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.slice(1).map((r, i) => (
                  <BlogCard key={r.id} resource={r} index={i} base={base} reduced={reduced} />
                ))}
              </div>
            )}
          </>

        ) : isWebinar ? (
          /* Webinars: status-filtered grid ──────────────────────────── */
          filteredWebinars.length === 0 ? (
            <EmptyState Icon={Video} label="webinars" hasFilters={hasActiveFilters} onClear={clearFilters} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWebinars.map((r, i) => (
                <WebinarCard key={r.id} resource={r} index={i} base={base} reduced={reduced} />
              ))}
            </div>
          )

        ) : isPodcast ? (
          /* Podcasts: platform links + episode grid ─────────────────── */
          <>
            <PlatformLinks base={base} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((r, i) => (
                <PodcastCard key={r.id} resource={r} index={i} base={base} reduced={reduced} />
              ))}
            </div>
          </>

        ) : isReport ? (
          /* Reports/Research: download CTA grid ─────────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r, i) => (
              <ReportCard key={r.id} resource={r} index={i} base={base} reduced={reduced} pubSlug={typeParam} />
            ))}
          </div>

        ) : isStory ? (
          /* Customer Stories: 2-col photography grid ────────────────── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((r, i) => (
              <StoryCard key={r.id} resource={r} index={i} base={base} reduced={reduced} />
            ))}
          </div>

        ) : (
          /* Generic fallback (type is in ALL_PUBLIC_TYPES but unhandled) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((r, i) => (
              <BlogCard key={r.id} resource={r} index={i} base={base} reduced={reduced} />
            ))}
          </div>
        )}

        {/* Pagination — skip for events (client-side split) and webinars (client-side status filter) */}
        {!loading && !isEvents && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
