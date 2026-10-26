import assert from 'node:assert/strict';
import { launchBrowser } from './browser.mjs';

const baseUrl = process.argv[2] ?? process.env.PLAYWRIGHT_BASE_URL;
if (!baseUrl) throw new Error('Pass the running website URL as the first argument or set PLAYWRIGHT_BASE_URL.');

const browser = await launchBrowser();
let checks = 0;
try {
  for (const width of [1440, 402]) {
    const page = await browser.newPage({
      viewport: { width, height: 950 },
      reducedMotion: 'reduce',
    });
    // This is a public presentation test, not an API/database integration test.
    await page.route('**/api/**', route => route.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('/company#team', baseUrl).href, { waitUntil: 'domcontentloaded' });
    const cards = page.locator('[data-testid^="team-member-"]');
    assert.equal(await cards.count(), 8);
    for (let index = 0; index < 8; index++) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      await card.locator('img').evaluate(image => image.decode());
      assert.ok(await card.locator('img').evaluate(image => image.naturalWidth > 0));
      await card.click();
      const dialog = page.getByRole('dialog');
      await dialog.waitFor();
      await dialog.locator('img').evaluate(image => image.decode());
      assert.equal(await dialog.locator('img').getAttribute('src'), await card.locator('img').getAttribute('src'));
      assert.ok(await dialog.getAttribute('aria-labelledby'));
      await page.getByTestId('modal-close').focus();
      await page.keyboard.press('Shift+Tab');
      assert.ok(await dialog.locator('a').evaluate(link => link === document.activeElement));
      await page.keyboard.press('Tab');
      assert.ok(await page.getByTestId('modal-close').evaluate(button => button === document.activeElement));
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' });
      assert.ok(await card.evaluate(button => button === document.activeElement));
      checks++;
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: all eight portraits and dialogs; keyboard controls; no overflow or page errors.`);
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route('**/api/**', route => route.fulfill({
    status: 200, contentType: 'application/json', body: '[]',
  }));
  await page.route('**/leadership/daniel-asare-kyei.webp', route => route.abort());
  await page.goto(new URL('/company#team', baseUrl).href, { waitUntil: 'domcontentloaded' });
  const firstCard = page.locator('[data-testid^="team-member-"]').first();
  await firstCard.scrollIntoViewIfNeeded();
  await firstCard.getByRole('img', { name: /Portrait unavailable/ }).waitFor();
  checks++;
  console.log(`PASS failed-image initials fallback. ${checks} leadership cases passed.`);
} finally {
  await browser.close();
}
