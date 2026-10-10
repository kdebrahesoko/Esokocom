import { describe, expect, it, vi } from "vitest";
import { assertDatabaseReadiness } from "../../../../lib/db/src/readiness";

describe("read-only database readiness", () => {
  it("accepts a healthy connection with all expected tables", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });

    await expect(
      assertDatabaseReadiness({ query }, ['"public"."users"', '"public"."sessions"']),
    ).resolves.toBeUndefined();

    expect(query).toHaveBeenCalledTimes(2);
    expect(query).toHaveBeenNthCalledWith(1, "SELECT 1");
    expect(query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("to_regclass(expected.name) IS NULL"),
      [['"public"."users"', '"public"."sessions"']],
    );
  });

  it("fails on connection errors without exposing raw error details", async () => {
    const query = vi.fn().mockRejectedValue(new Error("sensitive connection details"));

    await expect(assertDatabaseReadiness({ query }, ["public.users"]))
      .rejects.toThrow("Database connectivity check failed");

    expect(query).toHaveBeenCalledTimes(1);
  });

  it("reports missing tables without trying to create them", async () => {
    const query = vi.fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ name: "public.sessions" }] });

    await expect(assertDatabaseReadiness({ query }, ["public.sessions"]))
      .rejects.toThrow("missing application tables: public.sessions");

    expect(query).toHaveBeenCalledTimes(2);
  });

  it("fails safely when the catalog query fails", async () => {
    const query = vi.fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockRejectedValueOnce(new Error("sensitive catalog details"));

    await expect(assertDatabaseReadiness({ query }, ["public.users"]))
      .rejects.toThrow("Database table readiness check failed");
  });

  it("binds table names as parameters rather than interpolating them", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });
    const names = ['"custom schema"."unusual table"'];

    await assertDatabaseReadiness({ query }, names);

    const [text, values] = query.mock.calls[1];
    expect(text).toContain("$1::text[]");
    expect(text).not.toContain(names[0]);
    expect(values).toEqual([names]);
  });

  it("issues only the two expected SELECT queries", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [] });

    await assertDatabaseReadiness({ query }, ["public.users"]);

    expect(query.mock.calls.map(([text]) => text.trim().split(/\s+/)[0]))
      .toEqual(["SELECT", "SELECT"]);
    expect(query).toHaveBeenCalledTimes(2);
  });
});
