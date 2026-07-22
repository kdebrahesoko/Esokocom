import {
  pgTable,
  text,
  serial,
  timestamp,
  real,
  integer,
} from "drizzle-orm/pg-core";

export const advisoriesTable = pgTable("advisories", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'weather' | 'pest' | 'market' | 'nutrition' | 'climate'
  title: text("title").notNull(),
  body: text("body").notNull(),
  date: text("date").notNull(), // ISO date string YYYY-MM-DD
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const marketPricesTable = pgTable("market_prices", {
  id: serial("id").primaryKey(),
  commodity: text("commodity").notNull(),
  price: real("price").notNull(),
  unit: text("unit").notNull(),
  currency: text("currency").notNull().default("GH₵"),
  trend: text("trend").notNull().default("stable"), // 'up' | 'down' | 'stable'
  changePercent: real("change_percent").notNull().default(0),
  market: text("market").notNull(),
  updatedAt: text("updated_at").notNull(), // ISO date string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const smsAlertsTable = pgTable("sms_alerts", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'advisory' | 'market' | 'weather' | 'survey' | 'pest'
  alertTimestamp: text("alert_timestamp").notNull(), // ISO datetime string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Advisory = typeof advisoriesTable.$inferSelect;
export type MarketPrice = typeof marketPricesTable.$inferSelect;
export type SmsAlert = typeof smsAlertsTable.$inferSelect;
