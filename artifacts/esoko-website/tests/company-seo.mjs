import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { launchBrowser } from './browser.mjs';

const baseUrl = process.argv[2] ?? process.env.PLAYWRIGHT_BASE_URL;
if (!baseUrl) throw new Error('Pass the running website URL or set PLAYWRIGHT_BASE_URL.');
const title = "About Esoko | Africa's Digital Agriculture Platform";
const origin = 'https://esokocom.replit.app';
const expected = {
  'meta[property="og:title"]': title,
  'meta[property="og:image"]': `${origin}/hero-slide-1.jpg`,
  'meta[property="og:url"]': `${origin}/company`,
  'meta[property="og:type"]': 'website',
  'meta[name="twitter:card"]': 'summary_large_image',
  'meta[name="twitter:title"]': title,
  'meta[name="twitter:image"]': `${origin}/hero-slide-1.jpg`,
};

const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  async function checkHead() {
    assert.equal(await page.title(), title);
    for (const [selector, content] of Object.entries(expected)) {
      assert.equal(await page.locator(selector).count(), 1, `Unique ${selector}`);
      assert.equal(await page.locator(selector).getAttribute('content'), content);
    }
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    assert.match(description, /Ghana-based AgriTech/);
    for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      assert.equal(await page.locator(selector).getAttribute('content'), description);
    }
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${origin}/company`);
    const organization = JSON.parse(await page.locator('#company-organization').textContent());
    assert.equal(organization['@context'], 'https://schema.org');
    assert.equal(organization['@type'], 'Organization');
    assert.equal(organization.name, 'Esoko');
    assert.equal(organization.foundingDate, '2008');
    assert.equal(organization.address.addressCountry, 'GH');
    assert.equal(organization.url, origin);
    assert.equal(organization.logo, `${origin}/esoko-logo.png`);
  }

  // Generated production document, checked without running the application.
  await page.setContent(await readFile(new URL('../dist/public/company/index.html', import.meta.url), 'utf8'));
  await checkHead();
  // Direct visits must expose metadata to crawlers without JavaScript.
  const crawler = await browser.newContext({ javaScriptEnabled: false });
  const crawlerPage = await crawler.newPage();
  await crawlerPage.goto(new URL('/company', baseUrl).href);
  assert.equal(await crawlerPage.title(), title);
  assert.equal(await crawlerPage.locator('meta[property="og:url"]').getAttribute('content'), `${origin}/company`);
  assert.equal(JSON.parse(await crawlerPage.locator('#company-organization').textContent()).name, 'Esoko');
  await crawler.close();

  await page.goto(new URL('/company', baseUrl).href);
  await page.locator('h1').waitFor();
  await checkHead();
  // Exercise the SPA router without reloading so stale tags cannot hide.
  await page.evaluate(() => {
    history.pushState(null, '', '/');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForFunction(() => !document.querySelector('#company-organization'));
  assert.equal(await page.title(), 'Esoko Website');
  assert.equal(await page.locator('meta[property="og:url"]').count(), 0);
  assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
  await page.evaluate(() => {
    history.pushState(null, '', '/company');
    dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.waitForFunction(() => !!document.querySelector('#company-organization'));
  await checkHead();
  for (const asset of ['/hero-slide-1.jpg', '/esoko-logo.png']) {
    const response = await page.request.get(new URL(asset, baseUrl).href);
    assert.equal(response.status(), 200);
    assert.match(response.headers()['content-type'], /^image\//);
  }
  console.log('Company SEO passed: production HTML, no-JS visit, SPA navigation, structured data and assets.');
} finally {
  await browser.close();
}
