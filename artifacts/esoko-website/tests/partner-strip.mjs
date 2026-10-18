import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Guard the download budget as well as the rendered strip.
for (let index = 1; index <= 12; index++) {
  const file = new URL(`../public/partners/partner-${String(index).padStart(2, '0')}.webp`, import.meta.url);
  const bytes = await readFile(file);
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  assert.ok((await stat(file)).size < 20000, `${file.pathname} must stay below 20 KB`);
}

const baseUrl = process.env.PLAYWRIGHT_BASE_URL;
if (!baseUrl) throw new Error('PLAYWRIGHT_BASE_URL must point to the running website');

const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const route of ['/', '/company']) {
        await page.goto(new URL(route, baseUrl).href, { waitUntil: 'domcontentloaded', timeout: 20000 });
        const strip = page.getByTestId('trusted-partners');
        assert.equal(await strip.count(), 1, 'Each page has exactly one strip');
        await strip.scrollIntoViewIfNeeded();
        const viewport = strip.getByRole('region', { name: 'Partner logo carousel' });
        const track = strip.locator('.partner-logo-track');
        const images = strip.locator('img:visible');
        await images.first().waitFor();
        await images.evaluateAll(async nodes => {
          await Promise.race([
            Promise.all(nodes.map(img => {
              // Off-screen lazy images otherwise wait indefinitely for a scroll.
              img.loading = 'eager';
              return img.decode();
            })),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Partner image loading timed out')), 10000)),
          ]);
        });
        assert.ok(await images.count() >= 12, 'Existing partner marks are displayed');
        assert.equal(await images.evaluateAll(nodes => nodes.every(img =>
          new URL(img.currentSrc).pathname.endsWith('.webp')
          && img.naturalWidth <= 240
          && img.naturalWidth >= img.clientWidth * 2
          && img.naturalHeight >= img.clientHeight * 2
        )), true, 'Logos use compact WebP assets at least twice their displayed resolution');
        assert.equal(await strip.locator('a').count(), 0, 'Logos are not external links');
        assert.notEqual(await viewport.evaluate(el => getComputedStyle(el).maskImage), 'none');
        assert.ok(await strip.evaluate(el => {
          const bounds = el.getBoundingClientRect();
          return bounds.left >= 0 && bounds.right <= innerWidth;
        }), 'The strip stays within the viewport');
        if (width < 768 || reducedMotion === 'reduce') {
          assert.equal(await track.evaluate(el => getComputedStyle(el).animationName), 'none');
          assert.equal(await images.count(), 12, 'Static strip has no duplicate marks');
          await viewport.focus();
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(250);
          assert.ok(await viewport.evaluate(el => el.scrollLeft > 0), 'Keyboard can scroll the strip');
          await viewport.evaluate(el => { el.scrollLeft = el.scrollWidth; });
          assert.ok(await images.last().evaluate(img => {
            const bounds = img.getBoundingClientRect();
            return bounds.left < innerWidth && bounds.right > 0;
          }), 'The last partner is reachable by horizontal scrolling');
        } else {
          const button = strip.getByRole('button', { name: 'Pause logo scrolling' });
          await button.click();
          assert.equal(await track.evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
          await strip.getByRole('button', { name: 'Resume logo scrolling' }).click();
          await page.mouse.move(0, 0);
          assert.equal(await track.evaluate(el => getComputedStyle(el).animationPlayState), 'running');
        }
        if (route === '/company') {
          assert.equal(await page.locator('#partners').count(), 1);
          assert.equal(await page.locator('#partners').evaluate(el =>
            el.previousElementSibling?.querySelector('h1') !== null
            && el.nextElementSibling?.id === 'about'), true, 'Company strip follows the hero');
        } else {
          assert.equal(await strip.evaluate(el =>
            el.nextElementSibling?.textContent?.includes('Stories') ?? false), true,
          'Homepage strip is beside the customer stories');
        }
        console.log(`Partner strip passed: ${route}, ${width}px, ${reducedMotion}`);
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
