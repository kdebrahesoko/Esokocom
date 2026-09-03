/**
 * Brand colour visual regression script.
 *
 * Self-contained: starts its own Vite dev server if no PLAYWRIGHT_BASE_URL
 * is set, waits until it is ready, then tears it down after the run.
 *
 * Usage:
 *   node tests/generate-snapshots.mjs           # compare against baseline
 *   node tests/generate-snapshots.mjs --update  # regenerate baseline snapshots
 *
 * Environment variables:
 *   PLAYWRIGHT_BROWSERS_PATH   path to nix-store playwright browsers
 *   PLAYWRIGHT_BASE_URL        skip server start, use this URL instead
 *   VITE_PORT                  port for the managed Vite server (default: 5173)
 */

import { chromium } from '@playwright/test';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createConnection } from 'node:net';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..', '..'); // workspace root
const SNAPSHOTS_DIR = join(__dirname, 'snapshots', 'brand-color.spec.ts');
const UPDATE = process.argv.includes('--update');

const VITE_PORT = Number(process.env.VITE_PORT ?? 5173);
const EXTERNAL_URL = process.env.PLAYWRIGHT_BASE_URL; // skip server start when set

// ─── Vite server management ──────────────────────────────────────────────────

function waitForServer(port, timeout = 60_000) {
  const deadline = Date.now() + timeout;
  return new Promise((resolve, reject) => {
    function attempt() {
      const sock = createConnection(port, '127.0.0.1');
      sock.once('connect', () => { sock.destroy(); resolve(); });
      sock.once('error', () => {
        sock.destroy();
        if (Date.now() > deadline) {
          return reject(new Error(`Vite dev server did not start on port ${port} within ${timeout}ms`));
        }
        setTimeout(attempt, 400);
      });
    }
    attempt();
  });
}

async function startVite(port) {
  console.log(`Starting Vite dev server on port ${port} …`);
  const child = spawn(
    'pnpm',
    ['--filter', '@workspace/esoko-website', 'run', 'dev'],
    {
      cwd: ROOT,
      env: { ...process.env, PORT: String(port), BASE_PATH: '/' },
      stdio: ['ignore', 'pipe', 'pipe'],
      // detached=true makes the child its own process group leader so we can
      // send SIGTERM to the whole group (Vite spawns its own child workers)
      detached: true,
    },
  );
  child.unref(); // don't prevent our own process from exiting

  child.stdout.on('data', (d) => {
    if (process.env.VITE_VERBOSE) process.stdout.write('[vite] ' + d);
  });
  child.stderr.on('data', (d) => {
    if (process.env.VITE_VERBOSE) process.stderr.write('[vite] ' + d);
  });

  await waitForServer(port);
  console.log(`Vite server ready at http://localhost:${port}`);
  return child;
}

function stopVite(child) {
  if (!child) return;
  try {
    // Kill the entire process group so nested Vite workers also exit
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    child.kill('SIGTERM');
  }
  // Force-kill after 3 seconds if it hasn't exited
  const forceKill = setTimeout(() => {
    try { process.kill(-child.pid, 'SIGKILL'); } catch { child.kill('SIGKILL'); }
  }, 3_000);
  forceKill.unref(); // don't block process exit
}

// ─── Expected brand colour (light mode) ─────────────────────────────────────
// Defined in src/index.css:  --brand: 17 76% 48%;
const EXPECTED = { h: 17, s: 76, l: 48 };
const HSL_TOL = 2; // ±2 HSL units

function near(v, exp, label) {
  if (Math.abs(v - exp) > HSL_TOL) {
    throw new Error(`${label}: expected ~${exp}, got ${v} (tolerance ±${HSL_TOL})`);
  }
}

// ─── PNG pixel comparison ────────────────────────────────────────────────────
//
// Per-snapshot diff tolerance:
//   - UI components (button, stat cards): tight — 5%
//   - Hero section (carousel background images): loose — 15%
//
const DEFAULT_MAX_DIFF = 0.05;
const SNAPSHOT_THRESHOLDS = {
  'hero-section-top.png': 0.15,
};

function compareSnapshots(refBuf, actualBuf, name) {
  const ref    = PNG.sync.read(refBuf);
  const actual = PNG.sync.read(actualBuf);

  if (ref.width !== actual.width || ref.height !== actual.height) {
    throw new Error(
      `${name}: dimension mismatch — ref ${ref.width}×${ref.height}, ` +
      `actual ${actual.width}×${actual.height}`,
    );
  }

  const maxDiff = SNAPSHOT_THRESHOLDS[name] ?? DEFAULT_MAX_DIFF;
  const totalPixels = ref.width * ref.height;
  const diff = new PNG({ width: ref.width, height: ref.height });
  const numMismatch = pixelmatch(
    ref.data, actual.data, diff.data,
    ref.width, ref.height,
    { threshold: 0.15 },
  );

  const ratio = numMismatch / totalPixels;
  if (ratio > maxDiff) {
    throw new Error(
      `${name}: too many differing pixels — ${numMismatch}/${totalPixels} ` +
      `(${(ratio * 100).toFixed(1)}% > ${(maxDiff * 100).toFixed(0)}% limit)`,
    );
  }
  return ratio;
}

async function saveOrCompare(name, buf) {
  if (!existsSync(SNAPSHOTS_DIR)) mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  const file = join(SNAPSHOTS_DIR, name);

  if (UPDATE || !existsSync(file)) {
    writeFileSync(file, buf);
    console.log(`  ✔ snapshot saved: ${name}`);
    return 0;
  }

  const ref = readFileSync(file);
  const ratio = compareSnapshots(ref, buf, name);
  console.log(`  ✔ snapshot OK: ${name} (${(ratio * 100).toFixed(2)}% pixel diff)`);
  return ratio;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function run() {
  const baseURL = EXTERNAL_URL ?? `http://localhost:${VITE_PORT}`;

  // Start Vite unless an external server URL was provided
  let viteProcess = null;
  if (!EXTERNAL_URL) {
    viteProcess = await startVite(VITE_PORT);
  }

  let passed = 0;
  let failed = 0;

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });

    // ── Suppress ALL animations/transitions before every page load ──────────
    // addInitScript runs before the page document is created, so it survives
    // navigation and won't be cleared by goto().
    await context.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration:        0ms !important;
          animation-delay:           0ms !important;
          transition-duration:       0ms !important;
          transition-delay:          0ms !important;
        }
      `;
      document.head.appendChild(style);
    });

    const page = await context.newPage();

    console.log(`\nLoading ${baseURL} …`);
    await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30_000 });

    async function check(label, fn) {
      process.stdout.write(`${label} … `);
      try {
        await fn();
        passed++;
      } catch (e) {
        console.log(`FAIL  ${e.message}`);
        failed++;
      }
    }

    // ── 1. CSS variable exact check ──────────────────────────────────────────
    await check('1. --brand CSS variable', async () => {
      const raw = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--brand')
          .trim(),
      );
      const parts = raw.replace(/%/g, '').split(/\s+/).map(Number);
      if (parts.length < 3 || parts.some(isNaN))
        throw new Error(`Could not parse --brand value: "${raw}"`);
      near(parts[0], EXPECTED.h, 'hue');
      near(parts[1], EXPECTED.s, 'saturation');
      near(parts[2], EXPECTED.l, 'lightness');
      console.log(`PASS  (${raw})`);
    });

    // ── 2. Navbar button background colour ───────────────────────────────────
    await check('2. Navbar "Book a Demo" bg colour', async () => {
      const button = page.getByTestId('nav-book-demo');
      await button.waitFor({ state: 'visible', timeout: 5_000 });

      // Scroll to trigger the `scrolled` React state (threshold: scrollY > 60)
      await page.evaluate(() => window.scrollTo(0, 200));

      // Wait for React to re-render: poll until the button background is orange
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('[data-testid="nav-book-demo"]');
          if (!btn) return false;
          const bg = getComputedStyle(btn).backgroundColor;
          const m = bg.match(/\d+/g);
          if (!m) return false;
          const [r, , b] = m.map(Number);
          return r > 150 && b < 100; // orange: high red, low blue
        },
        { timeout: 5_000 },
      );

      const bg = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
      const [r, g, b] = bg.match(/\d+/g).map(Number);
      if (r <= 150) throw new Error(`red channel ${r} ≤ 150 — not orange`);
      if (g >= r)   throw new Error(`green ${g} ≥ red ${r} — not orange`);
      if (b >= 100) throw new Error(`blue channel ${b} ≥ 100 — not orange`);
      console.log(`PASS  (${bg})`);
    });

    // ── 3. Navbar button visual snapshot ────────────────────────────────────
    await check('3. Navbar button snapshot', async () => {
      const button = page.getByTestId('nav-book-demo');
      await button.waitFor({ state: 'visible', timeout: 5_000 });
      await page.evaluate(() => window.scrollTo(0, 200));
      // Wait for the scrolled state to apply before snapshotting
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('[data-testid="nav-book-demo"]');
          if (!btn) return false;
          const bg = getComputedStyle(btn).backgroundColor;
          const m = bg.match(/\d+/g);
          if (!m) return false;
          const [r, , b] = m.map(Number);
          return r > 150 && b < 100;
        },
        { timeout: 5_000 },
      );
      const buf = await button.screenshot();
      await saveOrCompare('navbar-book-demo-btn.png', buf);
    });

    // ── 4. Hero section top visual snapshot ─────────────────────────────────
    await check('4. Hero section top snapshot', async () => {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      const buf = await page.screenshot({
        clip: { x: 0, y: 0, width: 1280, height: 200 },
      });
      await saveOrCompare('hero-section-top.png', buf);
    });

    // ── 5. WhoWeAre section brand text colour ───────────────────────────────
    await check('5. WhoWeAreSection brand colour', async () => {
      const whoSection = page.locator('section').filter({ hasText: 'Who Is Esoko?' });
      await whoSection.waitFor({ state: 'visible', timeout: 5_000 });
      await whoSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);

      // The stat numbers use `text-brand` — must be visible and orange
      const el = page.locator('.text-brand').first();
      await el.waitFor({ state: 'visible', timeout: 5_000 });

      const color = await el.evaluate((e) => getComputedStyle(e).color);
      const [r, g, b] = color.match(/\d+/g).map(Number);
      if (r <= 150) throw new Error(`red channel ${r} ≤ 150`);
      if (g >= r)   throw new Error(`green ${g} ≥ red ${r}`);
      if (b >= 100) throw new Error(`blue channel ${b} ≥ 100`);
      console.log(`PASS  (${color})`);
    });

    // ── 6. WhoWeAre stat-card visual snapshot ───────────────────────────────
    await check('6. WhoWeAreSection stat-card snapshot', async () => {
      const whoSection = page.locator('section').filter({ hasText: 'Who Is Esoko?' });
      await whoSection.waitFor({ state: 'visible', timeout: 5_000 });
      await whoSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Locate the stat-card grid within the section (mandatory)
      const grid = whoSection.locator('.grid.grid-cols-2').first();
      await grid.waitFor({ state: 'visible', timeout: 5_000 });
      const buf = await grid.screenshot();
      await saveOrCompare('who-we-are-stat-cards.png', buf);
    });

    await browser.close();
  } finally {
    stopVite(viteProcess);
  }

  const status = failed > 0 ? 'FAILED' : 'PASSED';
  console.log(`\n── ${status}: ${passed} passed, ${failed} failed ──\n`);
  if (failed > 0) process.exit(1);
}

run().catch((e) => {
  console.error('\nFatal error:', e.message);
  process.exit(1);
});
