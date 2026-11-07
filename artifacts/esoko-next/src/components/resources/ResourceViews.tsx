import Link from "next/link";
import type {
  ListResponse, ResourceCategory, ResourceTag, ResourceDetail, ResourceListItem,
  EventExtension, PodcastExtension, WebinarExtension, ReportExtension,
} from "@/lib/resources";
import {
  ALL_PUBLIC_TYPES, TYPE_LABELS, PUBLIC_TYPE_TO_API, API_TYPE_TO_PUBLIC,
  formatResourceDate, formatResourceDateTime, estimateReadTime,
} from "@/lib/resources";
import { resourceHref, resourceImage, safePublicUrl } from "@/lib/resource-urls";
import { ResourceShare } from "./ResourceShare";

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

const TYPE_DESC: Record<string, string> = {
  blog: "Insights on African agriculture, technology and impact",
  events: "Conferences, field days and partner summits",
  podcasts: "Conversations with farmers, policymakers and innovators",
  webinars: "Live and on-demand learning from Esoko experts",
  research: "Data-driven analysis of African food systems",
  "customer-stories": "How organisations work with Esoko",
  reports: "Published reports and downloadable documents",
  guides: "Practical reading for field and programme teams",
};

function pubType(r: Pick<ResourceListItem, "typeSlug">) {
  return API_TYPE_TO_PUBLIC[r.typeSlug] ?? "blog";
}

function fileSize(bytes: number | null) {
  if (!bytes) return "";
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Public URL, or storage object key resolved to the public-object route. */
function mediaUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const safe = safePublicUrl(value);
  if (safe) return safe;
  if (!value.includes(":") && !value.startsWith("//")) {
    return `/api/storage/public-objects/${value.replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/")}`;
  }
  return null;
}

function ExtLink({ href, className, children }: { href: string | null | undefined; className?: string; children: React.ReactNode }) {
  const safe = safePublicUrl(href);
  if (!safe) return null;
  return <a href={safe} className={className ?? "rs-btn"} target="_blank" rel="noopener noreferrer">{children}</a>;
}

/* ── Cards ─────────────────────────────────────────────────────── */
export function ResourceCard({ resource, variant = "grid" }: { resource: ResourceListItem; variant?: "grid" | "featured" }) {
  const t = pubType(resource);
  return (
    <Link href={resourceHref(resource)} className={`rs-card rs-card--${variant}`}>
      <div className="rs-card-media">
        <img src={resourceImage(resource.featuredImageUrl)} alt="" loading="lazy" />
        {resource.featured && <span className="rs-featured-badge">Featured</span>}
      </div>
      <div className="rs-card-body">
        <div className="rs-card-meta">
          <span className={`rs-badge rs-badge--${t}`}>{TYPE_LABELS[t] ?? resource.contentType}</span>
          {resource.categoryName && <span className="rs-muted">{resource.categoryName}</span>}
        </div>
        <h3>{resource.title}</h3>
        {resource.shortDescription && <p>{resource.shortDescription}</p>}
        <div className="rs-card-foot">
          <span>{formatResourceDate(resource.eventStart ?? resource.publishedAt)}</span>
          {variant === "featured" ? <span className="rs-more">Read more &rarr;</span> : resource.tags[0] && <span className="rs-tagline">{resource.tags[0].name}</span>}
        </div>
      </div>
    </Link>
  );
}

function HeroCard({ resource }: { resource: ResourceListItem }) {
  const t = pubType(resource);
  return (
    <Link href={resourceHref(resource)} className="rs-hero-card">
      <div className="rs-hero-media">
        <img src={resourceImage(resource.featuredImageUrl)} alt="" />
        <span className="rs-featured-badge">Featured</span>
      </div>
      <div className="rs-hero-body">
        <div className="rs-card-meta">
          {resource.categoryName && <span className="rs-badge">{resource.categoryName}</span>}
          <span className="rs-muted">{TYPE_LABELS[t] ?? resource.contentType}</span>
        </div>
        <h3>{resource.title}</h3>
        {resource.shortDescription && <p>{resource.shortDescription}</p>}
        <div className="rs-card-foot">
          <span>Esoko &middot; {formatResourceDate(resource.publishedAt)} &middot; {estimateReadTime(resource.body)} min read</span>
        </div>
        <span className="rs-more">Read article &rarr;</span>
      </div>
    </Link>
  );
}

/* ── Browser ───────────────────────────────────────────────────── */
export function ResourceBrowser({ data, categories, tags, search, type }: {
  data: ListResponse; categories: ResourceCategory[]; tags: ResourceTag[]; search: Search; type?: string;
}) {
  const q = one(search.search);
  const category = one(search.category);
  const tag = one(search.tag);
  const webinarStatus = one(search.webinarStatus);
  const label = type ? TYPE_LABELS[type] ?? "Resources" : "Resources";
  const base = type ? `/resources/${type}/` : "/resources/";
  const action = type ? `/esoko-next/resources/${type}/` : "/esoko-next/resources/";
  const filtered = Boolean(q || category || tag || webinarStatus);
  const showFeatured = !filtered && data.page <= 1;
  const featured = showFeatured ? data.resources.filter((r) => r.featured).slice(0, 4) : [];
  const featuredIds = new Set(featured.map((r) => r.id));
  const rest = data.resources.filter((r) => !featuredIds.has(r.id));

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(search)) {
      const val = one(v);
      if (val && k !== "page") params.set(k, val);
    }
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `${base}?${s}` : base;
  };

  return (
    <main className="resources-main">
      <nav aria-label="Breadcrumb" className="rs-crumbs">
        <a href="/">Home</a><span aria-hidden="true">/</span>
        {type ? <><Link href="/resources/">Resources</Link><span aria-hidden="true">/</span><span aria-current="page">{label}</span></> : <span aria-current="page">Resources</span>}
      </nav>

      <header className="rs-intro">
        <span className="rs-eyebrow">Knowledge Hub</span>
        <h1>{type ? label : "Resources"}</h1>
        <p>{type ? TYPE_DESC[type] : "Insights, research, events, webinars, podcasts, guides and stories shaping digital agriculture across Africa."}</p>
        {type && PUBLIC_TYPE_TO_API[type] !== undefined && (type === "reports" || type === "guides") && (
          <p className="rs-note">{label} currently share content with {type === "reports" ? "Research" : "Blog"}.</p>
        )}
      </header>

      <nav aria-label="Browse by type" className="rs-types">
        <Link href="/resources/" className={!type ? "is-active" : ""} aria-current={!type ? "page" : undefined}>All</Link>
        {ALL_PUBLIC_TYPES.map((t) => (
          <Link key={t} href={`/resources/${t}/`} className={type === t ? "is-active" : ""} aria-current={type === t ? "page" : undefined}>{TYPE_LABELS[t]}</Link>
        ))}
      </nav>

      <form method="get" action={action} className="rs-filters" role="search">
        <label className="rs-field rs-field--grow">
          <span>Search</span>
          <input type="search" name="search" defaultValue={q} placeholder="Search resources" />
        </label>
        {categories.length > 0 && (
          <label className="rs-field"><span>Topic</span>
            <select name="category" defaultValue={category}>
              <option value="">All topics</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
        )}
        {tags.length > 0 && (
          <label className="rs-field"><span>Tag</span>
            <select name="tag" defaultValue={tag}>
              <option value="">All tags</option>
              {tags.map((t) => <option key={t.id} value={t.slug}>{t.name}</option>)}
            </select>
          </label>
        )}
        {type === "webinars" && (
          <label className="rs-field"><span>Status</span>
            <select name="webinarStatus" defaultValue={webinarStatus}>
              <option value="">All webinars</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="on-demand">On demand</option>
            </select>
          </label>
        )}
        <div className="rs-filter-actions">
          <button type="submit" className="rs-btn">Apply</button>
          {filtered && <Link href={base} className="rs-btn rs-btn--ghost">Clear</Link>}
        </div>
      </form>

      {featured.length > 0 && (
        <section className="rs-section" aria-labelledby="rs-featured">
          <h2 id="rs-featured">Featured</h2>
          <HeroCard resource={featured[0]} />
          {featured.length > 1 && <div className="rs-grid rs-grid--3">{featured.slice(1).map((r) => <ResourceCard key={r.id} resource={r} variant="featured" />)}</div>}
        </section>
      )}

      <section className="rs-section" aria-labelledby="rs-latest">
        <div className="rs-section-head">
          <h2 id="rs-latest">{type ? `All ${label.toLowerCase()}` : "Latest from Esoko"}</h2>
          <p className="rs-count">{data.total} {data.total === 1 ? "resource" : "resources"}{filtered ? " matching your filters" : ""}</p>
        </div>
        {data.resources.length === 0 ? (
          <div className="rs-empty">
            <h3>{filtered ? "No resources match your filters" : "Nothing published here yet"}</h3>
            <p>{filtered ? "Try a broader search or another topic." : "Browse other resource types above."}</p>
            {filtered && <Link href={base} className="rs-btn">Clear filters</Link>}
          </div>
        ) : rest.length > 0 ? (
          <div className="rs-grid">{rest.map((r) => <ResourceCard key={r.id} resource={r} />)}</div>
        ) : null}
        {data.totalPages > 1 && (
          <nav aria-label="Pagination" className="rs-pager">
            {data.page > 1 ? <Link href={pageHref(data.page - 1)} rel="prev">&larr; Previous</Link> : <span className="is-disabled">&larr; Previous</span>}
            <span>Page {data.page} of {data.totalPages}</span>
            {data.page < data.totalPages ? <Link href={pageHref(data.page + 1)} rel="next">Next &rarr;</Link> : <span className="is-disabled">Next &rarr;</span>}
          </nav>
        )}
      </section>
    </main>
  );
}

/* ── Detail panels ─────────────────────────────────────────────── */
function EventPanel({ d }: { d: EventExtension }) {
  const speakers = Array.isArray(d.speakers) ? d.speakers : [];
  return (
    <section className="rs-panel" aria-labelledby="rs-ev">
      <h2 id="rs-ev">Event details</h2>
      <dl className="rs-dl">
        {d.startDatetime && <div><dt>Starts</dt><dd>{formatResourceDateTime(d.startDatetime)}</dd></div>}
        {d.endDatetime && <div><dt>Ends</dt><dd>{formatResourceDateTime(d.endDatetime)}</dd></div>}
        {d.timezone && <div><dt>Timezone</dt><dd>{d.timezone}</dd></div>}
        {d.isOnline ? <div><dt>Format</dt><dd>Online event</dd></div> : d.venue ? <div><dt>Venue</dt><dd>{d.venue}</dd></div> : null}
      </dl>
      <ExtLink href={d.registrationUrl}>Register</ExtLink>
      {speakers.length > 0 && <People title="Speakers" people={speakers} />}
    </section>
  );
}

function People({ title, people }: { title: string; people: Array<{ name: string; title?: string; bio?: string }> }) {
  return (
    <div><h3 className="rs-subhead">{title}</h3>
      <ul className="rs-people">{people.map((p, i) => <li key={i}><strong>{p.name}</strong>{p.title && <span>{p.title}</span>}{p.bio && <small>{p.bio}</small>}</li>)}</ul>
    </div>
  );
}

function Transcript({ text }: { text: string | null }) {
  if (!text || typeof text !== "string") return null;
  return <details className="rs-transcript"><summary>Transcript</summary><div>{text}</div></details>;
}

function PodcastPanel({ d }: { d: PodcastExtension }) {
  const guests = Array.isArray(d.guests) ? d.guests : [];
  const audio = mediaUrl(d.audioUrl);
  const platforms = d.externalUrls && typeof d.externalUrls === "object"
    ? Object.entries(d.externalUrls).map(([k, v]) => [k, safePublicUrl(typeof v === "string" ? v : null)] as const).filter(([, v]) => v)
    : [];
  return (
    <section className="rs-panel" aria-labelledby="rs-pod">
      <h2 id="rs-pod">Listen</h2>
      {d.episodeNumber != null && <p className="rs-muted">Episode {d.episodeNumber}{d.season != null ? `, Season ${d.season}` : ""}</p>}
      {audio && <audio controls preload="metadata" src={audio} className="rs-audio">Your browser does not support audio playback. <a href={audio}>Download the episode</a>.</audio>}
      {d.host && <p><span className="rs-muted">Host:</span> {d.host}</p>}
      {guests.length > 0 && <People title="Guests" people={guests} />}
      {platforms.length > 0 && <div><h3 className="rs-subhead">Listen on</h3><div className="rs-chips">{platforms.map(([k, v]) => <a key={k} href={v!} target="_blank" rel="noopener noreferrer">{k}</a>)}</div></div>}
      <Transcript text={d.transcript} />
    </section>
  );
}

function WebinarPanel({ d }: { d: WebinarExtension }) {
  const speakers = Array.isArray(d.speakers) ? d.speakers : [];
  return (
    <section className="rs-panel" aria-labelledby="rs-web">
      <h2 id="rs-web">Webinar</h2>
      <div className="rs-actions">
        <ExtLink href={d.recordingUrl}>Watch recording</ExtLink>
        <ExtLink href={d.registrationUrl} className="rs-btn rs-btn--ghost">Register to attend</ExtLink>
        <ExtLink href={d.meetingUrl} className="rs-btn rs-btn--ghost">Join meeting</ExtLink>
      </div>
      {speakers.length > 0 && <People title="Speakers" people={speakers} />}
      <Transcript text={d.transcript} />
    </section>
  );
}

function ReportPanel({ d }: { d: ReportExtension }) {
  const file = mediaUrl(d.fileUrl);
  return (
    <section className="rs-panel" aria-labelledby="rs-rep">
      <h2 id="rs-rep">Report details</h2>
      <dl className="rs-dl">
        {d.organisation && <div><dt>Published by</dt><dd>{d.organisation}</dd></div>}
        {d.publicationYear && <div><dt>Year</dt><dd>{d.publicationYear}</dd></div>}
        {d.fileType && <div><dt>Format</dt><dd>{d.fileType.toUpperCase()}</dd></div>}
        {d.fileSize ? <div><dt>File size</dt><dd>{fileSize(d.fileSize)}</dd></div> : null}
      </dl>
      {file && <a href={file} className="rs-btn" target="_blank" rel="noopener noreferrer" download>Download report</a>}
    </section>
  );
}

function TypePanel({ resource }: { resource: ResourceDetail }) {
  const d = resource.details;
  if (!d) return null;
  switch (resource.contentType) {
    case "Event": return <EventPanel d={d as EventExtension} />;
    case "Podcast": return <PodcastPanel d={d as PodcastExtension} />;
    case "Webinar": return <WebinarPanel d={d as WebinarExtension} />;
    case "Research Report": return <ReportPanel d={d as ReportExtension} />;
    default: return null;
  }
}

/* ── Article ───────────────────────────────────────────────────── */
export function ResourceArticle({ resource, type, bodyHtml, canonicalUrl, related, adjacent }: {
  resource: ResourceDetail; type: string; bodyHtml: string; canonicalUrl: string; related: ResourceListItem[];
  adjacent: { prev: { title: string; slug: string } | null; next: { title: string; slug: string } | null } | null;
}) {
  const label = TYPE_LABELS[type] ?? resource.contentType;
  const enc = encodeURIComponent(canonicalUrl);
  const encT = encodeURIComponent(resource.title);
  const adjHref = (slug: string) => `/resources/${type}/${encodeURIComponent(slug)}/`;
  return (
    <main className="resources-main">
      <article className="rs-article">
        <header className="rs-article-head">
          <nav aria-label="Breadcrumb" className="rs-crumbs">
            <a href="/">Home</a><span aria-hidden="true">/</span>
            <Link href="/resources/">Resources</Link><span aria-hidden="true">/</span>
            <Link href={`/resources/${type}/`}>{label}</Link><span aria-hidden="true">/</span>
            <span aria-current="page" className="rs-crumb-current">{resource.title}</span>
          </nav>
          <div className="rs-card-meta">
            <span className={`rs-badge rs-badge--${type}`}>{label}</span>
            {resource.categoryName && (resource.categorySlug
              ? <Link className="rs-badge rs-badge--soft" href={`/resources/${type}/?category=${encodeURIComponent(resource.categorySlug)}`}>{resource.categoryName}</Link>
              : <span className="rs-badge rs-badge--soft">{resource.categoryName}</span>)}
          </div>
          <h1>{resource.title}</h1>
          {resource.shortDescription && <p className="rs-lede">{resource.shortDescription}</p>}
          <p className="rs-byline">
            Esoko
            {resource.publishedAt && <> &middot; <time dateTime={resource.publishedAt}>{formatResourceDate(resource.publishedAt)}</time></>}
            {" "}&middot; {estimateReadTime(resource.body)} min read
          </p>
        </header>

        <figure className="rs-article-image"><img src={resourceImage(resource.featuredImageUrl)} alt="" /></figure>

        <div className="rs-article-grid">
          <div className="rs-article-main">
            <TypePanel resource={resource} />
            {bodyHtml ? <div className="rs-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} /> : <p className="rs-muted">No further content for this resource.</p>}
            {resource.tags.length > 0 && (
              <div className="rs-tags"><span className="rs-muted">Tags</span>
                {resource.tags.map((t) => <Link key={t.id} href={`/resources/${type}/?tag=${encodeURIComponent(t.slug)}`}>{t.name}</Link>)}
              </div>
            )}
          </div>
          <aside className="rs-aside">
            <h2 className="rs-subhead">Share</h2>
            <div className="rs-share">
              <a className="rs-share-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="rs-share-btn" href={`https://wa.me/?text=${encT}%20${enc}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <a className="rs-share-btn" href={`https://x.com/intent/tweet?url=${enc}&text=${encT}`} target="_blank" rel="noopener noreferrer">X</a>
              <ResourceShare url={canonicalUrl} />
            </div>
            <Link href={`/resources/${type}/`} className="rs-back">&larr; Back to {label}</Link>
          </aside>
        </div>

        {adjacent && (adjacent.prev || adjacent.next) && (
          <nav aria-label="More in this series" className="rs-adjacent">
            {adjacent.prev ? <Link href={adjHref(adjacent.prev.slug)} rel="prev"><small>Previous</small><span>{adjacent.prev.title}</span></Link> : <span />}
            {adjacent.next ? <Link href={adjHref(adjacent.next.slug)} rel="next" className="is-next"><small>Next</small><span>{adjacent.next.title}</span></Link> : <span />}
          </nav>
        )}
      </article>

      {related.length > 0 && (
        <section className="rs-section" aria-labelledby="rs-related">
          <div className="rs-section-head"><h2 id="rs-related">Related {label.toLowerCase()}</h2><Link href={`/resources/${type}/`} className="rs-more">View all &rarr;</Link></div>
          <div className="rs-grid rs-grid--3">{related.slice(0, 3).map((r) => <ResourceCard key={r.id} resource={r} />)}</div>
        </section>
      )}
    </main>
  );
}
