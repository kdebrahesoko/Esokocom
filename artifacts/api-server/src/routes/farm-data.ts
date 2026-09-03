import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  advisoriesTable,
  marketPricesTable,
  smsAlertsTable,
} from "@workspace/db";
import {
  CreateAdvisoryBody,
  UpdateAdvisoryBody,
  UpdateAdvisoryParams,
  DeleteAdvisoryParams,
  CreateMarketPriceBody,
  UpdateMarketPriceBody,
  UpdateMarketPriceParams,
  DeleteMarketPriceParams,
  CreateSmsAlertBody,
  UpdateSmsAlertBody,
  UpdateSmsAlertParams,
  DeleteSmsAlertParams,
  ListAdvisoriesResponseItem,
  ListMarketPricesResponseItem,
  ListSmsAlertsResponseItem,
} from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";
import { requireRole, audit } from "../lib/auth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_ADVISORIES = [
  {
    category: "weather",
    title: "Heavy Rains Expected — Northern Region",
    body: "Heavy rains are expected across the Northern Region next week. Prepare drainage channels and consider delaying fertilizer application to avoid runoff and nutrient loss.",
    date: "2026-07-22",
  },
  {
    category: "pest",
    title: "Fall Armyworm Alert — Brong-Ahafo",
    body: "Fall Armyworm has been detected in Brong-Ahafo. Scout your maize fields early morning. Apply recommended pesticides (Emamectin Benzoate) immediately if infestation is confirmed.",
    date: "2026-07-21",
  },
  {
    category: "climate",
    title: "Optimal Planting Window — Volta Region",
    body: "Soil moisture levels are ideal in the Volta Region this week. Conditions are optimal for planting maize. Aim for 75cm row spacing with 25cm between plants.",
    date: "2026-07-20",
  },
  {
    category: "market",
    title: "Tomato Prices Rising — Sell Now",
    body: "Tomato prices in Kumasi and Accra markets have risen 20% this week due to supply shortages. If you have harvest-ready tomatoes, this is a good time to sell.",
    date: "2026-07-19",
  },
  {
    category: "nutrition",
    title: "Diversify with Orange-Fleshed Sweet Potato",
    body: "Add orange-fleshed sweet potato to your crop rotation. It matures in 3-4 months, is drought-tolerant, and commands premium prices in urban markets.",
    date: "2026-07-18",
  },
  {
    category: "climate",
    title: "Dry Spell Forecast — Southern Belt",
    body: "A 2-week dry spell is forecast for the Southern Belt. Irrigate crops now and apply mulch to conserve soil moisture. Prioritize vegetable crops over maize.",
    date: "2026-07-17",
  },
];

const SEED_PRICES = [
  { commodity: "Maize", price: 250, unit: "50kg bag", currency: "GH₵", trend: "up", changePercent: 8, market: "Kumasi Central", updatedAt: "2026-07-22" },
  { commodity: "Tomatoes", price: 120, unit: "crate", currency: "GH₵", trend: "up", changePercent: 20, market: "Accra Makola", updatedAt: "2026-07-22" },
  { commodity: "Cassava", price: 80, unit: "50kg bag", currency: "GH₵", trend: "stable", changePercent: 0, market: "Kumasi Central", updatedAt: "2026-07-22" },
  { commodity: "Local Rice", price: 320, unit: "50kg bag", currency: "GH₵", trend: "down", changePercent: -5, market: "Accra Makola", updatedAt: "2026-07-22" },
  { commodity: "Cocoa", price: 1200, unit: "64kg bag", currency: "GH₵", trend: "up", changePercent: 12, market: "COCOBOD Rate", updatedAt: "2026-07-22" },
  { commodity: "Groundnuts", price: 180, unit: "50kg bag", currency: "GH₵", trend: "stable", changePercent: 0, market: "Tamale Market", updatedAt: "2026-07-22" },
  { commodity: "Yam", price: 45, unit: "tuber (large)", currency: "GH₵", trend: "up", changePercent: 6, market: "Kumasi Central", updatedAt: "2026-07-22" },
  { commodity: "Plantain", price: 2.5, unit: "finger", currency: "GH₵", trend: "stable", changePercent: 1, market: "Accra Makola", updatedAt: "2026-07-22" },
  { commodity: "Soybean", price: 220, unit: "50kg bag", currency: "GH₵", trend: "up", changePercent: 4, market: "Tamale Market", updatedAt: "2026-07-21" },
  { commodity: "Onion", price: 95, unit: "bag", currency: "GH₵", trend: "down", changePercent: -8, market: "Accra Makola", updatedAt: "2026-07-21" },
];

const SEED_ALERTS = [
  { message: "ESOKO: Your weekly advisory digest is ready. 3 new tips for your farm this week.", type: "advisory", alertTimestamp: "2026-07-22T07:00:00Z" },
  { message: "ESOKO MARKET: Tomato prices up 20% in Kumasi & Accra. Sell your harvest now for best returns.", type: "market", alertTimestamp: "2026-07-21T14:30:00Z" },
  { message: "ESOKO WEATHER: Heavy rains expected Wed-Fri in Northern Region. Prepare drainage. Check full advisory.", type: "weather", alertTimestamp: "2026-07-21T09:00:00Z" },
  { message: "ESOKO SURVEY: Please submit your Q3 crop assessment by July 25. Your data helps improve advisories.", type: "survey", alertTimestamp: "2026-07-20T10:00:00Z" },
  { message: "ESOKO ALERT: Fall Armyworm detected near your district. Scout your maize fields today.", type: "pest", alertTimestamp: "2026-07-19T16:00:00Z" },
];

// ─── Seed helper (runs once on startup if tables are empty) ──────────────────
// Uses a singleflight promise so concurrent requests on a cold start all await
// the same seed operation — no duplicate rows regardless of parallelism.

let seedPromise: Promise<void> | null = null;

function seedIfEmpty(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        const [existingAdvisory] = await db
          .select()
          .from(advisoriesTable)
          .limit(1);
        if (!existingAdvisory) {
          await db.insert(advisoriesTable).values(SEED_ADVISORIES);
          await db.insert(marketPricesTable).values(SEED_PRICES);
          await db.insert(smsAlertsTable).values(SEED_ALERTS);
        }
      } catch (err) {
        // Reset so the next request can retry
        seedPromise = null;
        console.error("Seed failed:", err);
      }
    })();
  }
  return seedPromise;
}

// ─── Routes ──────────────────────────────────────────────────────────────────

router.get("/advisories", async (_req, res) => {
  await seedIfEmpty();
  try {
    const rows = await db
      .select()
      .from(advisoriesTable)
      .orderBy(desc(advisoriesTable.date));
    res.json(
      rows.map((r) => ({
        id: r.id,
        category: r.category,
        title: r.title,
        body: r.body,
        date: r.date,
      })),
    );
  } catch (err) {
    logger.error({ err }, "Failed to fetch advisories");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/market-prices", async (_req, res) => {
  await seedIfEmpty();
  try {
    const rows = await db
      .select()
      .from(marketPricesTable)
      .orderBy(desc(marketPricesTable.updatedAt));
    res.json(
      rows.map((r) => ({
        id: r.id,
        commodity: r.commodity,
        price: r.price,
        unit: r.unit,
        currency: r.currency,
        trend: r.trend,
        changePercent: r.changePercent,
        market: r.market,
        updatedAt: r.updatedAt,
      })),
    );
  } catch (err) {
    logger.error({ err }, "Failed to fetch market prices");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sms-alerts", async (_req, res) => {
  await seedIfEmpty();
  try {
    const rows = await db
      .select()
      .from(smsAlertsTable)
      .orderBy(desc(smsAlertsTable.alertTimestamp));
    res.json(
      rows.map((r) => ({
        id: r.id,
        message: r.message,
        type: r.type,
        timestamp: r.alertTimestamp,
      })),
    );
  } catch (err) {
    logger.error({ err }, "Failed to fetch SMS alerts");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ─── Staff write routes ──────────────────────────────────────────────────────
// Publishing operational farm data is an editorial action. Authors can manage
// draft resources, but only content editors and super admins can publish data
// that is immediately distributed to farmers.
const requireFarmDataEditor = requireRole("SUPER_ADMIN", "CONTENT_EDITOR");

function dateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function isoTimestamp(value: Date): string {
  return value.toISOString();
}

function isDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function isIsoDateTime(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|[+-](\d{2}):(\d{2}))$/.exec(value);
  if (!match) return false;

  const [, yearRaw, monthRaw, dayRaw, hourRaw, minuteRaw, secondRaw, , offsetHourRaw, offsetMinuteRaw] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const second = Number(secondRaw);
  const offsetHour = offsetHourRaw === undefined ? 0 : Number(offsetHourRaw);
  const offsetMinute = offsetMinuteRaw === undefined ? 0 : Number(offsetMinuteRaw);

  if (
    year < 1 ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    offsetHour > 23 ||
    offsetMinute > 59
  ) {
    return false;
  }

  const calendar = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  return (
    calendar.getUTCFullYear() === year &&
    calendar.getUTCMonth() === month - 1 &&
    calendar.getUTCDate() === day &&
    calendar.getUTCHours() === hour &&
    calendar.getUTCMinutes() === minute &&
    calendar.getUTCSeconds() === second &&
    !Number.isNaN(new Date(value).getTime())
  );
}

function parseId(schema: typeof UpdateAdvisoryParams | typeof DeleteAdvisoryParams, raw: string | string[]) {
  return schema.safeParse({ id: Array.isArray(raw) ? raw[0] : raw });
}

router.post("/advisories", requireFarmDataEditor, async (req, res): Promise<void> => {
  if (!isDateOnly((req.body as Record<string, unknown>)?.date)) {
    res.status(400).json({ error: "date must be a valid calendar date in YYYY-MM-DD format" });
    return;
  }
  const parsed = CreateAdvisoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [row] = await db.insert(advisoriesTable).values({
      ...parsed.data,
      date: dateOnly(parsed.data.date),
    }).returning();
    const response = ListAdvisoriesResponseItem.parse(row);
    audit({
      userId: req.user?.id,
      action: "advisory_created",
      entityType: "advisory",
      entityId: row.id,
      ip: req.ip,
    });
    res.status(201).json(response);
  } catch (err) {
    req.log.error({ err }, "Failed to create advisory");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/advisories/:id", requireFarmDataEditor, async (req, res): Promise<void> => {
  const rawBody = req.body as Record<string, unknown>;
  if (rawBody.date !== undefined && !isDateOnly(rawBody.date)) {
    res.status(400).json({ error: "date must be a valid calendar date in YYYY-MM-DD format" });
    return;
  }
  const params = parseId(UpdateAdvisoryParams, req.params.id);
  const parsed = UpdateAdvisoryBody.safeParse(req.body);
  if (!params.success || !parsed.success || Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: !params.success ? params.error.message : !parsed.success ? parsed.error.message : "At least one field is required" });
    return;
  }

  try {
    const values: Partial<typeof advisoriesTable.$inferInsert> = {};
    if (parsed.data.category !== undefined) values.category = parsed.data.category;
    if (parsed.data.title !== undefined) values.title = parsed.data.title;
    if (parsed.data.body !== undefined) values.body = parsed.data.body;
    if (parsed.data.date !== undefined) values.date = dateOnly(parsed.data.date);
    const [row] = await db.update(advisoriesTable)
      .set(values)
      .where(eq(advisoriesTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Advisory not found" });
      return;
    }
    audit({
      userId: req.user?.id,
      action: "advisory_updated",
      entityType: "advisory",
      entityId: row.id,
      ip: req.ip,
    });
    res.json(ListAdvisoriesResponseItem.parse(row));
  } catch (err) {
    req.log.error({ err }, "Failed to update advisory");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/advisories/:id", requireFarmDataEditor, async (req, res): Promise<void> => {
  const params = parseId(DeleteAdvisoryParams, req.params.id);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [row] = await db.delete(advisoriesTable)
      .where(eq(advisoriesTable.id, params.data.id))
      .returning({ id: advisoriesTable.id });
    if (!row) {
      res.status(404).json({ error: "Advisory not found" });
      return;
    }
    audit({
      userId: req.user?.id,
      action: "advisory_deleted",
      entityType: "advisory",
      entityId: row.id,
      ip: req.ip,
    });
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete advisory");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/market-prices", requireFarmDataEditor, async (req, res): Promise<void> => {
  if (!isDateOnly((req.body as Record<string, unknown>)?.updatedAt)) {
    res.status(400).json({ error: "updatedAt must be a valid calendar date in YYYY-MM-DD format" });
    return;
  }
  const parsed = CreateMarketPriceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [row] = await db.insert(marketPricesTable).values({
      ...parsed.data,
      updatedAt: dateOnly(parsed.data.updatedAt),
    }).returning();
    const response = ListMarketPricesResponseItem.parse(row);
    audit({
      userId: req.user?.id,
      action: "market_price_created",
      entityType: "market_price",
      entityId: row.id,
      ip: req.ip,
    });
    res.status(201).json(response);
  } catch (err) {
    req.log.error({ err }, "Failed to create market price");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/market-prices/:id", requireFarmDataEditor, async (req, res): Promise<void> => {
  const rawBody = req.body as Record<string, unknown>;
  if (rawBody.updatedAt !== undefined && !isDateOnly(rawBody.updatedAt)) {
    res.status(400).json({ error: "updatedAt must be a valid calendar date in YYYY-MM-DD format" });
    return;
  }
  const params = parseId(UpdateMarketPriceParams, req.params.id);
  const parsed = UpdateMarketPriceBody.safeParse(req.body);
  if (!params.success || !parsed.success || Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: !params.success ? params.error.message : !parsed.success ? parsed.error.message : "At least one field is required" });
    return;
  }

  try {
    const values: Partial<typeof marketPricesTable.$inferInsert> = {};
    if (parsed.data.commodity !== undefined) values.commodity = parsed.data.commodity;
    if (parsed.data.price !== undefined) values.price = parsed.data.price;
    if (parsed.data.unit !== undefined) values.unit = parsed.data.unit;
    if (parsed.data.currency !== undefined) values.currency = parsed.data.currency;
    if (parsed.data.trend !== undefined) values.trend = parsed.data.trend;
    if (parsed.data.changePercent !== undefined) values.changePercent = parsed.data.changePercent;
    if (parsed.data.market !== undefined) values.market = parsed.data.market;
    if (parsed.data.updatedAt !== undefined) values.updatedAt = dateOnly(parsed.data.updatedAt);
    const [row] = await db.update(marketPricesTable)
      .set(values)
      .where(eq(marketPricesTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "Market price not found" });
      return;
    }
    audit({
      userId: req.user?.id,
      action: "market_price_updated",
      entityType: "market_price",
      entityId: row.id,
      ip: req.ip,
    });
    res.json(ListMarketPricesResponseItem.parse(row));
  } catch (err) {
    req.log.error({ err }, "Failed to update market price");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/market-prices/:id", requireFarmDataEditor, async (req, res): Promise<void> => {
  const params = parseId(DeleteMarketPriceParams, req.params.id);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [row] = await db.delete(marketPricesTable)
      .where(eq(marketPricesTable.id, params.data.id))
      .returning({ id: marketPricesTable.id });
    if (!row) {
      res.status(404).json({ error: "Market price not found" });
      return;
    }
    audit({
      userId: req.user?.id,
      action: "market_price_deleted",
      entityType: "market_price",
      entityId: row.id,
      ip: req.ip,
    });
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete market price");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/sms-alerts", requireFarmDataEditor, async (req, res): Promise<void> => {
  if (!isIsoDateTime((req.body as Record<string, unknown>)?.timestamp)) {
    res.status(400).json({ error: "timestamp must be a valid ISO 8601 date-time with a timezone" });
    return;
  }
  const parsed = CreateSmsAlertBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [row] = await db.insert(smsAlertsTable).values({
      message: parsed.data.message,
      type: parsed.data.type,
      alertTimestamp: isoTimestamp(parsed.data.timestamp),
    }).returning();
    const response = ListSmsAlertsResponseItem.parse({
      ...row,
      timestamp: row.alertTimestamp,
    });
    audit({
      userId: req.user?.id,
      action: "sms_alert_created",
      entityType: "sms_alert",
      entityId: row.id,
      ip: req.ip,
    });
    res.status(201).json(response);
  } catch (err) {
    req.log.error({ err }, "Failed to create SMS alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/sms-alerts/:id", requireFarmDataEditor, async (req, res): Promise<void> => {
  const rawBody = req.body as Record<string, unknown>;
  if (rawBody.timestamp !== undefined && !isIsoDateTime(rawBody.timestamp)) {
    res.status(400).json({ error: "timestamp must be a valid ISO 8601 date-time with a timezone" });
    return;
  }
  const params = parseId(UpdateSmsAlertParams, req.params.id);
  const parsed = UpdateSmsAlertBody.safeParse(req.body);
  if (!params.success || !parsed.success || Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: !params.success ? params.error.message : !parsed.success ? parsed.error.message : "At least one field is required" });
    return;
  }

  try {
    const values: Partial<typeof smsAlertsTable.$inferInsert> = {};
    if (parsed.data.message !== undefined) values.message = parsed.data.message;
    if (parsed.data.type !== undefined) values.type = parsed.data.type;
    if (parsed.data.timestamp !== undefined) values.alertTimestamp = isoTimestamp(parsed.data.timestamp);
    const [row] = await db.update(smsAlertsTable)
      .set(values)
      .where(eq(smsAlertsTable.id, params.data.id))
      .returning();
    if (!row) {
      res.status(404).json({ error: "SMS alert not found" });
      return;
    }
    audit({
      userId: req.user?.id,
      action: "sms_alert_updated",
      entityType: "sms_alert",
      entityId: row.id,
      ip: req.ip,
    });
    res.json(ListSmsAlertsResponseItem.parse({
      ...row,
      timestamp: row.alertTimestamp,
    }));
  } catch (err) {
    req.log.error({ err }, "Failed to update SMS alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/sms-alerts/:id", requireFarmDataEditor, async (req, res): Promise<void> => {
  const params = parseId(DeleteSmsAlertParams, req.params.id);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [row] = await db.delete(smsAlertsTable)
      .where(eq(smsAlertsTable.id, params.data.id))
      .returning({ id: smsAlertsTable.id });
    if (!row) {
      res.status(404).json({ error: "SMS alert not found" });
      return;
    }
    audit({
      userId: req.user?.id,
      action: "sms_alert_deleted",
      entityType: "sms_alert",
      entityId: row.id,
      ip: req.ip,
    });
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete SMS alert");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
