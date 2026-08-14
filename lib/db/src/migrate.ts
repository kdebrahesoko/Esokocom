/**
 * migrate.ts
 *
 * Runs all pending drizzle migrations against the connected database.
 * Call once at server startup before accepting requests.
 *
 * The migrations folder is resolved relative to __dirname so it works
 * both in ts-source (lib/db/src/ → ../migrations) and after esbuild
 * bundles the api-server (dist/ → dist/migrations/ copied by build.mjs).
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import path from "path";

const { Pool } = pg;

export async function runMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set before running migrations");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  // __dirname is set by build banner in bundled mode (points to dist/)
  // In ts-source resolution, __dirname points to lib/db/src/ so we go up one level
  const base =
    typeof __dirname !== "undefined"
      ? __dirname
      : path.dirname(new URL(import.meta.url).pathname);

  // Bundled: dist/migrations  |  Source: lib/db/migrations
  const migrationsFolder = path.join(base, "migrations");

  await migrate(db, { migrationsFolder });
  await pool.end();
}
