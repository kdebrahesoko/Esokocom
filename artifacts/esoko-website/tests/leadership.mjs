import assert from 'node:assert/strict';
import { launchBrowser } from './browser.mjs';

const baseUrl = process.argv[2] ?? process.env.PLAYWRIGHT_BASE_URL;
if (!baseUrl) throw new Error('Pass the running website URL as the first argument or set PLAYWRIGHT_BASE_URL.');

const browser = await launchBrowser();
// Keep this expectation independent of TEAM so swapped files/order cannot pass.
const members = [
  ['DA', 'Dr. Daniel Asare-Kyei', 'daniel-asare-kyei', 'https://www.linkedin.com/in/dasarekyeiprofile/'],
  ['WO', 'Mr. William Osei Agyemang', 'william-osei-agyemang', 'https://www.linkedin.com/in/william-osei-agyemang'],
  ['KD', 'Dr. Kwame Ofosu Debrah', 'kwame-ofosu-debrah', 'https://www.linkedin.com/in/kwamedebrah/'],
  ['SM', 'Mr. Solomon Tematey Mensah', 'solomon-tematey-mensah', 'https://www.linkedin.com/in/solomon-mensah'],
  ['PA', 'Mr. Philip Asihene', 'philip-asihene', 'https://www.linkedin.com/in/philipasihene/'],
  ['CO', 'Charlotte Owusu-Ansah', 'charlotte-owusu-ansah', 'https://www.linkedin.com/in/charlotte-owusu-ansah-'],
  ['HY', 'Mr. Henry Osei Yankson', 'henry-osei-yankson', 'https://www.linkedin.com/in/henry-yankson'],
  ['TK', 'Mr. Thomas Kensah', 'thomas-kensah', 'https://www.linkedin.com/in/thomas-kensah/'],
];
let checks = 0;
try {
  for (const width of [1440, 768, 402]) {
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
      const [initials, name, slug, linkedin] = members[index];
      assert.equal(await card.getAttribute('data-testid'), `team-member-${initials}`);
      assert.equal(await card.getAttribute('aria-label'), `View ${name}'s profile`);
      await card.scrollIntoViewIfNeeded();
      await card.locator('img').evaluate(image => image.decode());
      assert.ok(await card.locator('img').evaluate(image => image.naturalWidth > 0));
      assert.equal(await card.locator('img').getAttribute('src'), `/leadership/${slug}.webp`);
      assert.equal(await card.locator('img').getAttribute('alt'), `Portrait of ${name}`);
      assert.equal(await card.locator('img').getAttribute('loading'), 'lazy');
      const frame = await card.locator('img').evaluate(image => {
        const rect = image.getBoundingClientRect();
        const parent = image.closest('button').getBoundingClientRect();
        return { height: rect.height, top: rect.top - parent.top, fit: getComputedStyle(image).objectFit };
      });
      assert.equal(frame.height, width >= 1024 ? 224 : width >= 640 ? 256 : 320);
      assert.ok(frame.top <= 2, 'Portrait frames align with the top of every card');
      assert.equal(frame.fit, 'cover');
      await card.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog');
      await dialog.waitFor();
      await dialog.locator('img').evaluate(image => image.decode());
      assert.equal(await dialog.locator('img').getAttribute('src'), await card.locator('img').getAttribute('src'));
      assert.equal(await dialog.locator('img').getAttribute('loading'), 'eager');
      assert.equal(await dialog.getByRole('heading').textContent(), name);
      assert.equal(await dialog.locator('a').getAttribute('href'), linkedin);
      assert.equal(await dialog.locator('a').getAttribute('target'), '_blank');
      assert.equal(await dialog.locator('a').getAttribute('rel'), 'noopener noreferrer');
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
    await cards.first().click();
    await page.getByTestId('modal-close').click();
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    await cards.first().click();
    await page.getByRole('dialog').click({ position: { x: 2, y: 200 } });
    await page.getByRole('dialog').waitFor({ state: 'detached' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: all eight portraits and dialogs; keyboard controls; no overflow or page errors.`);
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.route('**/api/**', route => route.fulfill({
    status: 200, contentType: 'application/json', body: '[]',
  }));
  await page.route('**/leadership/*.webp', route => route.abort());
  await page.goto(new URL('/company#team', baseUrl).href, { waitUntil: 'domcontentloaded' });
  for (const [initials, name] of members) {
    const card = page.getByTestId(`team-member-${initials}`);
    await card.scrollIntoViewIfNeeded();
    const fallbackName = `Portrait unavailable for ${name}`;
    await card.getByRole('img', { name: fallbackName, exact: true }).waitFor();
    assert.equal(await card.getByRole('img').textContent(), initials);
    await card.click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('img', { name: fallbackName, exact: true }).waitFor();
    assert.equal(await dialog.getByRole('img').textContent(), initials);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    checks++;
  }
  console.log(`PASS failed-image initials fallback. ${checks} leadership cases passed.`);
} finally {
  await browser.close();
}
