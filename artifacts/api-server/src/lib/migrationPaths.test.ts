import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const mocks = vi.hoisted(() => ({
  pool: vi.fn(() => {
    throw new Error("Database pool construction is forbidden in this test");
  }),
  drizzle: vi.fn(),
  migrate: vi.fn(),
}));

vi.mock("pg", () => ({ default: { Pool: mocks.pool } }));
vi.mock("drizzle-orm/node-postgres", () => ({ drizzle: mocks.drizzle }));
vi.mock("drizzle-orm/node-postgres/migrator", () => ({ migrate: mocks.migrate }));

// Direct import only: never import the DB client or application entry point.
// runMigrations is deliberately not imported or called.
import {
  migrateAndClosePool,
  resolveMigrationsFolder,
  validateMigrationFiles,
} from "../../../../lib/db/src/migrate";

let root: string;
const journal = () => ({
  version: "7",
  dialect: "postgresql",
  entries: [{
    idx: 0, version: "7", when: 1, tag: "0000_fixture", breakpoints: true,
  }],
});

function fixture(value: unknown = journal(), sql = "-- filesystem fixture only\n") {
  const folder = path.join(root, "migrations");
  mkdirSync(path.join(folder, "meta"), { recursive: true });
  writeFileSync(path.join(folder, "meta", "_journal.json"), JSON.stringify(value));
  writeFileSync(path.join(folder, "0000_fixture.sql"), sql);
  return folder;
}

beforeEach(() => {
  root = mkdtempSync(path.join(os.tmpdir(), "esoko-migration-path-test-"));
  mocks.pool.mockClear();
  mocks.drizzle.mockReset().mockReturnValue({ mockedDatabase: true });
  mocks.migrate.mockReset().mockResolvedValue(undefined);
});

afterEach(() => {
  try {
    expect(mocks.pool).not.toHaveBeenCalled();
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("database-free migration paths", () => {
  it("resolves the source module's sibling migrations directory", () => {
    const modulePath = path.join(root, "lib/db/src/migrate.ts");
    expect(resolveMigrationsFolder(pathToFileURL(modulePath).href))
      .toBe(path.join(root, "lib/db/migrations"));
  });

  it("resolves a standalone compiled module's sibling migrations directory", () => {
    const modulePath = path.join(root, "lib/db/dist/migrate.js");
    expect(resolveMigrationsFolder(pathToFileURL(modulePath).href))
      .toBe(path.join(root, "lib/db/migrations"));
  });

  it("uses the API bundle directory when supplied by the build banner", () => {
    const bundle = path.join(root, "artifacts/api-server/dist");
    expect(resolveMigrationsFolder("file:///unused/source.ts", bundle))
      .toBe(path.join(bundle, "migrations"));
  });

  it("decodes spaces, percent signs, hash signs and Unicode in file URLs", () => {
    const base = path.join(root, "space % # 農場", "lib/db");
    const url = pathToFileURL(path.join(base, "src/migrate.ts")).href;
    expect(url).toContain("%20");
    expect(url).toContain("%25");
    expect(url).toContain("%23");
    expect(resolveMigrationsFolder(url)).toBe(path.join(base, "migrations"));
  });

  it("preserves filesystem characters in a bundled directory", () => {
    const bundle = path.join(root, "bundle % # space", "dist");
    expect(resolveMigrationsFolder("file:///unused.ts", bundle))
      .toBe(path.join(bundle, "migrations"));
  });

  it("rejects non-file module URLs", () => {
    expect(() => resolveMigrationsFolder("https://example.invalid/migrate.ts"))
      .toThrow();
  });
});

describe("read-only migration file preflight", () => {
  it("accepts a valid journal and readable nonempty referenced files", () => {
    expect(() => validateMigrationFiles(fixture())).not.toThrow();
    expect(mocks.drizzle).not.toHaveBeenCalled();
    expect(mocks.migrate).not.toHaveBeenCalled();
  });

  it("accepts the existing repository migration files without executing them", () => {
    const folder = resolveMigrationsFolder(new URL(
      "../../../../lib/db/src/migrate.ts", import.meta.url,
    ).href);
    expect(() => validateMigrationFiles(folder)).not.toThrow();
    expect(mocks.migrate).not.toHaveBeenCalled();
  });

  it("rejects a missing directory", () => {
    expect(() => validateMigrationFiles(path.join(root, "absent"))).toThrow();
  });

  it("rejects a missing journal", () => {
    const folder = fixture();
    rmSync(path.join(folder, "meta/_journal.json"));
    expect(() => validateMigrationFiles(folder)).toThrow();
  });

  it("rejects malformed journal JSON", () => {
    const folder = fixture();
    writeFileSync(path.join(folder, "meta/_journal.json"), "{");
    expect(() => validateMigrationFiles(folder)).toThrow();
  });

  it.each([
    null,
    { ...journal(), dialect: "sqlite" },
    { ...journal(), version: "6" },
    { ...journal(), entries: {} },
    { ...journal(), entries: [null] },
    { ...journal(), entries: [{ ...journal().entries[0], idx: 1 }] },
    { ...journal(), entries: [{ ...journal().entries[0], when: "1" }] },
    { ...journal(), entries: [{ ...journal().entries[0], breakpoints: "yes" }] },
    { ...journal(), entries: [{ ...journal().entries[0], tag: "../outside" }] },
  ])("rejects malformed journal shape %#", (value) => {
    expect(() => validateMigrationFiles(fixture(value)))
      .toThrow("Invalid PostgreSQL migration journal");
  });

  it("rejects duplicate migration tags", () => {
    const value = journal();
    value.entries.push({ ...value.entries[0], idx: 1, when: 2 });
    expect(() => validateMigrationFiles(fixture(value)))
      .toThrow("Invalid PostgreSQL migration journal");
  });

  it("rejects a missing referenced SQL file", () => {
    const folder = fixture();
    rmSync(path.join(folder, "0000_fixture.sql"));
    expect(() => validateMigrationFiles(folder)).toThrow("No file");
  });

  it("rejects empty or whitespace-only referenced SQL", () => {
    expect(() => validateMigrationFiles(fixture(journal(), " \n\t")))
      .toThrow("Migration SQL files must not be empty");
  });

  it("rejects an unreadable referenced file represented by a directory", () => {
    const folder = fixture();
    rmSync(path.join(folder, "0000_fixture.sql"));
    mkdirSync(path.join(folder, "0000_fixture.sql"));
    expect(() => validateMigrationFiles(folder)).toThrow("No file");
  });
});

describe("pool cleanup with mocked migration interfaces only", () => {
  function fakePool() {
    const end = vi.fn().mockResolvedValue(undefined);
    return {
      end,
      pool: { end } as unknown as Parameters<typeof migrateAndClosePool>[0],
    };
  }

  it("closes once on success", async () => {
    const { pool, end } = fakePool();
    await migrateAndClosePool(pool, "/mocked/migrations");
    expect(mocks.migrate).toHaveBeenCalledWith(
      { mockedDatabase: true }, { migrationsFolder: "/mocked/migrations" },
    );
    expect(end).toHaveBeenCalledTimes(1);
  });

  it("closes once on migration failure and preserves the error", async () => {
    const error = new Error("mock migration failure");
    mocks.migrate.mockRejectedValueOnce(error);
    const { pool, end } = fakePool();
    await expect(migrateAndClosePool(pool, "/mocked/migrations"))
      .rejects.toBe(error);
    expect(end).toHaveBeenCalledTimes(1);
  });

  it("closes when Drizzle initialization throws", async () => {
    const error = new Error("mock initialization failure");
    mocks.drizzle.mockImplementationOnce(() => { throw error; });
    const { pool, end } = fakePool();
    await expect(migrateAndClosePool(pool, "/mocked/migrations"))
      .rejects.toBe(error);
    expect(mocks.migrate).not.toHaveBeenCalled();
    expect(end).toHaveBeenCalledTimes(1);
  });

  it("reports cleanup failure after successful migration", async () => {
    const error = new Error("mock cleanup failure");
    const { pool, end } = fakePool();
    end.mockRejectedValueOnce(error);
    await expect(migrateAndClosePool(pool, "/mocked/migrations"))
      .rejects.toBe(error);
    expect(end).toHaveBeenCalledTimes(1);
  });

  it("preserves both errors when migration and cleanup fail", async () => {
    const migrationError = new Error("mock migration failure");
    const cleanupError = new Error("mock cleanup failure");
    mocks.migrate.mockRejectedValueOnce(migrationError);
    const { pool, end } = fakePool();
    end.mockRejectedValueOnce(cleanupError);
    await expect(migrateAndClosePool(pool, "/mocked/migrations"))
      .rejects.toMatchObject({
        name: "AggregateError",
        errors: [migrationError, cleanupError],
      });
    expect(end).toHaveBeenCalledTimes(1);
  });
});
