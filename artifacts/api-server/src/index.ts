import app from "./app";
import { logger } from "./lib/logger";
import { bootstrapSuperAdmin } from "./lib/auth";
import { startResourceScheduler } from "./lib/scheduler";
import { verifyDatabaseReadiness } from "@workspace/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Check connectivity and table presence without changing schema or data.
// Database preparation is reviewed separately; production schema uses Publish.
verifyDatabaseReadiness()
  .then(() => {
    logger.info("Database readiness verified");

    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }

      logger.info({ port }, "Server listening");

      // Provision the first SUPER_ADMIN from env vars (idempotent)
      bootstrapSuperAdmin().catch(e => logger.error({ err: e }, "bootstrapSuperAdmin failed"));

      // Start the resource scheduled-publish job (every 60 seconds)
      startResourceScheduler();
    });
  })
  .catch((err) => {
    logger.error({ err }, "Database readiness failed — server will not start");
    process.exit(1);
  });
