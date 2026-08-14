/**
 * adminStats.ts
 *
 * GET /api/admin/stats
 *
 * Returns role-appropriate dashboard statistics:
 *   - Content stats (resources by status)   — all content roles + SUPER_ADMIN
 *   - HR stats (jobs by status)             — HR_ADMIN + SUPER_ADMIN
 */
import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { resourcesTable, jobsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { requireRole } from "../lib/auth";
import { logger } from "../lib/logger";

const router = Router();

router.get(
  "/admin/stats",
  requireRole("SUPER_ADMIN", "HR_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"),
  async (req: Request, res: Response) => {
    const user = req.user!;
    const result: Record<string, unknown> = {};

    try {
      const isContentRole = ["SUPER_ADMIN", "CONTENT_EDITOR", "CONTENT_AUTHOR"].includes(user.role);
      const isHrRole      = ["SUPER_ADMIN", "HR_ADMIN"].includes(user.role);

      /* ── Content stats ─────────────────────────────────────────────── */
      if (isContentRole) {
        const rows = await db
          .select({ status: resourcesTable.status, total: count() })
          .from(resourcesTable)
          .groupBy(resourcesTable.status);

        const byStatus: Record<string, number> = {};
        for (const r of rows) byStatus[r.status] = Number(r.total);

        // CONTENT_AUTHOR also gets their own "my work" counts
        let myWork: Record<string, number> | undefined;
        if (user.role === "CONTENT_AUTHOR") {
          const myRows = user.id != null
          ? await db
              .select({ status: resourcesTable.status, total: count() })
              .from(resourcesTable)
              .where(eq(resourcesTable.createdBy, user.id))
              .groupBy(resourcesTable.status)
          : [];
          const myByStatus: Record<string, number> = {};
          for (const r of myRows) myByStatus[r.status] = Number(r.total);
          myWork = {
            myDrafts:   myByStatus["Draft"]     ?? 0,
            myInReview: myByStatus["In Review"] ?? 0,
          };
        }

        result.content = {
          drafts:    byStatus["Draft"]     ?? 0,
          inReview:  byStatus["In Review"] ?? 0,
          scheduled: byStatus["Scheduled"] ?? 0,
          published: byStatus["Published"] ?? 0,
          ...(myWork ?? {}),
        };
      }

      /* ── HR stats ──────────────────────────────────────────────────── */
      if (isHrRole) {
        const jobRows = await db
          .select({ status: jobsTable.status, total: count() })
          .from(jobsTable)
          .groupBy(jobsTable.status);

        const byStatus: Record<string, number> = {};
        for (const r of jobRows) byStatus[r.status] = Number(r.total);

        result.hr = {
          published: byStatus["Published"] ?? 0,
          drafts:    byStatus["Draft"]     ?? 0,
          closed:    byStatus["Closed"]    ?? 0,
        };
      }

      res.json(result);
    } catch (err) {
      logger.error({ err }, "GET /admin/stats failed");
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
