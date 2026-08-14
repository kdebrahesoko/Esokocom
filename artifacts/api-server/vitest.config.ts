import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals:     true,
    testTimeout: 20_000,
    // Run integration tests serially — they share a real DB
    pool:        "forks",
    poolOptions: { forks: { singleFork: true } },
    alias: {
      "@workspace/db":      path.resolve(__dirname, "../../lib/db/src/index.ts"),
      "@workspace/api-zod": path.resolve(__dirname, "../../lib/api-zod/src/index.ts"),
    },
  },
});
