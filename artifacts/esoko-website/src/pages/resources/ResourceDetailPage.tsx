import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'wouter';
import DOMPurify from 'dompurify';
import {
  ArrowLeft, Calendar, MapPin, Mic, Users, Download,
  ExternalLink, Tag, Globe, Video, Headphones, FileText,
  Clock, PlayCircle, BookOpen, AlertCircle, Loader2,
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { ResourceCard } from '@/components/resources/ResourceCard';
import type {
  ResourceDetail, EventExtension, PodcastExtension,
  WebinarExtension, ReportExtension, ResourceListItem,
} from '@/lib/resources';
import {
  PUBLIC_TYPE_TO_API, API_TYPE_TO_PUBLIC, TYPE_LABELS,
  resolveImageUrl, formatResourceDate, formatResourceDateTime,
  buildLdJson,
} from '@/lib/resources';

/* ── Helpers ────────────────────────────────────────────────────── */
function setMetaTag(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.content = content;
}
function setOgTag(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.content = content;
}
function removeOgTags() {
  ['og:title', 'og:description', 'og:image', 'og:type'].forEach(p => {
    document.querySelector(`meta[property="${p}"]`)?.remove();
  });
}

function youtubeEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
  return ytMatch ? `https://www.youtube.com/embed/${ytMatch[1]}` : null;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/* ── Skeleton ───────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="py-16 md:py-20 bg-[#051c0e]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4">
          <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-8 w-2/3 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {[100, 90, 80, 95, 70, 85, 60].map((w, i) => (
            <div key={i} className={`h-4 bg-gray-200 rounded animate-pulse`} style={{ width: `${w}%` }} />
          ))}
        </div>
        <aside className="space-y-4">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </aside>
      </div>
      <Footer />
    </div>
  );
}

/* ── Type-specific detail sections ──────────────────────────────── */
function EventDetail({ details }: { details: EventExtension }) {
  const speakers = Array.isArray(details.speakers) ? details.speakers : [];
  return (
    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 space-y-5">
      <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-purple-500" /> Event Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {details.startDatetime && (
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Starts</p>
              <p className="font-medium text-gray-800">{formatResourceDateTime(details.startDatetime)}</p>
              {details.timezone && <p className="text-xs text-gray-400">{details.timezone}</p>}
            </div>
          </div>
        )}
        {details.endDatetime && (
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Ends</p>
              <p className="font-medium text-gray-800">{formatResourceDateTime(details.endDatetime)}</p>
            </div>
          </div>
        )}
        {details.isOnline ? (
          <div className="flex items-start gap-2.5">
            <Globe className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Format</p>
              <p className="font-medium text-gray-800">Online Event</p>
            </div>
          </div>
        ) : details.venue ? (
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Venue</p>
              <p className="font-medium text-gray-800">{details.venue}</p>
            </div>
          </div>
        ) : null}
      </div>
      {details.registrationUrl && (
        <a
          href={details.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Register Now <ExternalLink className="w-4 h-4" />
        </a>
      )}
      {speakers.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Speakers</p>
          <div className="space-y-3">
            {speakers.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                  {s.title && <p className="text-xs text-gray-400">{s.title}</p>}
                  {s.bio && <p className="text-xs text-gray-500 mt-1">{s.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PodcastDetail({ details }: { details: PodcastExtension }) {
  const guests = Array.isArray(details.guests) ? details.guests : [];
  const externalUrls = details.externalUrls && typeof details.externalUrls === 'object' ? details.externalUrls : {};
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-5">
      <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
        <Headphones className="w-5 h-5 text-amber-500" /> Listen
      </h2>
      {details.episodeNumber != null && (
        <p className="text-sm text-amber-700 font-medium">
          Episode {details.episodeNumber}{details.season != null ? `, Season ${details.season}` : ''}
        </p>
      )}
      {details.audioUrl && (
        <div>
          <audio controls src={details.audioUrl} className="w-full rounded-xl" preload="metadata">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
      {details.host && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Mic className="w-4 h-4 text-amber-400" />
          <span className="text-gray-400">Host:</span>
          <span className="font-medium">{details.host}</span>
        </div>
      )}
      {guests.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Guests</p>
          <div className="flex flex-wrap gap-3">
            {guests.map((g, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-amber-100 rounded-xl px-3 py-2">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">{g.name}</p>
                  {g.title && <p className="text-xs text-gray-400">{g.title}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {Object.keys(externalUrls).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Listen On</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(externalUrls).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-50 transition-colors">
                <PlayCircle className="w-3.5 h-3.5" /> {platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function WebinarDetail({ details }: { details: WebinarExtension }) {
  const speakers = Array.isArray(details.speakers) ? details.speakers : [];
  const embedUrl = details.recordingUrl ? youtubeEmbedUrl(details.recordingUrl) : null;
  return (
    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 space-y-5">
      <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
        <Video className="w-5 h-5 text-rose-500" /> Webinar
      </h2>
      {/* Recording embed or link */}
      {embedUrl ? (
        <div className="aspect-video rounded-xl overflow-hidden shadow-sm">
          <iframe
            src={embedUrl}
            title="Webinar recording"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : details.recordingUrl ? (
        <a href={details.recordingUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          <PlayCircle className="w-4 h-4" /> Watch Recording
        </a>
      ) : null}
      {details.registrationUrl && (
        <a href={details.registrationUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          <ExternalLink className="w-4 h-4" /> Register to Attend
        </a>
      )}
      {details.meetingUrl && (
        <a href={details.meetingUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <Globe className="w-4 h-4" /> Join Meeting
        </a>
      )}
      {speakers.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Speakers</p>
          <div className="flex flex-wrap gap-3">
            {speakers.map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-rose-100 rounded-xl px-3 py-2">
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <div>
                  <p className="text-xs font-semibold text-gray-800">{s.name}</p>
                  {s.title && <p className="text-xs text-gray-400">{s.title}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReportDetail({ details, base }: { details: ReportExtension; base: string }) {
  const fileUrl = details.fileUrl
    ? (details.fileUrl.startsWith('http') ? details.fileUrl : `${base}api/storage/public-objects/${details.fileUrl}`)
    : null;
  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
        <FileText className="w-5 h-5 text-emerald-600" /> Report Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {details.organisation && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Published by</p>
            <p className="font-medium text-gray-800">{details.organisation}</p>
          </div>
        )}
        {details.publicationYear && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Year</p>
            <p className="font-medium text-gray-800">{details.publicationYear}</p>
          </div>
        )}
        {details.fileType && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Format</p>
            <p className="font-medium text-gray-800 uppercase">{details.fileType}</p>
          </div>
        )}
        {details.fileSize && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">File size</p>
            <p className="font-medium text-gray-800">{formatFileSize(details.fileSize)}</p>
          </div>
        )}
      </div>
      {fileUrl && (
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Download Report
        </a>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function ResourceDetailPage() {
  const { type: typeParam, slug } = useParams<{ type: string; slug: string }>();
  const base = import.meta.env.BASE_URL;

  const apiType = PUBLIC_TYPE_TO_API[typeParam] ?? null;

  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [related, setRelated]   = useState<ResourceListItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ── Fetch resource detail ──────────────────────────────────── */
  useEffect(() => {
    if (!apiType || !slug) { setNotFound(true); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setResource(null);

    fetch(`${base}api/resources/${apiType}/${slug}`)
      .then(async res => {
        if (res.status === 404) { if (!cancelled) setNotFound(true); return; }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json() as { resource: ResourceDetail };
        if (!cancelled) setResource(data.resource);
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });

    // Fetch related (same type, different slug)
    fetch(`${base}api/resources/${apiType}?limit=4`)
      .then(r => r.ok ? r.json() : { resources: [] })
      .then(data => {
        if (!cancelled) {
          setRelated((data.resources ?? []).filter((r: ResourceListItem) => r.slug !== slug).slice(0, 3));
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [apiType, slug, base]);

  /* ── SEO ────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!resource) return;
    const title = resource.seoTitle ?? `${resource.title} | Esoko`;
    document.title = title;
    setMetaTag('description', resource.seoDescription ?? resource.shortDescription ?? '');
    setOgTag('og:title', resource.seoTitle ?? resource.title);
    setOgTag('og:description', resource.seoDescription ?? resource.shortDescription ?? '');
    if (resource.featuredImageUrl) setOgTag('og:image', resolveImageUrl(resource.featuredImageUrl, base) ?? '');
    setOgTag('og:type', (resource.contentType === 'Blog' || resource.contentType === 'Customer Story') ? 'article' : 'website');

    // JSON-LD structured data
    const siteOrigin = window.location.origin;
    const ldJson = buildLdJson(resource, siteOrigin);
    let script = document.getElementById('resource-ld-json') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'resource-ld-json';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ldJson);

    return () => {
      document.title = 'Esoko — Agricultural Market Data & Advisory Services';
      setMetaTag('description', 'Esoko connects farmers, traders, and agribusiness to real-time agricultural market information.');
      removeOgTags();
      document.getElementById('resource-ld-json')?.remove();
    };
  }, [resource, base]);

  /* ── Sanitize HTML body ─────────────────────────────────────── */
  const sanitizedBody = useMemo(() => {
    if (!resource?.body) return '';
    return DOMPurify.sanitize(resource.body, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote',
        'a', 'img', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'hr', 'figure', 'figcaption',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target', 'rel', 'width', 'height', 'title'],
    });
  }, [resource?.body]);

  /* ── Loading ────────────────────────────────────────────────── */
  if (loading) return <DetailSkeleton />;

  /* ── Not found ──────────────────────────────────────────────── */
  if (notFound || !resource) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-40 text-center px-4">
          <AlertCircle className="w-14 h-14 text-gray-200 mx-auto mb-5" />
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-3">Resource Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-sm">
            This resource may have been unpublished or removed. Browse our latest content below.
          </p>
          <Link href={`/resources/${typeParam}`} className="text-emerald-600 font-semibold hover:underline flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to {TYPE_LABELS[typeParam] ?? 'Resources'}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imgSrc = resolveImageUrl(resource.featuredImageUrl, base);
  const pubSlug = API_TYPE_TO_PUBLIC[resource.typeSlug] ?? typeParam;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: '#051c0e' }}>
        {imgSrc && (
          <>
            <img src={imgSrc} alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-20" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051c0e] via-[#051c0e]/80 to-[#051c0e]/60" />
          </>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-white/50 mb-6"
          >
            <Link href="/resources" className="hover:text-white/80 transition-colors">Resources</Link>
            <span>/</span>
            <Link href={`/resources/${pubSlug}`} className="hover:text-white/80 transition-colors capitalize">
              {TYPE_LABELS[pubSlug] ?? pubSlug}
            </Link>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/20">
              {resource.contentType}
            </span>
            {resource.categoryName && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/8 text-white/60 border border-white/15">
                {resource.categoryName}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-5 max-w-3xl"
          >
            {resource.title}
          </motion.h1>

          {/* Short description */}
          {resource.shortDescription && (
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.14 }}
              className="text-white/65 text-lg max-w-2xl mb-6 leading-relaxed"
            >
              {resource.shortDescription}
            </motion.p>
          )}

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 text-white/50 text-sm"
          >
            {resource.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatResourceDate(resource.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Esoko
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Body + Sidebar ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Main column */}
        <article className="lg:col-span-2 space-y-8">

          {/* Featured image (full-width, below hero) */}
          {imgSrc && !resource.featuredImageUrl?.startsWith('#') && (
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <img src={imgSrc} alt={resource.title} className="w-full object-cover max-h-[480px]" loading="lazy" />
            </div>
          )}

          {/* HTML body */}
          {sanitizedBody ? (
            <div
              className="prose prose-gray max-w-none
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900
                prose-a:text-emerald-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-blockquote:border-emerald-400 prose-blockquote:text-gray-600 prose-blockquote:not-italic
                prose-code:text-emerald-700 prose-code:bg-emerald-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-img:rounded-xl prose-img:shadow-sm
                prose-table:text-sm
                prose-th:bg-gray-50 prose-th:text-gray-600 prose-th:font-semibold"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />
          ) : (
            <div className="py-8 text-center text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>Full content is not available.</p>
            </div>
          )}

          {/* Type-specific section */}
          {resource.details && resource.contentType === 'Event' && (
            <EventDetail details={resource.details as EventExtension} />
          )}
          {resource.details && resource.contentType === 'Podcast' && (
            <PodcastDetail details={resource.details as PodcastExtension} />
          )}
          {resource.details && resource.contentType === 'Webinar' && (
            <WebinarDetail details={resource.details as WebinarExtension} />
          )}
          {resource.details && resource.contentType === 'Research Report' && (
            <ReportDetail details={resource.details as ReportExtension} base={base} />
          )}

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {resource.tags.map(t => (
                  <Link key={t.id} href={`/resources/${pubSlug}?tag=${t.slug}`}>
                    <span className="text-xs font-medium px-3 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 rounded-full transition-colors cursor-pointer">
                      #{t.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:pt-0 pt-4">
          {/* Quick info */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
            <h3 className="font-heading font-bold text-gray-900 text-sm">Details</h3>
            {resource.publishedAt && (
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Published</p>
                  <p className="text-sm font-medium text-gray-700">{formatResourceDate(resource.publishedAt)}</p>
                </div>
              </div>
            )}
            {resource.categoryName && (
              <div className="flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="text-sm font-medium text-gray-700">{resource.categoryName}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Author</p>
                <p className="text-sm font-medium text-gray-700">Esoko</p>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h3 className="font-heading font-bold text-gray-900 text-sm mb-3">
                More {TYPE_LABELS[pubSlug] ?? 'Resources'}
              </h3>
              <div className="space-y-3">
                {related.map((r, i) => (
                  <ResourceCard key={r.id} resource={r} index={i} variant="compact" />
                ))}
              </div>
              <Link href={`/resources/${pubSlug}`} className="block text-xs text-emerald-600 hover:underline mt-3 text-center">
                View all {TYPE_LABELS[pubSlug]} →
              </Link>
            </div>
          )}

          {/* Browse other types */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <h3 className="font-heading font-bold text-gray-900 text-sm mb-3">Browse Resources</h3>
            <div className="space-y-1">
              {['blog', 'events', 'podcasts', 'webinars', 'research', 'customer-stories']
                .filter(t => t !== pubSlug)
                .slice(0, 4)
                .map(t => (
                  <Link key={t} href={`/resources/${t}`}
                    className="flex items-center justify-between py-1.5 text-sm text-gray-600 hover:text-emerald-700 transition-colors group">
                    <span>{TYPE_LABELS[t]}</span>
                    <span className="text-gray-300 group-hover:text-emerald-400 transition-colors">→</span>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}
