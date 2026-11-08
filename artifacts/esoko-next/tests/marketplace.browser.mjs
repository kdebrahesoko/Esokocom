// Read-only browser checks: no form submissions or data mutations.
import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";

const origin = process.argv[2] || `https://${process.env.REPLIT_DEV_DOMAIN}`;
const browser = await launchBrowser();
try {
  for (const width of [360, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    await page.route("**/*", route => ["GET", "HEAD", "OPTIONS"].includes(route.request().method()) ? route.continue() : route.abort());
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(`${origin}/esoko-next/solutions/marketplace/`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    const html = await response.text();
    assert.ok(html.includes("Empowering agricultural trade with innovative solutions"));
    assert.match(html, /property="og:title"/);
    assert.match(html, /property="og:image"[^>]*marketplace-social/);
    assert.match(html, /name="twitter:card"[^>]*summary_large_image/);
    assert.match(html, /name="robots"[^>]*noindex/);
    assert.equal(await page.locator("main h1").count(), 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    for (const link of await page.locator("a.mp-primary").all()) {
      assert.equal(await link.getAttribute("href"), "https://marketplace.esoko.com/");
      assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
      const box = await link.boundingBox();
      assert.ok(box.height >= 44 && box.width >= 44);
    }
    await page.locator(".mp-actions .mp-primary").scrollIntoViewIfNeeded();
    assert.ok(await page.locator(".mp-actions .mp-primary").evaluate(link => {
      const box = link.getBoundingClientRect();
      return link.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
    }), "Hero action must not be obscured by the shared navigation or WhatsApp control");
    for (const image of await page.locator(".mp-photo img").all()) {
      assert.ok(await image.getAttribute("srcset"));
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
    }
    const buttons = page.locator(".mp-gallery-item");
    assert.equal(await buttons.count(), 6);
    for (const button of await buttons.all()) {
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
    }
    await buttons.first().focus();
    await page.keyboard.press("Enter");
    await page.locator("dialog").waitFor({ state: "visible" });
    assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
    await page.keyboard.press("ArrowRight");
    assert.match(await page.locator("dialog figcaption").innerText(), /2 of 6/);
    await page.keyboard.press("ArrowLeft");
    assert.match(await page.locator("dialog figcaption").innerText(), /1 of 6/);
    for (let index = 0; index < 6; index++) {
      await page.keyboard.press("Tab");
      assert.ok(await page.evaluate(() => !!document.activeElement.closest("dialog")));
    }
    await page.keyboard.press("Shift+Tab");
    assert.ok(await page.evaluate(() => !!document.activeElement.closest("dialog")));
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").evaluate(dialog => dialog.open), false);
    assert.equal(await buttons.first().evaluate(button => button === document.activeElement), true);
    assert.notEqual(await page.evaluate(() => document.body.style.overflow), "hidden");
    await page.locator("a.mp-secondary").click();
    assert.ok(page.url().endsWith("#how-it-works"));
    assert.deepEqual(errors, []);
    if ([360, 1440].includes(width)) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/marketplace-integrated-${width}.png`, fullPage: true });
    }
    console.log(`PASS ${width}px: metadata, responsive images, layout, links, gallery keyboard/focus/scroll restoration and no console errors.`);
    await page.close();
  }
} finally {
  await browser.close();
}
