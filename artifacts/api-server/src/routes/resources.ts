/**
 * resources.ts
 *
 * Public and admin REST API for the Resources CMS.
 *
 * Public:
 *   GET /api/resources                       – paginated listing (published only)
 *   GET /api/resources/:type                 – same, filtered by content type
 *   GET /api/resources/:type/:slug           – single resource + extension data
 *   GET /api/resource-categories             – all categories
 *   GET /api/resource-tags                   – all tags
 *
 * Admin (requires CONTENT_EDITOR | CONTENT_AUTHOR | SUPER_ADMIN):
 *   GET    /api/admin/resources              – all statuses, paginated
 *   POST   /api/admin/resources              – create
 *   GET    /api/admin/resources/:id          – single resource + extension
 *   PUT    /api/admin/resources/:id          – update (authors: own drafts only)
 *   DELETE /api/admin/resources/:id          – archive (soft delete)
 *   POST   /api/admin/resources/:id/publish  – publish (CONTENT_EDITOR+ only)
 *   POST   /api/admin/resources/:id/unpublish
 *   POST   /api/admin/resources/:id/schedule – schedule future publication
 *
 *   GET/POST/PUT/DELETE /api/admin/resource-categories
 *   GET/POST/PUT/DELETE /api/admin/resource-tags
 */
import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { db } from "@workspace/db";
import {
  resourcesTable,
  resourceCategoriesTable,
  resourceTagsTable,
  resourceTagRelationshipsTable,
  resourceEventsTable,
  resourcePodcastsTable,
  resourceWebinarsTable,
  resourceReportsTable,
  type ResourceContentType,
} from "@workspace/db";
import { eq, and, or, ilike, inArray, desc, count, sql, asc } from "drizzle-orm";
import { requireRole, audit } from "../lib/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

/* ── URL-slug ↔ DB content type mapping ────────────────────────────── */
const URL_TYPE_TO_DB: Record<string, ResourceContentType> = {
  "blog":            "Blog",
  "event":           "Event",
  "podcast":         "Podcast",
  "webinar":         "Webinar",
  "research-report": "Research Report",
  "customer-story":  "Customer Story",
};
const DB_TYPE_TO_URL: Record<ResourceContentType, string> = {
  "Blog":             "blog",
  "Event":            "event",
  "Podcast":          "podcast",
  "Webinar":          "webinar",
  "Research Report":  "research-report",
  "Customer Story":   "customer-story",
};

const CONTENT_TYPES = Object.values(URL_TYPE_TO_DB);
const STATUSES = ["Draft","In Review","Scheduled","Published","Unpublished","Archived"] as const;

/* ── Zod schemas ────────────────────────────────────────────────────── */
const resourceBaseSchema = z.object({
  contentType:      z.enum(["Blog","Event","Podcast","Webinar","Research Report","Customer Story"]),
  title:            z.string().min(1).max(500),
  slug:             z.string().min(1).max(300).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  shortDescription: z.string().max(1000).default(""),
  body:             z.string().default(""),
  featuredImageUrl: z.string().url().nullable().optional(),
  categoryId:       z.number().int().positive().nullable().optional(),
  status:           z.enum(["Draft","In Review","Scheduled","Published","Unpublished","Archived"]).optional(),
  featured:         z.boolean().optional(),
  seoTitle:         z.string().max(120).nullable().optional(),
  seoDescription:   z.string().max(320).nullable().optional(),
  scheduledFor:     z.string().datetime().nullable().optional(),
  // Extension data
  details:          z.record(z.unknown()).optional(),
  // Tags
  tagIds:           z.array(z.number().int().positive()).optional(),
});

const createResourceSchema  = resourceBaseSchema;
const updateResourceSchema  = resourceBaseSchema.partial().omit({ contentType: true });

const categorySchema = z.object({
  name:        z.string().min(1).max(100),
  slug:        z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  color:       z.string().max(20).optional(),
});

const tagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

/* ── Extension data helpers ──────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TxOrDb = typeof db | any;

async function getExtension(resourceId: number, contentType: ResourceContentType): Promise<Record<string, unknown> | null> {
  switch (contentType) {
    case "Event": {
      const [row] = await db.select().from(resourceEventsTable).where(eq(resourceEventsTable.resourceId, resourceId));
      return row ?? null;
    }
    case "Podcast": {
      const [row] = await db.select().from(resourcePodcastsTable).where(eq(resourcePodcastsTable.resourceId, resourceId));
      return row ?? null;
    }
    case "Webinar": {
      const [row] = await db.select().from(resourceWebinarsTable).where(eq(resourceWebinarsTable.resourceId, resourceId));
      return row ?? null;
    }
    case "Research Report": {
      const [row] = await db.select().from(resourceReportsTable).where(eq(resourceReportsTable.resourceId, resourceId));
      return row ?? null;
    }
    default:
      return null;
  }
}

async function upsertExtension(txOrDb: TxOrDb, resourceId: number, contentType: ResourceContentType, details: Record<string, unknown>): Promise<void> {
  switch (contentType) {
    case "Event":
      await txOrDb.insert(resourceEventsTable).values({
        resourceId,
        startDatetime:   details.startDatetime ? new Date(details.startDatetime as string) : undefined,
        endDatetime:     details.endDatetime   ? new Date(details.endDatetime as string)   : undefined,
        timezone:        details.timezone       as string | undefined,
        venue:           details.venue          as string | undefined,
        isOnline:        Boolean(details.isOnline),
        registrationUrl: details.registrationUrl as string | undefined,
        speakers:        Array.isArray(details.speakers) ? JSON.stringify(details.speakers) : "[]",
      }).onConflictDoUpdate({
        target: resourceEventsTable.resourceId,
        set: {
          startDatetime:   details.startDatetime ? new Date(details.startDatetime as string) : undefined,
          endDatetime:     details.endDatetime   ? new Date(details.endDatetime as string)   : undefined,
          timezone:        details.timezone       as string | undefined,
          venue:           details.venue          as string | undefined,
          isOnline:        Boolean(details.isOnline),
          registrationUrl: details.registrationUrl as string | undefined,
          speakers:        Array.isArray(details.speakers) ? JSON.stringify(details.speakers) : "[]",
        },
      });
      break;

    case "Podcast":
      await txOrDb.insert(resourcePodcastsTable).values({
        resourceId,
        episodeNumber: details.episodeNumber as number | undefined,
        season:        details.season        as number | undefined,
        host:          details.host          as string | undefined,
        guests:        Array.isArray(details.guests) ? JSON.stringify(details.guests) : "[]",
        audioUrl:      details.audioUrl      as string | undefined,
        externalUrls:  details.externalUrls && typeof details.externalUrls === "object"
          ? JSON.stringify(details.externalUrls)
          : "{}",
        transcript:    details.transcript    as string | undefined,
      }).onConflictDoUpdate({
        target: resourcePodcastsTable.resourceId,
        set: {
          episodeNumber: details.episodeNumber as number | undefined,
          season:        details.season        as number | undefined,
          host:          details.host          as string | undefined,
          guests:        Array.isArray(details.guests) ? JSON.stringify(details.guests) : "[]",
          audioUrl:      details.audioUrl      as string | undefined,
          externalUrls:  details.externalUrls && typeof details.externalUrls === "object"
            ? JSON.stringify(details.externalUrls)
            : "{}",
          transcript:    details.transcript    as string | undefined,
        },
      });
      break;

    case "Webinar":
      await txOrDb.insert(resourceWebinarsTable).values({
        resourceId,
        speakers:        Array.isArray(details.speakers) ? JSON.stringify(details.speakers) : "[]",
        registrationUrl: details.registrationUrl as string | undefined,
        meetingUrl:      details.meetingUrl      as string | undefined,
        recordingUrl:    details.recordingUrl    as string | undefined,
        transcript:      details.transcript      as string | undefined,
      }).onConflictDoUpdate({
        target: resourceWebinarsTable.resourceId,
        set: {
          speakers:        Array.isArray(details.speakers) ? JSON.stringify(details.speakers) : "[]",
          registrationUrl: details.registrationUrl as string | undefined,
          meetingUrl:      details.meetingUrl      as string | undefined,
          recordingUrl:    details.recordingUrl    as string | undefined,
          transcript:      details.transcript      as string | undefined,
        },
      });
      break;

    case "Research Report":
      await txOrDb.insert(resourceReportsTable).values({
        resourceId,
        fileUrl:         details.fileUrl         as string | undefined,
        fileSize:        details.fileSize         as number | undefined,
        fileType:        details.fileType         as string | undefined,
        organisation:    details.organisation     as string | undefined,
        publicationYear: details.publicationYear  as number | undefined,
      }).onConflictDoUpdate({
        target: resourceReportsTable.resourceId,
        set: {
          fileUrl:         details.fileUrl         as string | undefined,
          fileSize:        details.fileSize         as number | undefined,
          fileType:        details.fileType         as string | undefined,
          organisation:    details.organisation     as string | undefined,
          publicationYear: details.publicationYear  as number | undefined,
        },
      });
      break;

    default:
      break;
  }
}

/* ── Tag validation helper ──────────────────────────────────────────── */
/**
 * Validates that every requested tag ID exists.
 * Returns null on success, or an array of the missing IDs on failure.
 */
async function validateTagIds(tagIds: number[]): Promise<number[] | null> {
  if (tagIds.length === 0) return null;
  const existing = await db
    .select({ id: resourceTagsTable.id })
    .from(resourceTagsTable)
    .where(inArray(resourceTagsTable.id, tagIds));
  const foundSet = new Set(existing.map(r => r.id));
  const missing = tagIds.filter(id => !foundSet.has(id));
  return missing.length > 0 ? missing : null;
}

/* ── Tag sync helper ────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncTags(tx: any, resourceId: number, tagIds: number[]): Promise<void> {
  // Delete existing, re-insert requested (within the same transaction)
  await tx.delete(resourceTagRelationshipsTable)
    .where(eq(resourceTagRelationshipsTable.resourceId, resourceId));
  if (tagIds.length > 0) {
    await tx.insert(resourceTagRelationshipsTable)
      .values(tagIds.map((tagId: number) => ({ resourceId, tagId })))
      .onConflictDoNothing();
  }
}

/* ── Tag lookup helper ──────────────────────────────────────────────── */
async function getTagsForResource(resourceId: number): Promise<{ id: number; name: string; slug: string }[]> {
  const rows = await db
    .select({ id: resourceTagsTable.id, name: resourceTagsTable.name, slug: resourceTagsTable.slug })
    .from(resourceTagRelationshipsTable)
    .innerJoin(resourceTagsTable, eq(resourceTagRelationshipsTable.tagId, resourceTagsTable.id))
    .where(eq(resourceTagRelationshipsTable.resourceId, resourceId));
  return rows;
}

/* ── Shared listing query builder ───────────────────────────────────── */
interface ListParams {
  contentType?:    string;   // URL slug (e.g. "blog")
  category?:       string;   // category slug
  tag?:            string;   // tag slug
  search?:         string;
  page?:           number;
  limit?:          number;
  status?:         string;   // admin only filter
  publishedOnly?:  boolean;
  featured?:       boolean;  // filter to featured resources only
  webinarStatus?:  'upcoming' | 'live' | 'on-demand'; // server-side webinar status filter
}

async function listResources(params: ListParams) {
  const page  = Math.max(1, params.page  ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 12));
  const offset = (page - 1) * limit;

  // Resolve content type filter
  const dbType = params.contentType ? URL_TYPE_TO_DB[params.contentType] : undefined;

  // Build WHERE conditions
  const conditions = [];

  if (params.publishedOnly) conditions.push(eq(resourcesTable.status, "Published"));
  else if (params.status && STATUSES.includes(params.status as (typeof STATUSES)[number])) {
    conditions.push(eq(resourcesTable.status, params.status as (typeof STATUSES)[number]));
  }

  if (dbType) conditions.push(eq(resourcesTable.contentType, dbType));
  if (params.featured) conditions.push(eq(resourcesTable.featured, true));

  // Webinar status filter — server-side subquery on resource_webinars so it works across all pages
  if (dbType === 'Webinar' && params.webinarStatus) {
    let webinarStatusCond;
    if (params.webinarStatus === 'on-demand') {
      webinarStatusCond = sql`EXISTS (
        SELECT 1 FROM resource_webinars rw
        WHERE rw.resource_id = ${resourcesTable.id}
          AND rw.recording_url IS NOT NULL AND rw.recording_url != ''
      )`;
    } else if (params.webinarStatus === 'live') {
      webinarStatusCond = sql`EXISTS (
        SELECT 1 FROM resource_webinars rw
        WHERE rw.resource_id = ${resourcesTable.id}
          AND rw.meeting_url IS NOT NULL AND rw.meeting_url != ''
          AND (rw.recording_url IS NULL OR rw.recording_url = '')
      )`;
    } else {
      // upcoming: no recording URL and no meeting URL (or no extension row at all)
      webinarStatusCond = sql`NOT EXISTS (
        SELECT 1 FROM resource_webinars rw
        WHERE rw.resource_id = ${resourcesTable.id}
          AND (
            (rw.recording_url IS NOT NULL AND rw.recording_url != '')
            OR (rw.meeting_url IS NOT NULL AND rw.meeting_url != '')
          )
      )`;
    }
    conditions.push(webinarStatusCond);
  }

  if (params.search) {
    const q = `%${params.search}%`;
    conditions.push(or(
      ilike(resourcesTable.title, q),
      ilike(resourcesTable.shortDescription, q),
    )!);
  }

  // Category filter via JOIN (only include if filtered)
  const hasCategory = Boolean(params.category);
  const hasTag      = Boolean(params.tag);

  // Build WHERE — tag filter uses EXISTS subquery via raw SQL
  let whereClause = conditions.length === 0 ? undefined
    : conditions.length === 1 ? conditions[0]
    : and(...conditions);

  // Category filter: join resourceCategoriesTable for slug lookup
  // We do this by adding a condition on category_id via subquery
  let categoryJoinCondition = undefined;
  if (hasCategory) {
    // Resolve category slug → id
    const [cat] = await db
      .select({ id: resourceCategoriesTable.id })
      .from(resourceCategoriesTable)
      .where(eq(resourceCategoriesTable.slug, params.category!));
    if (cat) {
      const catCond = eq(resourcesTable.categoryId, cat.id);
      whereClause = whereClause ? and(whereClause, catCond) : catCond;
    } else {
      // No matching category → return empty
      return { resources: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  // Tag filter via EXISTS subquery
  if (hasTag) {
    const tagExistsSql = sql`EXISTS (
      SELECT 1 FROM resource_tag_relationships rtr
      INNER JOIN resource_tags rt ON rtr.tag_id = rt.id
      WHERE rtr.resource_id = ${resourcesTable.id}
        AND rt.slug = ${params.tag!}
    )`;
    whereClause = whereClause ? and(whereClause, tagExistsSql) : tagExistsSql;
  }

  // 1. COUNT
  let countQuery = db
    .select({ total: count() })
    .from(resourcesTable)
    .$dynamic();
  if (whereClause) countQuery = countQuery.where(whereClause);
  const [{ total }] = await countQuery;

  // 2. Data page with category name
  let dataQuery = db
    .select({
      resource:     resourcesTable,
      categoryName: resourceCategoriesTable.name,
      categorySlug: resourceCategoriesTable.slug,
    })
    .from(resourcesTable)
    .leftJoin(resourceCategoriesTable, eq(resourcesTable.categoryId, resourceCategoriesTable.id))
    .$dynamic();
  if (whereClause) dataQuery = dataQuery.where(whereClause);
  const rows = await dataQuery
    .orderBy(desc(resourcesTable.publishedAt), desc(resourcesTable.createdAt))
    .limit(limit)
    .offset(offset);

  // Fetch tags for each resource
  const resourceIds = rows.map(r => r.resource.id);
  let tagMap: Record<number, { id: number; name: string; slug: string }[]> = {};
  if (resourceIds.length > 0) {
    const tagRows = await db
      .select({
        resourceId: resourceTagRelationshipsTable.resourceId,
        tagId:      resourceTagsTable.id,
        tagName:    resourceTagsTable.name,
        tagSlug:    resourceTagsTable.slug,
      })
      .from(resourceTagRelationshipsTable)
      .innerJoin(resourceTagsTable, eq(resourceTagRelationshipsTable.tagId, resourceTagsTable.id))
      .where(inArray(resourceTagRelationshipsTable.resourceId, resourceIds));

    tagMap = tagRows.reduce((acc, r) => {
      if (!acc[r.resourceId]) acc[r.resourceId] = [];
      acc[r.resourceId].push({ id: r.tagId, name: r.tagName, slug: r.tagSlug });
      return acc;
    }, {} as typeof tagMap);
  }

  // Fetch event start/end dates for Event-type resources so the listing page
  // can split upcoming vs past without a second round-trip per item.
  let eventDateMap: Record<number, { eventStart: string | null; eventEnd: string | null }> = {};
  const eventIds = rows
    .filter(r => r.resource.contentType === "Event")
    .map(r => r.resource.id);
  if (eventIds.length > 0) {
    const evRows = await db
      .select({
        resourceId:    resourceEventsTable.resourceId,
        startDatetime: resourceEventsTable.startDatetime,
        endDatetime:   resourceEventsTable.endDatetime,
      })
      .from(resourceEventsTable)
      .where(inArray(resourceEventsTable.resourceId, eventIds));
    for (const ev of evRows) {
      eventDateMap[ev.resourceId] = {
        eventStart: ev.startDatetime ? (ev.startDatetime instanceof Date ? ev.startDatetime.toISOString() : String(ev.startDatetime)) : null,
        eventEnd:   ev.endDatetime   ? (ev.endDatetime   instanceof Date ? ev.endDatetime.toISOString()   : String(ev.endDatetime))   : null,
      };
    }
  }

  // Batch-fetch type-specific extension data for typed listings so the listing
  // page can show status badges, download CTAs, episode numbers, etc. without
  // a per-card round-trip. JSON text fields are parsed before returning.
  function parseJsonFields(row: Record<string, unknown>): Record<string, unknown> {
    const out = { ...row };
    for (const key of ['speakers', 'guests', 'externalUrls']) {
      if (typeof out[key] === 'string') {
        try { out[key] = JSON.parse(out[key] as string); } catch { out[key] = null; }
      }
    }
    return out;
  }

  let extensionMap: Record<number, Record<string, unknown>> = {};
  const listingIds = rows.map(r => r.resource.id);

  if (dbType === "Webinar" && listingIds.length > 0) {
    const webRows = await db.select().from(resourceWebinarsTable)
      .where(inArray(resourceWebinarsTable.resourceId, listingIds));
    for (const w of webRows) {
      extensionMap[w.resourceId] = parseJsonFields(w as unknown as Record<string, unknown>);
    }
  } else if (dbType === "Podcast" && listingIds.length > 0) {
    const podRows = await db.select().from(resourcePodcastsTable)
      .where(inArray(resourcePodcastsTable.resourceId, listingIds));
    for (const p of podRows) {
      extensionMap[p.resourceId] = parseJsonFields(p as unknown as Record<string, unknown>);
    }
  } else if (dbType === "Research Report" && listingIds.length > 0) {
    const repRows = await db.select().from(resourceReportsTable)
      .where(inArray(resourceReportsTable.resourceId, listingIds));
    for (const r of repRows) {
      extensionMap[r.resourceId] = r as unknown as Record<string, unknown>;
    }
  }

  const resources = rows.map(r => ({
    ...r.resource,
    typeSlug:     DB_TYPE_TO_URL[r.resource.contentType],
    categoryName: r.categoryName ?? null,
    categorySlug: r.categorySlug ?? null,
    tags:         tagMap[r.resource.id] ?? [],
    eventStart:   eventDateMap[r.resource.id]?.eventStart ?? null,
    eventEnd:     eventDateMap[r.resource.id]?.eventEnd   ?? null,
    extension:    extensionMap[r.resource.id] ?? null,
  }));

  return { resources, total, page, limit, totalPages: Math.ceil(total / limit) };
}

/* ════════════════════════════════════════════════════════════════════════
   PUBLIC ROUTES
   ════════════════════════════════════════════════════════════════════════ */

/* GET /api/sitemap.xml ───────────────────────────────────────────────── */
// Dynamic XML sitemap covering all published resources + key static pages.
// Accessible at /api/sitemap.xml (referenced in robots.txt).
// NOTE: registered before /resources/* so "sitemap.xml" is never treated as
// a :type or :slug param value.
const SITEMAP_DB_TO_PUBLIC: Record<string, string> = {
  "Blog":            "blog",
  "Event":           "events",
  "Podcast":         "podcasts",
  "Webinar":         "webinars",
  "Research Report": "research",
  "Customer Story":  "customer-stories",
};
router.get("/sitemap.xml", async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select({
        contentType: resourcesTable.contentType,
        slug:        resourcesTable.slug,
        updatedAt:   resourcesTable.updatedAt,
        publishedAt: resourcesTable.publishedAt,
      })
      .from(resourcesTable)
      .where(eq(resourcesTable.status, "Published"))
      .orderBy(desc(resourcesTable.publishedAt));

    // Reconstruct the site origin from the forwarded headers (Replit proxy injects these)
    const protocol = req.get('x-forwarded-proto') ?? 'https';
    const host     = req.get('x-forwarded-host') ?? req.get('host') ?? 'esoko.com';
    const origin   = `${protocol}://${host}`;

    const staticPages = [
      { path: '/',                     priority: '1.0', freq: 'daily'   },
      { path: '/resources',            priority: '0.9', freq: 'daily'   },
      ...((['blog','events','podcasts','webinars','research','customer-stories']) as const).map(t => ({
        path: `/resources/${t}`, priority: '0.8', freq: 'weekly',
      })),
    ];

    function toDate(d: unknown): string {
      if (!d) return new Date().toISOString().slice(0, 10);
      if (d instanceof Date) return d.toISOString().slice(0, 10);
      return String(d).slice(0, 10);
    }

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const staticXml = staticPages.map(p => [
      '  <url>',
      `    <loc>${esc(origin + p.path)}</loc>`,
      `    <changefreq>${p.freq}</changefreq>`,
      `    <priority>${p.priority}</priority>`,
      '  </url>',
    ].join('\n'));

    const resourceXml = rows.flatMap(r => {
      const pubSlug = SITEMAP_DB_TO_PUBLIC[r.contentType];
      if (!pubSlug) return [];
      const loc  = esc(`${origin}/resources/${pubSlug}/${r.slug}`);
      const last = toDate(r.updatedAt ?? r.publishedAt);
      return [[
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${last}</lastmod>`,
        `    <changefreq>monthly</changefreq>`,
        `    <priority>0.7</priority>`,
        '  </url>',
      ].join('\n')];
    });

    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...staticXml,
      ...resourceXml,
      '</urlset>',
    ].join('\n');

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    logger.error({ err }, "GET /api/sitemap.xml failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/resources ─────────────────────────────────────────────────── */
router.get("/resources", async (req: Request, res: Response) => {
  try {
    const page     = parseInt(String(req.query.page  ?? "1"));
    const limit    = parseInt(String(req.query.limit ?? "12"));
    const type     = req.query.type     ? String(req.query.type)     : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const tag      = req.query.tag      ? String(req.query.tag)      : undefined;
    const search   = req.query.search   ? String(req.query.search)   : undefined;

    // Validate type if provided
    if (type && !URL_TYPE_TO_DB[type]) {
      res.status(400).json({ error: `Unknown resource type. Valid types: ${Object.keys(URL_TYPE_TO_DB).join(", ")}` });
      return;
    }

    const featured = req.query.featured === 'true' ? true : undefined;
    const result = await listResources({ contentType: type, category, tag, search, page, limit, publishedOnly: true, featured });
    res.json(result);
  } catch (err) {
    logger.error({ err }, "GET /resources failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/resources/counts ─────────────────────────────────────────── */
// NOTE: must be registered before /resources/:type or Express will treat
// "counts" as a :type param value.
//
// Returns published resource counts keyed by PUBLIC URL slug
// (e.g. "events", "podcasts", "research") so callers can look them up
// directly against the same slugs used in page routes.
const DB_TYPE_TO_PUBLIC_URL: Record<string, string> = {
  "Blog":             "blog",
  "Event":            "events",
  "Podcast":          "podcasts",
  "Webinar":          "webinars",
  "Research Report":  "research",
  "Customer Story":   "customer-stories",
};

router.get("/resources/counts", async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select({
        contentType: resourcesTable.contentType,
        total:       count(),
      })
      .from(resourcesTable)
      .where(eq(resourcesTable.status, "Published"))
      .groupBy(resourcesTable.contentType);

    const counts: Record<string, number> = {};
    for (const row of rows) {
      const publicSlug = DB_TYPE_TO_PUBLIC_URL[row.contentType];
      if (publicSlug) counts[publicSlug] = Number(row.total);
    }
    res.json({ counts });
  } catch (err) {
    logger.error({ err }, "GET /resources/counts failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/resources/podcast-platforms ──────────────────────────── */
// Returns aggregated platform links across ALL published podcast episodes.
// Registered before /:type so "podcast-platforms" isn't consumed as a :type param.
router.get("/resources/podcast-platforms", async (_req: Request, res: Response) => {
  try {
    const published = await db
      .select({ id: resourcesTable.id })
      .from(resourcesTable)
      .where(and(
        eq(resourcesTable.contentType, "Podcast"),
        eq(resourcesTable.status, "Published"),
      ));
    const ids = published.map(r => r.id);
    if (ids.length === 0) { res.json({ platforms: {} }); return; }

    const podRows = await db
      .select({ externalUrls: resourcePodcastsTable.externalUrls })
      .from(resourcePodcastsTable)
      .where(inArray(resourcePodcastsTable.resourceId, ids));

    const platforms: Record<string, string> = {};
    for (const row of podRows) {
      let urls: Record<string, string> = {};
      try {
        if (typeof row.externalUrls === 'string') urls = JSON.parse(row.externalUrls);
        else if (row.externalUrls && typeof row.externalUrls === 'object') urls = row.externalUrls as Record<string, string>;
      } catch { /* skip malformed */ }
      for (const [k, v] of Object.entries(urls)) {
        if (v && !platforms[k]) platforms[k] = v;
      }
    }

    res.json({ platforms });
  } catch (err) {
    logger.error({ err }, "GET /resources/podcast-platforms failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/resources/:type ──────────────────────────────────────────── */
router.get("/resources/:type", async (req: Request, res: Response) => {
  try {
    const type = String(req.params.type);
    if (!URL_TYPE_TO_DB[type]) {
      res.status(404).json({ error: `Unknown resource type: ${type}` });
      return;
    }
    const page     = parseInt(String(req.query.page  ?? "1"));
    const limit    = parseInt(String(req.query.limit ?? "12"));
    const category = req.query.category ? String(req.query.category) : undefined;
    const tag      = req.query.tag      ? String(req.query.tag)      : undefined;
    const search   = req.query.search   ? String(req.query.search)   : undefined;

    const VALID_WEBINAR_STATUSES = ['upcoming', 'live', 'on-demand'] as const;
    const rawWS = req.query.webinarStatus ? String(req.query.webinarStatus) : undefined;
    const webinarStatus = rawWS && (VALID_WEBINAR_STATUSES as readonly string[]).includes(rawWS)
      ? rawWS as 'upcoming' | 'live' | 'on-demand'
      : undefined;

    const result = await listResources({ contentType: type, category, tag, search, page, limit, publishedOnly: true, webinarStatus });
    res.json(result);
  } catch (err) {
    logger.error({ err }, "GET /resources/:type failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/resources/:type/:slug/adjacent ───────────────────────────── */
// Returns the prev and next published resource of the same type, ordered by
// publishedAt date.  prev = the one published immediately before; next = after.
// Registered BEFORE /:type/:slug so Express doesn't consume the literal segment
// "adjacent" as a slug value. (Three-segment paths never match /:type/:slug anyway,
// but explicit ordering avoids ambiguity.)
router.get("/resources/:type/:slug/adjacent", async (req: Request, res: Response) => {
  try {
    const type   = String(req.params.type);
    const slug   = String(req.params.slug);
    const dbType = URL_TYPE_TO_DB[type];
    if (!dbType) {
      res.status(404).json({ error: `Unknown resource type: ${type}` });
      return;
    }

    // Look up the current resource
    const [current] = await db
      .select({ id: resourcesTable.id, publishedAt: resourcesTable.publishedAt })
      .from(resourcesTable)
      .where(and(
        eq(resourcesTable.slug, slug),
        eq(resourcesTable.contentType, dbType),
        eq(resourcesTable.status, "Published"),
      ));

    if (!current) {
      res.json({ prev: null, next: null });
      return;
    }

    const cols = {
      id:              resourcesTable.id,
      title:           resourcesTable.title,
      slug:            resourcesTable.slug,
      featuredImageUrl: resourcesTable.featuredImageUrl,
      publishedAt:     resourcesTable.publishedAt,
    };

    const baseCondition = and(
      eq(resourcesTable.contentType, dbType),
      eq(resourcesTable.status, "Published"),
      sql`${resourcesTable.id} != ${current.id}`,
    )!;

    const publishedAt = current.publishedAt;

    const [prevRows, nextRows] = await Promise.all([
      // previous = most recent published BEFORE current
      db.select(cols).from(resourcesTable)
        .where(publishedAt
          ? and(baseCondition, sql`${resourcesTable.publishedAt} < ${publishedAt}`)!
          : and(baseCondition, sql`${resourcesTable.publishedAt} IS NULL`)!
        )
        .orderBy(desc(resourcesTable.publishedAt))
        .limit(1),

      // next = earliest published AFTER current
      db.select(cols).from(resourcesTable)
        .where(publishedAt
          ? and(baseCondition, sql`${resourcesTable.publishedAt} > ${publishedAt}`)!
          : sql`FALSE`
        )
        .orderBy(asc(resourcesTable.publishedAt))
        .limit(1),
    ]);

    res.json({ prev: prevRows[0] ?? null, next: nextRows[0] ?? null });
  } catch (err) {
    logger.error({ err }, "GET /resources/:type/:slug/adjacent failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/resources/:type/:slug ────────────────────────────────────── */
router.get("/resources/:type/:slug", async (req: Request, res: Response) => {
  try {
    const type = String(req.params.type);
    const slug = String(req.params.slug);
    const dbType = URL_TYPE_TO_DB[type];
    if (!dbType) {
      res.status(404).json({ error: `Unknown resource type: ${type}` });
      return;
    }

    const [row] = await db
      .select({
        resource:     resourcesTable,
        categoryName: resourceCategoriesTable.name,
        categorySlug: resourceCategoriesTable.slug,
      })
      .from(resourcesTable)
      .leftJoin(resourceCategoriesTable, eq(resourcesTable.categoryId, resourceCategoriesTable.id))
      .where(and(
        eq(resourcesTable.slug, slug),
        eq(resourcesTable.contentType, dbType),
        eq(resourcesTable.status, "Published"),
      ));

    if (!row) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    const [extension, tags] = await Promise.all([
      getExtension(row.resource.id, dbType),
      getTagsForResource(row.resource.id),
    ]);

    res.json({
      resource: {
        ...row.resource,
        typeSlug:     DB_TYPE_TO_URL[row.resource.contentType],
        categoryName: row.categoryName ?? null,
        categorySlug: row.categorySlug ?? null,
        tags,
        details: extension,
      },
    });
  } catch (err) {
    logger.error({ err }, "GET /resources/:type/:slug failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/resource-categories ──────────────────────────────────────── */
router.get("/resource-categories", async (_req: Request, res: Response) => {
  try {
    const categories = await db.select().from(resourceCategoriesTable).orderBy(asc(resourceCategoriesTable.name));
    res.json({ categories });
  } catch (err) {
    logger.error({ err }, "GET /resource-categories failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/resource-tags ────────────────────────────────────────────── */
router.get("/resource-tags", async (_req: Request, res: Response) => {
  try {
    const tags = await db.select().from(resourceTagsTable).orderBy(asc(resourceTagsTable.name));
    res.json({ tags });
  } catch (err) {
    logger.error({ err }, "GET /resource-tags failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ════════════════════════════════════════════════════════════════════════
   ADMIN RESOURCE ROUTES
   ════════════════════════════════════════════════════════════════════════ */

const requireEditor = requireRole("CONTENT_EDITOR", "SUPER_ADMIN");
const requireAnyStaff = requireRole("CONTENT_EDITOR", "CONTENT_AUTHOR", "SUPER_ADMIN");

/* GET /api/admin/resources ──────────────────────────────────────────── */
router.get("/admin/resources", requireAnyStaff, async (req: Request, res: Response) => {
  try {
    const user   = req.user!;
    const page   = parseInt(String(req.query.page  ?? "1"));
    const limit  = parseInt(String(req.query.limit ?? "20"));
    const type   = req.query.type   ? String(req.query.type)   : undefined;
    const status = req.query.status ? String(req.query.status) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    // CONTENT_AUTHOR can only see their own resources
    const params: ListParams = { page, limit, search };
    if (type && URL_TYPE_TO_DB[type]) params.contentType = type;
    if (status && STATUSES.includes(status as (typeof STATUSES)[number])) params.status = status;

    if (user.role === "CONTENT_AUTHOR") {
      // We need to filter by created_by — add that to the query manually
      const offset = (Math.max(1, page) - 1) * Math.min(100, Math.max(1, limit));
      const userId = user.id;
      const conditions = [sql`${resourcesTable.createdBy} = ${userId}`];
      if (params.contentType && URL_TYPE_TO_DB[params.contentType]) conditions.push(eq(resourcesTable.contentType, URL_TYPE_TO_DB[params.contentType]!));
      if (params.status) conditions.push(eq(resourcesTable.status, params.status as (typeof STATUSES)[number]));
      if (search) conditions.push(or(ilike(resourcesTable.title, `%${search}%`), ilike(resourcesTable.shortDescription, `%${search}%`))!);

      const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
      const [{ total }] = await db.select({ total: count() }).from(resourcesTable).where(whereClause);
      const rows = await db
        .select({ resource: resourcesTable, categoryName: resourceCategoriesTable.name })
        .from(resourcesTable)
        .leftJoin(resourceCategoriesTable, eq(resourcesTable.categoryId, resourceCategoriesTable.id))
        .where(whereClause)
        .orderBy(desc(resourcesTable.updatedAt))
        .limit(Math.min(100, Math.max(1, limit)))
        .offset(offset);

      res.json({
        resources:  rows.map(r => ({ ...r.resource, typeSlug: DB_TYPE_TO_URL[r.resource.contentType], categoryName: r.categoryName ?? null })),
        total,
        page:       Math.max(1, page),
        limit:      Math.min(100, Math.max(1, limit)),
        totalPages: Math.ceil(total / Math.min(100, Math.max(1, limit))),
      });
      return;
    }

    const result = await listResources(params);
    res.json(result);
  } catch (err) {
    logger.error({ err }, "GET /admin/resources failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/admin/resources ─────────────────────────────────────────── */
router.post("/admin/resources", requireAnyStaff, async (req: Request, res: Response) => {
  try {
    const user   = req.user!;
    const parsed = createResourceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      return;
    }
    const { details, tagIds, scheduledFor, status: reqStatus, ...fields } = parsed.data;

    // CONTENT_AUTHOR can only create in Draft status — no exceptions
    let status: (typeof STATUSES)[number] = reqStatus ?? "Draft";
    if (user.role === "CONTENT_AUTHOR") {
      status = "Draft";
    }

    // Validate tag IDs before touching the DB
    if (tagIds && tagIds.length > 0) {
      const missing = await validateTagIds(tagIds);
      if (missing) {
        res.status(400).json({ error: "Invalid tag IDs", invalidIds: missing });
        return;
      }
    }

    const publishedAt = status === "Published" ? new Date() : undefined;
    const schedFor    = scheduledFor ? new Date(scheduledFor) : undefined;

    // Atomic transaction: resource + extension + tags
    let inserted: typeof resourcesTable.$inferSelect;
    try {
      inserted = await db.transaction(async (tx) => {
        const [row] = await tx
          .insert(resourcesTable)
          .values({
            ...fields,
            status,
            publishedAt,
            scheduledFor: schedFor,
            authorId:     user.id,
            createdBy:    user.id,
            updatedBy:    user.id,
          })
          .returning();
        if (details && typeof details === "object") {
          await upsertExtension(tx, row.id, row.contentType, details as Record<string, unknown>);
        }
        if (tagIds && tagIds.length > 0) {
          await syncTags(tx, row.id, tagIds);
        }
        return row;
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("resources_slug_unique")) {
        res.status(409).json({ error: "A resource with this slug already exists." });
        return;
      }
      throw err;
    }

    audit({ action: "resource_created", entityId: inserted.id, entityType: "resource", userId: user.id, metadata: { title: inserted.title, contentType: inserted.contentType } });
    res.status(201).json({ resource: { ...inserted, typeSlug: DB_TYPE_TO_URL[inserted.contentType] } });
  } catch (err) {
    logger.error({ err }, "POST /admin/resources failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* GET /api/admin/resources/:id ──────────────────────────────────────── */
router.get("/admin/resources/:id", requireAnyStaff, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const user = req.user!;
    if (isNaN(id)) { res.status(400).json({ error: "Invalid resource ID" }); return; }

    const [row] = await db
      .select({ resource: resourcesTable, categoryName: resourceCategoriesTable.name, categorySlug: resourceCategoriesTable.slug })
      .from(resourcesTable)
      .leftJoin(resourceCategoriesTable, eq(resourcesTable.categoryId, resourceCategoriesTable.id))
      .where(eq(resourcesTable.id, id));

    if (!row) { res.status(404).json({ error: "Resource not found" }); return; }

    // CONTENT_AUTHOR can only view their own resources
    if (user.role === "CONTENT_AUTHOR" && row.resource.createdBy !== user.id) {
      res.status(403).json({ error: "Forbidden" }); return;
    }

    const [extension, tags] = await Promise.all([
      getExtension(id, row.resource.contentType),
      getTagsForResource(id),
    ]);

    res.json({
      resource: {
        ...row.resource,
        typeSlug:     DB_TYPE_TO_URL[row.resource.contentType],
        categoryName: row.categoryName ?? null,
        categorySlug: row.categorySlug ?? null,
        tags,
        details: extension,
      },
    });
  } catch (err) {
    logger.error({ err }, "GET /admin/resources/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* PUT /api/admin/resources/:id ──────────────────────────────────────── */
router.put("/admin/resources/:id", requireAnyStaff, async (req: Request, res: Response) => {
  try {
    const id   = parseInt(String(req.params.id));
    const user = req.user!;
    if (isNaN(id)) { res.status(400).json({ error: "Invalid resource ID" }); return; }

    const [existing] = await db.select().from(resourcesTable).where(eq(resourcesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Resource not found" }); return; }

    // CONTENT_AUTHOR: can only edit their own resources, and ONLY when still in Draft
    if (user.role === "CONTENT_AUTHOR") {
      if (existing.createdBy !== user.id) {
        res.status(403).json({ error: "You can only edit your own resources" }); return;
      }
      if (existing.status !== "Draft") {
        res.status(403).json({ error: "You can only edit your own Draft resources — once submitted for review they are locked" }); return;
      }
    }

    const parsed = updateResourceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
      return;
    }
    const { details, tagIds, scheduledFor, status: reqStatus, ...fields } = parsed.data;

    // CONTENT_AUTHOR may only transition to "In Review" (submit for review) or stay in "Draft"
    let statusUpdate = reqStatus;
    if (user.role === "CONTENT_AUTHOR" && reqStatus && !["Draft","In Review"].includes(reqStatus)) {
      res.status(403).json({ error: "You can only set status to Draft or In Review" }); return;
    }

    // Validate tag IDs before touching the DB
    if (tagIds !== undefined && tagIds.length > 0) {
      const missing = await validateTagIds(tagIds);
      if (missing) {
        res.status(400).json({ error: "Invalid tag IDs", invalidIds: missing });
        return;
      }
    }

    // Auto-set publishedAt when first publishing
    let publishedAt: Date | undefined = undefined;
    if (statusUpdate === "Published" && existing.status !== "Published") {
      publishedAt = new Date();
    }

    const schedFor = scheduledFor !== undefined
      ? (scheduledFor ? new Date(scheduledFor) : null)
      : undefined;

    // Atomic transaction: resource + extension + tags
    let updated: typeof resourcesTable.$inferSelect;
    try {
      updated = await db.transaction(async (tx) => {
        const [row] = await tx
          .update(resourcesTable)
          .set({
            ...fields,
            ...(statusUpdate ? { status: statusUpdate } : {}),
            ...(publishedAt  ? { publishedAt }           : {}),
            ...(schedFor !== undefined ? { scheduledFor: schedFor } : {}),
            updatedBy: user.id,
            updatedAt: new Date(),
          })
          .where(eq(resourcesTable.id, id))
          .returning();
        if (details && typeof details === "object") {
          await upsertExtension(tx, id, existing.contentType, details as Record<string, unknown>);
        }
        if (tagIds !== undefined) {
          await syncTags(tx, id, tagIds);
        }
        return row;
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("resources_slug_unique")) {
        res.status(409).json({ error: "A resource with this slug already exists." });
        return;
      }
      throw err;
    }

    audit({ action: "resource_updated", entityId: id, entityType: "resource", userId: user.id, metadata: { title: updated.title } });
    res.json({ resource: { ...updated, typeSlug: DB_TYPE_TO_URL[updated.contentType] } });
  } catch (err) {
    logger.error({ err }, "PUT /admin/resources/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* DELETE /api/admin/resources/:id (soft-delete → Archived) ─────────── */
router.delete("/admin/resources/:id", requireEditor, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid resource ID" }); return; }

    const [existing] = await db.select({ id: resourcesTable.id, title: resourcesTable.title }).from(resourcesTable).where(eq(resourcesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Resource not found" }); return; }

    await db.update(resourcesTable).set({ status: "Archived", updatedAt: new Date() }).where(eq(resourcesTable.id, id));
    audit({ action: "resource_archived", entityId: id, entityType: "resource", userId: req.user!.id, metadata: { title: existing.title } });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "DELETE /admin/resources/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/admin/resources/:id/publish ────────────────────────────── */
router.post("/admin/resources/:id/publish", requireEditor, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid resource ID" }); return; }

    const [existing] = await db.select().from(resourcesTable).where(eq(resourcesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Resource not found" }); return; }
    if (existing.status === "Archived") { res.status(400).json({ error: "Cannot publish an archived resource" }); return; }

    const now = new Date();
    const [updated] = await db
      .update(resourcesTable)
      .set({
        status:      "Published",
        publishedAt: existing.publishedAt ?? now,
        scheduledFor: null,
        updatedBy:   req.user!.id,
        updatedAt:   now,
      })
      .where(eq(resourcesTable.id, id))
      .returning();

    audit({ action: "resource_published", entityId: id, entityType: "resource", userId: req.user!.id, metadata: { title: updated.title } });
    res.json({ resource: { ...updated, typeSlug: DB_TYPE_TO_URL[updated.contentType] } });
  } catch (err) {
    logger.error({ err }, "POST /admin/resources/:id/publish failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/admin/resources/:id/unpublish ──────────────────────────── */
router.post("/admin/resources/:id/unpublish", requireEditor, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid resource ID" }); return; }

    const [existing] = await db.select().from(resourcesTable).where(eq(resourcesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Resource not found" }); return; }

    const [updated] = await db
      .update(resourcesTable)
      .set({ status: "Unpublished", updatedBy: req.user!.id, updatedAt: new Date() })
      .where(eq(resourcesTable.id, id))
      .returning();

    audit({ action: "resource_unpublished", entityId: id, entityType: "resource", userId: req.user!.id, metadata: { title: updated.title } });
    res.json({ resource: { ...updated, typeSlug: DB_TYPE_TO_URL[updated.contentType] } });
  } catch (err) {
    logger.error({ err }, "POST /admin/resources/:id/unpublish failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* POST /api/admin/resources/:id/schedule ───────────────────────────── */
router.post("/admin/resources/:id/schedule", requireEditor, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid resource ID" }); return; }

    const { scheduledFor } = z.object({ scheduledFor: z.string().datetime() }).parse(req.body);
    const schedDate = new Date(scheduledFor);
    if (schedDate <= new Date()) {
      res.status(400).json({ error: "scheduled_for must be in the future" }); return;
    }

    const [existing] = await db.select().from(resourcesTable).where(eq(resourcesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Resource not found" }); return; }
    if (existing.status === "Archived") { res.status(400).json({ error: "Cannot schedule an archived resource" }); return; }

    const [updated] = await db
      .update(resourcesTable)
      .set({ status: "Scheduled", scheduledFor: schedDate, updatedBy: req.user!.id, updatedAt: new Date() })
      .where(eq(resourcesTable.id, id))
      .returning();

    audit({ action: "resource_scheduled", entityId: id, entityType: "resource", userId: req.user!.id, metadata: { title: updated.title, scheduledFor } });
    res.json({ resource: { ...updated, typeSlug: DB_TYPE_TO_URL[updated.contentType] } });
  } catch (err) {
    logger.error({ err }, "POST /admin/resources/:id/schedule failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ════════════════════════════════════════════════════════════════════════
   ADMIN CATEGORY ROUTES
   ════════════════════════════════════════════════════════════════════════ */

router.get("/admin/resource-categories", requireAnyStaff, async (_req: Request, res: Response) => {
  try {
    const categories = await db.select().from(resourceCategoriesTable).orderBy(asc(resourceCategoriesTable.name));
    res.json({ categories });
  } catch (err) {
    logger.error({ err }, "GET /admin/resource-categories failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/resource-categories", requireEditor, async (req: Request, res: Response) => {
  try {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() }); return; }
    const [inserted] = await db.insert(resourceCategoriesTable).values(parsed.data).returning();
    res.status(201).json({ category: inserted });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message.includes("resource_categories_name_unique") || err.message.includes("resource_categories_slug_unique"))) {
      res.status(409).json({ error: "A category with this name or slug already exists." }); return;
    }
    logger.error({ err }, "POST /admin/resource-categories failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/resource-categories/:id", requireEditor, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const parsed = categorySchema.partial().safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() }); return; }
    const [updated] = await db.update(resourceCategoriesTable).set(parsed.data).where(eq(resourceCategoriesTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Category not found" }); return; }
    res.json({ category: updated });
  } catch (err) {
    logger.error({ err }, "PUT /admin/resource-categories/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/resource-categories/:id", requireEditor, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    // Detach resources from this category first (set null via FK cascade handles it)
    const [deleted] = await db.delete(resourceCategoriesTable).where(eq(resourceCategoriesTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Category not found" }); return; }
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "DELETE /admin/resource-categories/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ════════════════════════════════════════════════════════════════════════
   ADMIN TAG ROUTES
   ════════════════════════════════════════════════════════════════════════ */

router.get("/admin/resource-tags", requireAnyStaff, async (_req: Request, res: Response) => {
  try {
    const tags = await db.select().from(resourceTagsTable).orderBy(asc(resourceTagsTable.name));
    res.json({ tags });
  } catch (err) {
    logger.error({ err }, "GET /admin/resource-tags failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/resource-tags", requireEditor, async (req: Request, res: Response) => {
  try {
    const parsed = tagSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() }); return; }
    const [inserted] = await db.insert(resourceTagsTable).values(parsed.data).returning();
    res.status(201).json({ tag: inserted });
  } catch (err: unknown) {
    if (err instanceof Error && (err.message.includes("resource_tags_name_unique") || err.message.includes("resource_tags_slug_unique"))) {
      res.status(409).json({ error: "A tag with this name or slug already exists." }); return;
    }
    logger.error({ err }, "POST /admin/resource-tags failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/resource-tags/:id", requireEditor, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const parsed = tagSchema.partial().safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() }); return; }
    const [updated] = await db.update(resourceTagsTable).set(parsed.data).where(eq(resourceTagsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Tag not found" }); return; }
    res.json({ tag: updated });
  } catch (err) {
    logger.error({ err }, "PUT /admin/resource-tags/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/resource-tags/:id", requireEditor, async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
    const [deleted] = await db.delete(resourceTagsTable).where(eq(resourceTagsTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Tag not found" }); return; }
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "DELETE /admin/resource-tags/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
