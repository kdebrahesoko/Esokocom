import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

// Run against the managed website workflow; never start a duplicate server.
const baseUrl = process.env.PLAYWRIGHT_BASE_URL;
if (!baseUrl) throw new Error('PLAYWRIGHT_BASE_URL must point to the running website');

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [1440, 390, 1024, 1279, 1280].map(width => ({ width, height: 900 }))) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // The development-only Replit banner can cover the mobile menu toggle.
    // Hide that tooling overlay, not any application UI.
    const hideDevBanner = () => page.addStyleTag({ content: '#replit-dev-banner { display: none !important; }' });
    await page.goto(new URL('/pricing', baseUrl).href);
    await hideDevBanner();
    await page.locator('main h1').waitFor();
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('footer').count(), 1);
    assert.match(await page.locator('main').innerText(), /custom/i);
    assert.equal(await page.locator('main').getByText(/Starter|50k\/month|99\.9%/).count(), 0);
    for (const button of await page.locator('main').getByRole('button', { name: /contact sales/i }).all()) {
      await button.click();
      await page.getByRole('dialog', { name: 'Book a Demo' }).waitFor();
      await page.getByLabel('Close modal').click();
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);

    const mobile = viewport.width < 1280;
    assert.equal(await page.getByTestId('nav-mobile-toggle').isVisible(), mobile);
    const navControls = mobile
      ? ['nav-logo', 'nav-mobile-toggle']
      : ['nav-logo', 'nav-company', 'nav-sectors', 'nav-products & services', 'nav-resources', 'nav-pricing', 'nav-get-started', 'nav-book-demo'];
    let previousRight = 0;
    for (const id of navControls) {
      const box = await page.getByTestId(id).boundingBox();
      assert.ok(box, `${id} should be visible at ${viewport.width}px`);
      assert.ok(box.x >= previousRight && box.x + box.width <= viewport.width, `${id} must not overlap or leave the viewport`);
      previousRight = box.x + box.width;
    }
    for (const suffix of ['pricing', 'get-started']) {
      await page.goto(new URL('/', baseUrl).href);
      await hideDevBanner();
      if (mobile) await page.getByTestId('nav-mobile-toggle').click();
      await page.getByTestId(`${mobile ? 'mobile' : 'nav'}-${suffix}`).click();
      await page.waitForURL('**/pricing');
      await page.locator('main h1').waitFor();
      if (mobile) await page.getByTestId('mobile-menu').waitFor({ state: 'hidden' });
    }
    await page.reload();
    await page.locator('main h1').waitFor();
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`Pricing navigation and sales modal passed at ${viewport.width}px`);
  }
} finally {
  await browser.close();
}
