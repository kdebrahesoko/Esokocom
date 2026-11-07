// Run from the repository root: node artifacts/esoko-next/tests/hydration-browser.mjs
// Fresh extension-free context for EVERY route/preference, including direct loads.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { launchBrowser } from '../../esoko-website/tests/browser.mjs';

const base = 'http://localhost:80';
const prefix = '/esoko-next';
const routes = new Set(['/', '/resources/', '/careers/', '/company/', '/products-services/', '/sectors/', '/pricing/', '/demo/']);
for (const [file, root] of [['sectors.ts', 'sectors'], ['solutions.ts', 'solutions']]) {
  const data = await readFile(new URL(`../src/data/${file}`, import.meta.url), 'utf8');
  for (const match of data.matchAll(/slug:\s*'([^']+)'/g)) routes.add(`/${root}/${match[1]}/`);
}
const browser = await launchBrowser();
const failures = [];
let count = 0;
try {
  // Discover existing public listings, published resource details and open jobs.
  const discovery = await browser.newContext();
  const discoverPage = await discovery.newPage();
  for (const route of routes) {
    await discoverPage.goto(base + prefix + route, { waitUntil: 'networkidle' });
    const links = await discoverPage.locator('a[href]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
    for (const href of links) {
      if (/^\/esoko-next\/(?:resources|careers)\/[^?#]+\/$/.test(href)) routes.add(href.slice(prefix.length));
    }
  }
  await discovery.close();
  const checks = ['reduce', 'no-preference'].flatMap(reducedMotion =>
    [...routes].map(route => ({ reducedMotion, route })));
  async function worker() {
    while (checks.length) {
      const { reducedMotion, route } = checks.shift();
      const context = await browser.newContext({ reducedMotion, viewport: { width: 1440, height: 1000 } });
      // Fail closed if anything tries to submit forms or mutate application data.
      await context.route('**/*', request => ['GET', 'HEAD', 'OPTIONS'].includes(request.request().method()) ? request.continue() : request.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('console', message => {
        if (/hydrat|didn't match|did not match/i.test(message.text())) errors.push(message.text());
      });
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(base + prefix + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(150);
      if (response.status() !== 200) errors.push(`HTTP ${response.status()}`);
      if (route === '/') {
        const carousel = page.getByTestId('hero-carousel');
        assert.equal(await carousel.getAttribute('aria-live'), reducedMotion === 'reduce' ? 'polite' : 'off');
        // The preference is not frozen at mount: OS preference changes still update it.
        await page.emulateMedia({ reducedMotion: reducedMotion === 'reduce' ? 'no-preference' : 'reduce' });
        await page.waitForTimeout(150);
        assert.equal(await carousel.getAttribute('aria-live'), reducedMotion === 'reduce' ? 'off' : 'polite');
      }
      count++;
      console.log(JSON.stringify({ route, reducedMotion, errors: errors.length }));
      if (errors.length) failures.push({ route, reducedMotion, errors });
      await context.close();
    }
  }
  await Promise.all(Array.from({ length: 4 }, () => worker()));
  console.log(JSON.stringify({ routes: routes.size, checks: count, failures }, null, 2));
  assert.equal(failures.length, 0, 'Hydration checks failed');
} finally {
  await browser.close();
}
