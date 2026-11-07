/* ── Public resource types & URL helpers ─────────────────────────── */

export interface ResourceTag {
  id: number;
  name: string;
  slug: string;
}

export interface ResourceListItem {
  id: number;
  title: string;
  slug: string;
  contentType: string;
  typeSlug: string;       // API type slug: blog, event, podcast…
  status: string;
  featured: boolean;
  shortDescription: string | null;
  featuredImageUrl: string | null;
  body: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tags: ResourceTag[];
  // Event-specific fields included in listing
  eventStart?: string | null;
  eventEnd?: string | null;
  // Inline extension data for typed listings (webinar, podcast, research-report).
  // JSON text fields (speakers, guests, externalUrls) are pre-parsed by the API.
  extension?: Record<string, unknown> | null;
}

export interface EventExtension {
  id: number;
  resourceId: number;
  startDatetime: string | null;
  endDatetime: string | null;
  timezone: string | null;
  venue: string | null;
  isOnline: boolean;
  registrationUrl: string | null;
  speakers: Array<{ name: string; title?: string; bio?: string }> | null;
}

export interface PodcastExtension {
  id: number;
  resourceId: number;
  episodeNumber: number | null;
  season: number | null;
  host: string | null;
  guests: Array<{ name: string; title?: string }> | null;
  audioUrl: string | null;
  externalUrls: Record<string, string> | null;
  transcript: string | null;
}

export interface WebinarExtension {
  id: number;
  resourceId: number;
  speakers: Array<{ name: string; title?: string }> | null;
  registrationUrl: string | null;
  meetingUrl: string | null;
  recordingUrl: string | null;
  transcript: string | null;
}

export interface ReportExtension {
  id: number;
  resourceId: number;
  fileUrl: string | null;
  fileSize: number | null;
  fileType: string | null;
  downloadCount: number;
  organisation: string | null;
  publicationYear: number | null;
}

export interface ResourceDetail extends ResourceListItem {
  seoTitle: string | null;
  seoDescription: string | null;
  details: EventExtension | PodcastExtension | WebinarExtension | ReportExtension | null;
}

export interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface ListResponse {
  resources: ResourceListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ── URL segment ↔ API type mappings ─────────────────────────────── */

/** Public URL segment → API type slug (used in API calls) */
export const PUBLIC_TYPE_TO_API: Record<string, string> = {
  blog:               'blog',
  events:             'event',
  podcasts:           'podcast',
  webinars:           'webinar',
  research:           'research-report',
  'customer-stories': 'customer-story',
  reports:            'research-report', // alias — same backend type until dedicated type added
  guides:             'blog',            // alias — same backend type until dedicated type added
};

/** API type slug → public URL segment */
export const API_TYPE_TO_PUBLIC: Record<string, string> = {
  blog:              'blog',
  event:             'events',
  podcast:           'podcasts',
  webinar:           'webinars',
  'research-report': 'research',
  'customer-story':  'customer-stories',
};

/** Public URL segment → human-readable label */
export const TYPE_LABELS: Record<string, string> = {
  blog:               'Blog',
  events:             'Events',
  podcasts:           'Podcasts',
  webinars:           'Webinars',
  research:           'Research',
  'customer-stories': 'Customer Stories',
  reports:            'Reports',
  guides:             'Guides',
};

/** All valid public URL segments, in display order */
export const ALL_PUBLIC_TYPES = [
  'blog',
  'events',
  'podcasts',
  'webinars',
  'research',
  'customer-stories',
  'reports',
  'guides',
] as const;

/* ── Image URL resolver ───────────────────────────────────────────── */
export function resolveImageUrl(url: string | null | undefined, base: string): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  // Stored object path — route through public storage API
  return `${base}api/storage/public-objects/${url}`;
}

/* ── Date formatter ──────────────────────────────────────────────── */
export function formatResourceDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatResourceDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

/* ── Read-time estimator ─────────────────────────────────────────── */
/** Estimates reading time in minutes from a (possibly HTML) body string. */
export function estimateReadTime(body: string | null | undefined): number {
  if (!body) return 1;
  const text = body.replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ── JSON-LD builder ─────────────────────────────────────────────── */
export function buildLdJson(resource: ResourceDetail, siteUrl: string): object {
  const pubSlug = API_TYPE_TO_PUBLIC[resource.typeSlug] ?? resource.typeSlug;
  const canonicalUrl = `${siteUrl}/resources/${pubSlug}/${resource.slug}`;
  const base = {
    '@context':    'https://schema.org',
    name:          resource.title,
    url:           canonicalUrl,
    description:   resource.seoDescription ?? resource.shortDescription ?? undefined,
    image:         resource.featuredImageUrl ?? undefined,
    datePublished: resource.publishedAt ?? undefined,
    dateModified:  resource.updatedAt   ?? undefined,
    publisher: {
      '@type': 'Organization',
      name:    'Esoko',
      url:     siteUrl,
    },
  };

  if (resource.contentType === 'Blog' || resource.contentType === 'Customer Story') {
    return { '@type': 'Article', ...base, headline: resource.title };
  }

  if (resource.contentType === 'Event') {
    const ev = resource.details as EventExtension | null;
    return {
      '@type': 'Event',
      ...base,
      startDate:           ev?.startDatetime ?? undefined,
      endDate:             ev?.endDatetime   ?? undefined,
      location:            ev?.isOnline
        ? { '@type': 'VirtualLocation' }
        : ev?.venue
        ? { '@type': 'Place', name: ev.venue }
        : undefined,
      eventAttendanceMode: ev?.isOnline
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
    };
  }

  if (resource.contentType === 'Podcast') {
    const pod = resource.details as PodcastExtension | null;
    return {
      '@type':       'PodcastEpisode',
      ...base,
      episodeNumber: pod?.episodeNumber ?? undefined,
      partOfSeries: {
        '@type': 'PodcastSeries',
        name:    'Esoko Podcast',
        url:     `${siteUrl}/resources/podcasts`,
      },
      audio: pod?.audioUrl
        ? { '@type': 'AudioObject', contentUrl: pod.audioUrl }
        : undefined,
    };
  }

  if (resource.contentType === 'Research Report') {
    const rep = resource.details as ReportExtension | null;
    const fileUrl = rep?.fileUrl
      ? (rep.fileUrl.startsWith('http')
          ? rep.fileUrl
          : `${siteUrl}/api/storage/public-objects/${rep.fileUrl}`)
      : undefined;
    return {
      '@type':        'DigitalDocument',
      ...base,
      encodingFormat: rep?.fileType
        ? `application/${rep.fileType.toLowerCase()}`
        : 'application/pdf',
      contentUrl:     fileUrl,
      copyrightYear:  rep?.publicationYear ?? undefined,
      author: {
        '@type': 'Organization',
        name:    rep?.organisation ?? 'Esoko',
      },
    };
  }

  return { '@type': 'WebPage', ...base };
}

/* ── Breadcrumb JSON-LD builder ──────────────────────────────────── */
export function buildBreadcrumbLdJson(
  crumbs: Array<{ name: string; url: string }>,
): object {
  return {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type':  'ListItem',
      position: i + 1,
      name:     c.name,
      item:     c.url,
    })),
  };
}
