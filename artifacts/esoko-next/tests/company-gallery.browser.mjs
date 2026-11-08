// Database-free browser check. Run against the development preview:
// node artifacts/esoko-next/tests/company-gallery.browser.mjs
import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";

const origin = process.argv.slice(2).find(argument => /^https?:\/\//.test(argument))
  || `https://${process.env.REPLIT_DEV_DOMAIN}`;
const browser = await launchBrowser();
try {
  for (const width of process.argv.includes("--failure-only") ? [] : [360, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1100 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(`${origin}/esoko-next/company/`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    const html = await response.text();
    assert.match(html, /<title>[^<]*Esoko/i);
    assert.match(html, /<meta[^>]*property="og:title"/);
    assert.match(html, /<meta[^>]*property="og:image"/);
    assert.match(html, /<meta[^>]*name="robots"[^>]*noindex/);
    const gallery = page.locator("#gallery");
    await gallery.scrollIntoViewIfNeeded();
    if (width === 360) {
      await gallery.evaluate(element => element.scrollIntoView({ behavior: "instant", block: "start" }));
      assert.equal(await gallery.evaluate(element => getComputedStyle(element).scrollMarginTop), "160px",
        "Gallery anchors must clear both fixed navigation bars on mobile.");
      const eyebrow = await gallery.locator(".company-gallery__eyebrow").boundingBox();
      const navigation = await page.getByRole("button", { name: "Gallery", exact: true }).boundingBox();
      assert.ok(eyebrow.y > navigation.y + navigation.height);
    }
    const cards = gallery.locator('[data-testid^="company-gallery-image-"]');
    assert.equal(await cards.count(), 6);
    assert.ok(await page.evaluate(() => document.body.scrollWidth <= innerWidth));
    for (const button of await gallery.locator(".company-gallery__filter").all()) {
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
    }
    const first = cards.first();
    await first.focus();
    assert.notEqual(await first.evaluate(element => getComputedStyle(element).outlineWidth), "0px");
    await first.press("Enter");
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    assert.equal(await gallery.evaluate(element => Boolean(element.closest("[inert]"))), true);
    assert.equal(await page.locator("body").evaluate(element => element.style.overflow), "hidden");
    const close = page.getByTestId("gallery-lightbox-close");
    const next = page.getByTestId("gallery-lightbox-next");
    assert.equal(await close.evaluate(element => element === document.activeElement), true);
    for (const button of await dialog.locator("button").all()) {
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
    }
    await page.keyboard.press("Shift+Tab");
    assert.equal(await next.evaluate(element => element === document.activeElement), true);
    await page.keyboard.press("Tab");
    assert.equal(await close.evaluate(element => element === document.activeElement), true);
    await page.keyboard.press("ArrowLeft");
    await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.getAttribute("aria-label")?.startsWith("Photo 12 of 12:"));
    assert.equal(await dialog.locator("img").evaluate(element => getComputedStyle(element).objectFit), "contain");
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector('[role="dialog"]')?.getAttribute("aria-label")?.startsWith("Photo 1 of 12:"));
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "detached" });
    assert.equal(await first.evaluate(element => element === document.activeElement), true);
    assert.equal(await gallery.evaluate(element => Boolean(element.closest("[inert]"))), false);
    assert.equal(await page.locator("body").evaluate(element => element.style.overflow), "");
    for (const [category, count] of [["Field work", 2], ["Technology", 3], ["Agriculture", 4], ["Team & communities", 3]]) {
      const filter = gallery.getByRole("button", { name: category, exact: true });
      await filter.click();
      assert.equal(await cards.count(), count);
      assert.equal(await filter.getAttribute("aria-pressed"), "true");
    }
    await page.getByTestId("gallery-filter-all").click();
    await page.getByTestId("gallery-view-more").click();
    assert.equal(await cards.count(), 12);
    const images = gallery.locator(".company-gallery__image-wrap img");
    assert.equal(await images.count(), 12);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(element => element.decode());
      assert.ok(await image.evaluate(element => element.naturalWidth > 0));
      // The repository's trailingSlash configuration adds / before the query.
      assert.match(await image.evaluate(element => element.currentSrc), /\/_next\/image\/?\?/);
      assert.notEqual(await image.getAttribute("loading"), "eager");
    }
    assert.ok(await page.evaluate(() => document.body.scrollWidth <= innerWidth));
    assert.ok(parseFloat(await images.first().evaluate(element => getComputedStyle(element).transitionDuration)) <= 0.001);
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: metadata, all 12 optimized images, filters, keyboard, focus, scroll cleanup, reduced motion, no overflow/errors.`);
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 360, height: 1100 } });
  let blocked = 0;
  await context.route(url => url.pathname.replace(/\/$/, "").endsWith("/_next/image"), route => {
    const source = new URL(route.request().url()).searchParams.get("url");
    if (source?.endsWith("/about-hero.jpg")) {
      blocked++;
      return route.abort();
    }
    return route.continue();
  });
  const page = await context.newPage();
  await page.goto(`${origin}/esoko-next/company/`, { waitUntil: "networkidle" });
  const gallery = page.locator("#gallery");
  await gallery.scrollIntoViewIfNeeded();
  await gallery.getByText("Image unavailable", { exact: true }).waitFor();
  assert.ok(blocked > 0, "The failure simulation must actually intercept the optimized image.");
  await page.getByTestId("company-gallery-image-market").click();
  await page.getByText("This image could not be displayed.", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  console.log("PASS thumbnail and lightbox failure fallbacks; viewer remains closable.");
  await context.close();
} finally {
  await browser.close();
}
