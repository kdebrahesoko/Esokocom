import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for Esoko Website visual regression tests.
 *
 * Primary runner (self-contained, works in all environments):
 *   pnpm --filter @workspace/esoko-website run test:visual
 *   pnpm --filter @workspace/esoko-website run test:visual:update
 *
 * This config is used by the Playwright CLI in standard CI environments
 * (e.g. GitHub Actions).  The webServer block starts a throwaway Vite dev
 * server on port 5173 with PORT and BASE_PATH set correctly; set
 * PLAYWRIGHT_BASE_URL to skip the webServer and point at an already-running
 * server instead.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  /* Keep snapshots stable regardless of where tests run */
  snapshotPathTemplate:
    '{testDir}/snapshots/{testFilePath}/{arg}{ext}',

  /* Fail fast on CI; keep retries in local dev */
  retries: process.env.CI ? 2 : 0,

  use: {
    /* Allow overriding via PLAYWRIGHT_BASE_URL env var so we can point at the
     * workflow dev server (whose port Replit assigns dynamically) when running
     * in the workspace.  In CI the webServer block starts a server on 5173. */
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',

    /* Consistent viewport so snapshots never differ by size */
    viewport: { width: 1280, height: 800 },

    /* Don't show the cursor in screenshots */
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* When PLAYWRIGHT_BASE_URL is set (e.g. pointing at the running Replit
   * workflow server) we skip the webServer entirely.  In CI (or when running
   * locally without a live server) we spin one up on port 5173. */
  ...(process.env.PLAYWRIGHT_BASE_URL
    ? {}
    : {
        webServer: {
          command:
            'PORT=5173 BASE_PATH=/ pnpm --filter @workspace/esoko-website run dev',
          port: 5173,
          reuseExistingServer: !process.env.CI,
          timeout: 90_000,
          stdout: 'pipe',
          stderr: 'pipe',
        },
      }),
});
