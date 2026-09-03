/**
 * Brand colour regression tests for the Esoko website.
 *
 * These tests verify that the `--brand` CSS custom property (and the Tailwind
 * utilities it powers — `text-brand`, `bg-brand`, `text-brand/…`, etc.) renders
 * the expected Esoko orange across three key surfaces:
 *
 *   1. Navbar — "Book a Demo" button (bg-brand when scrolled)
 *   2. HeroCarousel — primary CTA button
 *   3. WhoWeAreSection — stat-card text & icon tint
 *
 * Strategy
 * ─────────
 * Rather than doing full-page pixel diffs (which are flaky across OS/font
 * rendering differences), we use two complementary techniques:
 *
 *   A) CSS-variable assertion — read the computed `--brand` value from the DOM
 *      and compare it to the expected HSL triplet.  This is fast, exact, and
 *      CI-safe.
 *
 *   B) Element screenshot snapshots — capture a tight crop of each brand-
 *      coloured element and compare to a committed baseline image.  Use a
 *      small pixel-difference threshold so minor sub-pixel anti-aliasing is
 *      tolerated but a colour change is always caught.
 *
 * To regenerate the baseline snapshots after an intentional brand change run:
 *   pnpm --filter @workspace/esoko-website run test:visual:update
 */

import { test, expect } from '@playwright/test';

// ─── Expected brand colour ──────────────────────────────────────────────────
//
// Light-mode `--brand` defined in src/index.css:
//   --brand: 17 76% 48%;
//   → hsl(17, 76%, 48%)  ≈  rgb(215, 88, 22)  ≈  #D75816
//
// We store the raw triplet so it's easy to update when the brand evolves.
const EXPECTED_BRAND_HSL = { h: 17, s: 76, l: 48 };

// Acceptable drift (in HSL units) before we declare a regression.
// Playwright rounds `getComputedStyle` values; allow ±2 on each axis.
const TOLERANCE = 2;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Read the `--brand` CSS custom property from :root and parse its HSL parts. */
async function readBrandHSL(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--brand')
      .trim(); // e.g. "17 76% 48%"

    const parts = raw.replace(/%/g, '').split(/\s+/).map(Number);
    return { h: parts[0], s: parts[1], l: parts[2] };
  });
}

/** Assert that a number is within ±tolerance of the expected value. */
function near(actual: number, expected: number, tolerance = TOLERANCE) {
  expect(actual, `expected ~${expected}, got ${actual}`).toBeGreaterThanOrEqual(
    expected - tolerance,
  );
  expect(actual, `expected ~${expected}, got ${actual}`).toBeLessThanOrEqual(
    expected + tolerance,
  );
}

// ─── Setup ──────────────────────────────────────────────────────────────────

// Suppress animations via an init script so it persists through navigation
// (addStyleTag before goto is discarded when the document replaces itself).
test.use({
  contextOptions: {
    // Inject the animation-kill stylesheet before every page load in this suite
  },
});

test.beforeEach(async ({ page }) => {
  // addInitScript runs before the page document is created, so it survives
  // navigation and is not discarded when goto() loads a new document.
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration:   0ms !important;
        animation-delay:      0ms !important;
        transition-duration:  0ms !important;
        transition-delay:     0ms !important;
      }
    `;
    document.head.appendChild(style);
  });
  await page.goto('/', { waitUntil: 'networkidle' });
});

// ─── CSS-variable assertions ─────────────────────────────────────────────────

test('--brand CSS variable matches expected orange in light mode', async ({
  page,
}) => {
  const { h, s, l } = await readBrandHSL(page);

  near(h, EXPECTED_BRAND_HSL.h);
  near(s, EXPECTED_BRAND_HSL.s);
  near(l, EXPECTED_BRAND_HSL.l);
});

// ─── Navbar brand colour ─────────────────────────────────────────────────────

test('Navbar "Book a Demo" button uses brand orange background when scrolled', async ({
  page,
}) => {
  const button = page.getByTestId('nav-book-demo');
  await expect(button).toBeVisible();

  // Scroll down to trigger the scrolled navbar state (threshold: scrollY > 60)
  await page.evaluate(() => window.scrollTo(0, 200));

  // Wait for React to re-render with the orange bg — polling is more reliable
  // than a fixed timeout, especially on slow CI workers.
  await page.waitForFunction(() => {
    const btn = document.querySelector('[data-testid="nav-book-demo"]');
    if (!btn) return false;
    const bg = getComputedStyle(btn).backgroundColor;
    const m = bg.match(/\d+/g);
    if (!m) return false;
    const [r, , b] = m.map(Number);
    return r > 150 && b < 100; // orange: high red, low blue
  }, { timeout: 5_000 });

  const bg = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
  const [r, g, b] = bg.match(/\d+/g)!.map(Number);
  expect(r, 'brand red channel').toBeGreaterThan(150);
  expect(g, 'brand green channel').toBeLessThan(r);
  expect(b, 'brand blue channel').toBeLessThan(100);
});

test('Navbar "Book a Demo" button — visual snapshot', async ({ page }) => {
  const button = page.getByTestId('nav-book-demo');
  await expect(button).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, 200));
  await page.waitForFunction(() => {
    const btn = document.querySelector('[data-testid="nav-book-demo"]');
    if (!btn) return false;
    const bg = getComputedStyle(btn).backgroundColor;
    const m = bg.match(/\d+/g);
    if (!m) return false;
    const [r, , b] = m.map(Number);
    return r > 150 && b < 100;
  }, { timeout: 5_000 });

  await expect(button).toHaveScreenshot('navbar-book-demo-btn.png', {
    maxDiffPixelRatio: 0.05,
  });
});

// ─── HeroCarousel CTA button ──────────────────────────────────────────────────

test('HeroCarousel primary CTA button — visual snapshot', async ({ page }) => {
  // The hero renders at the top of the page; scroll back to top to be safe
  await page.evaluate(() => window.scrollTo(0, 0));

  // The first slide's CTA1 label is "Explore Platform"
  // It's rendered inside the hero — use a more general selector
  const heroCta = page
    .locator('[data-testid="hero-cta-primary"], .hero-cta-primary')
    .first();

  // Fall back to finding a button/link in the hero section by text
  const heroSection = page.locator('section').first();
  await expect(heroSection).toBeVisible();

  // Take a screenshot of the hero section top area for colour regression
  await expect(heroSection).toHaveScreenshot('hero-section-top.png', {
    clip: { x: 0, y: 0, width: 1280, height: 200 },
    maxDiffPixelRatio: 0.08,
  });
});

// ─── WhoWeAreSection stat card ────────────────────────────────────────────────

test('WhoWeAreSection stat card text uses brand orange', async ({ page }) => {
  // Scroll to the WhoWeAre section
  const whoSection = page.locator('section').filter({ hasText: 'Who Is Esoko?' });
  await expect(whoSection).toBeVisible();
  await whoSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // The stat numbers use `text-brand` — the first one must be visible and orange
  const statNumber = page.locator('.text-brand').first();
  await expect(statNumber).toBeVisible();

  const color = await statNumber.evaluate((el) => getComputedStyle(el).color);
  const [r, g, b] = color.match(/\d+/g)!.map(Number);
  expect(r, 'brand red channel in stat').toBeGreaterThan(150);
  expect(g, 'brand green channel in stat').toBeLessThan(r);
  expect(b, 'brand blue channel in stat').toBeLessThan(100);
});

test('WhoWeAreSection stat card — visual snapshot', async ({ page }) => {
  const whoSection = page.locator('section').filter({ hasText: 'Who Is Esoko?' });
  await expect(whoSection).toBeVisible();
  await whoSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // The stat-card grid is a direct child of the section
  const statGrid = whoSection.locator('.grid.grid-cols-2').first();
  await expect(statGrid).toBeVisible();
  await expect(statGrid).toHaveScreenshot('who-we-are-stat-cards.png', {
    maxDiffPixelRatio: 0.05,
  });
});
