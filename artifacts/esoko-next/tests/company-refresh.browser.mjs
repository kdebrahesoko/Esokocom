// Read-only Company presentation check; no forms, database or external navigation.
// node artifacts/esoko-next/tests/company-refresh.browser.mjs
import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";

const origin = process.argv.slice(2).find(value => /^https?:\/\//.test(value))
  || `https://${process.env.REPLIT_DEV_DOMAIN}`;
const browser = await launchBrowser();
try {
  for (const width of [360, 768, 1024, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 }, reducedMotion: "reduce",
    });
    await context.route("**/*", route => ["GET", "HEAD", "OPTIONS"].includes(route.request().method())
      ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(`${origin}/esoko-next/company/`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    const html = await response.text();
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /name="robots"[^>]*noindex/);
    assert.equal(await page.locator("h1").count(), 1);
    await page.waitForFunction(() =>
      Number(getComputedStyle(document.querySelector("h1")).opacity) === 1);
    const explore = page.getByTestId("company-button-explore-story");
    await explore.focus();
    assert.notEqual(await explore.evaluate(element => getComputedStyle(element).outlineStyle === "none"
      && getComputedStyle(element).boxShadow === "none"), true, "Hero action needs visible focus.");
    const box = await explore.boundingBox();
    assert.ok(box.height >= 44 && box.width >= 44);
    if ([360, 1440].includes(width)) {
      await page.screenshot({ path: `/tmp/company-refined-hero-${width}.png` });
    }
    await explore.press("Enter");
    await page.waitForFunction(() => document.querySelector("#overview").getBoundingClientRect().top < 200);
    // Visit every section to exercise lazy image loading and reveal boundaries.
    for (const section of await page.locator(".company-page main section").all()) {
      await section.scrollIntoViewIfNeeded();
    }
    for (const id of ["about", "presence"]) {
      const section = page.locator(`#${id}`);
      await section.scrollIntoViewIfNeeded();
      const image = section.locator("img").first();
      await image.evaluate(element => element.decode());
      assert.ok(await image.evaluate(element => element.naturalWidth > 0));
      assert.equal(await image.getAttribute("loading"), "lazy");
      assert.ok(await image.getAttribute("alt"));
      if ([360, 1440].includes(width)) {
        await section.screenshot({ path: `/tmp/company-refined-${id}-${width}.png` });
      }
    }
    const profiles = page.locator('[data-testid^="team-member-"]');
    assert.equal(await profiles.count(), 8);
    await profiles.first().scrollIntoViewIfNeeded();
    await profiles.first().focus();
    await profiles.first().press("Enter");
    await page.getByRole("dialog").waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "detached" });
    await page.waitForFunction(() =>
      document.querySelector('[data-testid^="team-member-"]') === document.activeElement);
    if ([360, 1440].includes(width)) {
      await page.locator("#team").screenshot({ path: `/tmp/company-refined-team-${width}.png` });
    }
    const gallery = page.locator("#gallery");
    await gallery.scrollIntoViewIfNeeded();
    assert.equal(await gallery.locator('[data-testid^="company-gallery-image-"]').count(), 6);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `No body overflow at ${width}px`);
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: metadata, images, hero keyboard action, eight leadership profiles, gallery retained, no overflow or console/hydration errors.`);
    await context.close();
  }
} finally {
  await browser.close();
}
