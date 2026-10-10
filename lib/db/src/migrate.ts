/**
 * migrate.ts
 *
 * Explicit migration entry point: invoke only after separate approval.
 * Never call automatically at startup, build, or post-merge setup.
 *
 * The migrations folder is resolved relative to __dirname so it works
 * both in ts-source (lib/db/src/ → ../migrations) and after esbuild
 * bundles the api-server (dist/ → dist/migrations/ copied by build.mjs).
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";
import pg from "pg";
import path from "path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const { Pool } = pg;

export function resolveMigrationsFolder(
  moduleUrl: string,
  bundledDirectory?: string,
): string {
  return bundledDirectory === undefined
    ? path.resolve(path.dirname(fileURLToPath(moduleUrl)), "../migrations")
    : path.resolve(bundledDirectory, "migrations");
}

export function validateMigrationFiles(migrationsFolder: string): void {
  const journal = JSON.parse(
    readFileSync(path.join(migrationsFolder, "meta", "_journal.json"), "utf8"),
  );
  if (
    journal === null || typeof journal !== "object" ||
    journal.version !== "7" || journal.dialect !== "postgresql" ||
    !Array.isArray(journal.entries) ||
    !journal.entries.every((entry: unknown, index: number) => {
      if (entry === null || typeof entry !== "object") return false;
      const item = entry as Record<string, unknown>;
      return item.idx === index && item.version === "7" &&
        typeof item.when === "number" && Number.isSafeInteger(item.when) &&
        item.when >= 0 &&
        (index === 0 || item.when > journal.entries[index - 1].when) &&
        typeof item.breakpoints === "boolean" &&
        typeof item.tag === "string" && /^[A-Za-z0-9_-]+$/.test(item.tag);
    }) ||
    new Set(journal.entries.map((entry: { tag: string }) => entry.tag)).size !==
      journal.entries.length
  ) {
    throw new Error("Invalid PostgreSQL migration journal");
  }

  // Drizzle checks readability of every referenced SQL file. This is filesystem
  // validation only; it does not execute SQL or certify PostgreSQL SQL syntax.
  const files = readMigrationFiles({ migrationsFolder });
  if (files.some((file) => file.sql.join("").trim().length === 0)) {
    throw new Error("Migration SQL files must not be empty");
  }
}

export async function migrateAndClosePool(
  pool: pg.Pool,
  migrationsFolder: string,
): Promise<void> {
  let failed = false;
  let migrationError: unknown;
  try {
    await migrate(drizzle(pool), { migrationsFolder });
  } catch (error) {
    failed = true;
    migrationError = error;
  }

  try {
    await pool.end();
  } catch (cleanupError) {
    if (failed) {
      throw new AggregateError(
        [migrationError, cleanupError],
        "Migration failed and database pool cleanup also failed",
      );
    }
    throw cleanupError;
  }
  if (failed) throw migrationError;
}

export async function runMigrations(
  options: { connectionString?: string; migrationsFolder?: string } = {},
): Promise<void> {
  // Explicit overrides allow isolated tests without reading or changing env.
  // Existing production callers continue to use the no-argument defaults.
  const connectionString = options.connectionString ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL must be set before running migrations");
  }

  // The API build banner supplies __dirname for the bundled entry.
  const migrationsFolder = options.migrationsFolder ?? resolveMigrationsFolder(
    import.meta.url,
    typeof __dirname !== "undefined" ? __dirname : undefined,
  );
  validateMigrationFiles(migrationsFolder);

  const pool = new Pool({ connectionString });
  await migrateAndClosePool(pool, migrationsFolder);
}
