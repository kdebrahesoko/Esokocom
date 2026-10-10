import { is } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import pg from "pg";
import * as schema from "./schema";
import { assertDatabaseReadiness } from "./readiness";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10_000,
});

pool.on("error", (error) => {
  const code =
    "code" in error &&
    typeof error.code === "string" &&
    /^[0-9A-Z]{5}$/.test(error.code)
      ? error.code
      : "unavailable";
  console.error("Database pool error", { code });
});

export const db = drizzle(pool, { schema });

export async function verifyDatabaseReadiness(): Promise<void> {
  const expectedTables = Object.values(schema).flatMap((value) => {
    if (!is(value, PgTable)) return [];
    const config = getTableConfig(value);
    const quote = (name: string) => `"${name.replaceAll('"', '""')}"`;
    return [`${quote(config.schema ?? "public")}.${quote(config.name)}`];
  });
  await assertDatabaseReadiness(pool, expectedTables);
}

export * from "./schema";
export { runMigrations } from "./migrate";
