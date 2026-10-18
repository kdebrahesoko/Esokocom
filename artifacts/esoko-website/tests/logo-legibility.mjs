import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL;
if (!baseUrl) throw new Error('PLAYWRIGHT_BASE_URL must point to the running website');

const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 1280, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('/', baseUrl).href);
    const logo = page.getByTestId('nav-logo');
    await logo.locator('img').evaluate(async image => { await image.decode(); });
    await page.addStyleTag({ content: '#replit-dev-banner { display: none !important; }' });

    // Simulate difficult future hero images without modifying the real assets.
    for (const background of ['#f58220', '#ffbf00', '#ffffff', '#000000']) {
      await page.addStyleTag({
        content: `main { background: ${background} !important; }
          main > * { visibility: hidden !important; }`,
      });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForFunction(() =>
        getComputedStyle(document.querySelector('[data-testid="navbar"]')).backgroundColor === 'rgba(0, 0, 0, 0)');
      for (const scrolled of [false, true]) {
        if (scrolled) {
          await page.evaluate(() => window.scrollTo(0, 200));
          await page.waitForFunction(() =>
            document.querySelector('[data-testid="navbar"]').classList.contains('bg-white/95'));
        }
        const styles = await logo.evaluate(link => {
          const backdrop = getComputedStyle(link, '::before');
          // Tailwind may serialize colours as oklab rather than rgba.
          const context = document.createElement('canvas').getContext('2d');
          context.fillStyle = backdrop.backgroundColor;
          context.fillRect(0, 0, 1, 1);
          const image = link.querySelector('img');
          const box = image.getBoundingClientRect();
          return {
            background: Array.from(context.getImageData(0, 0, 1, 1).data),
            radius: backdrop.borderRadius,
            top: backdrop.top,
            left: backdrop.left,
            filter: getComputedStyle(image).filter,
            height: box.height,
            width: box.width,
            expectedWidth: image.naturalWidth / image.naturalHeight * 44,
            loaded: image.complete && image.naturalWidth > 0,
          };
        });
        assert.deepEqual(styles.background, [255, 255, 255, 242]);
        assert.notEqual(styles.radius, '0px');
        assert.equal(styles.top, '-4px');
        assert.equal(styles.left, '-8px');
        assert.equal(styles.filter, 'none', 'Do not recolour the orange wordmark');
        assert.equal(styles.height, 44);
        assert.ok(Math.abs(styles.width - styles.expectedWidth) < 1);
        assert.ok(styles.loaded);
        const box = await logo.boundingBox();
        assert.ok(box.x >= 8 && box.x + box.width + 8 <= width);
      }
    }
    if (width < 1280) {
      await page.getByTestId('nav-mobile-toggle').click();
      await page.getByTestId('mobile-menu').waitFor();
      assert.equal(await logo.isVisible(), true);
    }
    assert.deepEqual(errors, []);
    console.log(`Logo backdrop, unchanged dimensions/colour, and navbar states passed at ${width}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
