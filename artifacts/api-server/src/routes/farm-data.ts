import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  advisoriesTable,
  marketPricesTable,
  smsAlertsTable,
} from "@workspace/db";
import { desc } from "drizzle-orm";

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
    console.error("Failed to fetch advisories:", err);
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
    console.error("Failed to fetch market prices:", err);
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
    console.error("Failed to fetch SMS alerts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
