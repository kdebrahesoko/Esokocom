import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import { launchBrowser } from './browser.mjs';

const baseUrl = process.argv[2] ?? process.env.PLAYWRIGHT_BASE_URL;
if (!baseUrl) throw new Error('Pass the running website URL or set PLAYWRIGHT_BASE_URL.');
const browser = await launchBrowser();
try {
  for (const viewport of [{ width: 1440, height: 950 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/**', route => route.fulfill({ contentType: 'application/json', body: '[]' }));
    // Isolate dialog behavior from third-party player availability.
    let embedRequests = 0;
    await page.route('https://www.youtube-nocookie.com/**', route => {
      embedRequests++;
      return route.fulfill({ contentType: 'text/html', body: '<p>Video player</p>' });
    });
    await page.goto(new URL('/company#story-video', baseUrl).href);
    const trigger = page.getByRole('button', { name: 'Play Watch Our Story video' });
    await expect(trigger).toBeVisible();
    assert.equal(await page.locator('iframe').count(), 0, 'No player before opening');
    assert.equal(embedRequests, 0);
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Watch Our Story' });
    await expect(dialog).toBeVisible();
    const close = dialog.getByRole('button', { name: 'Close video' });
    await expect(close).toBeFocused();
    const iframe = dialog.locator('iframe');
    await expect(iframe).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/5TRjt4fyrU0?autoplay=1&rel=0&playsinline=1');
    await expect(iframe).toHaveAttribute('allowfullscreen', '');
    const fallback = dialog.getByRole('link', { name: /Watch on YouTube/ });
    await expect(fallback).toHaveAttribute('href', 'https://www.youtube.com/watch?v=5TRjt4fyrU0');
    await close.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(fallback).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    assert.equal(await page.locator('body').evaluate(body => getComputedStyle(body).overflow), 'hidden');
    const box = await dialog.boundingBox();
    assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width && box.y + box.height <= viewport.height, 'Dialog fits the viewport');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await close.click();
    await expect(dialog).toHaveCount(0);
    await trigger.click();
    await page.getByTestId('story-video-overlay').click({ position: { x: 2, y: 2 } });
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log(`PASS ${viewport.width}x${viewport.height}: player lifecycle, keyboard, focus trap/restore, close controls, viewport fit`);
    await page.close();
  }
} finally {
  await browser.close();
}
