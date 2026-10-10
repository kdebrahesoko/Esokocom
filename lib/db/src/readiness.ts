/**
 * Read-only readiness checks. This module deliberately has no runtime database,
 * environment, application-startup, or migration imports.
 */
export interface ReadinessClient {
  query(
    text: string,
    values?: unknown[],
  ): Promise<{ rows: { name: string }[] }>;
}

export async function assertDatabaseReadiness(
  client: ReadinessClient,
  expectedTables: readonly string[],
): Promise<void> {
  try {
    await client.query("SELECT 1");
  } catch {
    throw new Error("Database connectivity check failed");
  }

  let missingTables: { name: string }[];
  try {
    const result = await client.query(
      `SELECT expected.name
       FROM unnest($1::text[]) AS expected(name)
       WHERE to_regclass(expected.name) IS NULL`,
      [[...expectedTables]],
    );
    missingTables = result.rows;
  } catch {
    throw new Error("Database table readiness check failed");
  }

  if (missingTables.length > 0) {
    throw new Error(
      `Database is not ready; missing application tables: ${missingTables
        .map(({ name }) => name)
        .join(", ")}. Reviewed database preparation is required.`,
    );
  }
}
