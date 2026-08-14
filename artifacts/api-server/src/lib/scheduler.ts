/**
 * scheduler.ts
 *
 * Checks every 60 seconds for resources that have been Scheduled for
 * publication and whose scheduled_for timestamp is now in the past.
 * Eligible resources are flipped to Published and logged to audit_logs.
 */
import { db } from "@workspace/db";
import { resourcesTable } from "@workspace/db";
import { eq, and, lte, inArray, sql } from "drizzle-orm";
import { logger } from "./logger";
import { audit } from "./auth";

const INTERVAL_MS = 60_000; // 1 minute

async function publishDueResources(): Promise<void> {
  try {
    // Find all Scheduled resources whose scheduled_for is now past
    const due = await db
      .select({ id: resourcesTable.id, title: resourcesTable.title })
      .from(resourcesTable)
      .where(
        and(
          eq(resourcesTable.status, "Scheduled"),
          lte(resourcesTable.scheduledFor, sql`now()`),
        ),
      );

    if (due.length === 0) return;

    const ids = due.map((r) => r.id);
    const now = new Date();

    await db
      .update(resourcesTable)
      .set({ status: "Published", publishedAt: now, updatedAt: now })
      .where(inArray(resourcesTable.id, ids));

    for (const r of due) {
      audit({
        action:     "resource_auto_published",
        entityId:   String(r.id),
        entityType: "resource",
        userId:     null,
        metadata:   { title: r.title },
      });
      logger.info({ resourceId: r.id, title: r.title }, "Resource auto-published by scheduler");
    }
  } catch (err) {
    logger.error({ err }, "Resource scheduler error");
  }
}

export function startResourceScheduler(): void {
  // Fire once immediately on startup, then repeat every minute
  publishDueResources().catch(() => {});
  setInterval(() => { publishDueResources().catch(() => {}); }, INTERVAL_MS);
  logger.info({ intervalMs: INTERVAL_MS }, "Resource scheduler started");
}
