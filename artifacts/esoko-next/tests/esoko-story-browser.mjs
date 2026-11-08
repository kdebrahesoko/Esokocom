import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";

if (!process.env.REPLIT_DEV_DOMAIN) throw new Error("REPLIT_DEV_DOMAIN is required for development-only browser verification.");
const origin = `https://${process.env.REPLIT_DEV_DOMAIN}`;
const videos = [
  ["5TRjt4fyrU0", "Transforming Agriculture with Technology – The Esoko Story"],
  ["NIzzcknUmRY", "Stories from the Field: Northern Ghana"],
  ["QJwhX5rIFmg", "Real Stories, Real Impact"],
];
const browser = await launchBrowser();

try {
  for (const width of [360, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1400 } });
    const requests = [];
    context.on("request", request => requests.push(request.url()));
    // Intercept only activated players: this verifies wiring, not remote playback.
    await context.route("https://www.youtube-nocookie.com/**", route => route.fulfill({
      status: 200, contentType: "text/html", body: "<!doctype html><title>Isolated player wiring check</title>",
    }));
    await context.route("**/api/**", route =>
      ["GET", "HEAD", "OPTIONS"].includes(route.request().method()) ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(`${origin}/esoko-next/`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    const html = await response.text();
    assert.ok(html.includes("Who is Esoko?"));
    assert.ok(html.includes("Esoko was founded in 2008"));
    assert.ok(html.includes('property="og:title"'));
    assert.equal(await page.locator("#who-is-esoko").count(), 1);
    assert.equal(await page.locator("#who-is-esoko").evaluate(section =>
      section.previousElementSibling?.tagName === "SECTION" &&
      /Trusted by Governments/.test(section.previousElementSibling.textContent)), true);
    assert.equal(await page.locator("iframe").count(), 0);
    assert.deepEqual(requests.filter(url =>
      /(^|\.)youtube(-nocookie)?\.com$|(^|\.)googlevideo\.com$/.test(new URL(url).hostname)), []);

    const section = page.locator("#who-is-esoko");
    for (const img of await section.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(element => element.decode());
      assert.match(new URL(await img.getAttribute("src"), origin).pathname, /^\/esoko-next\/_next\/image\/?$/);
    }
    assert.equal(await page.evaluate(() => document.body.scrollWidth), width);
    if ([360, 1440].includes(width)) {
      await section.screenshot({ path: `/tmp/esoko-story-integration-${width}.png` });
    }
    for (const [id, title] of videos) {
      const trigger = section.getByRole("button", { name: `Play video: ${title}`, exact: true });
      await trigger.focus();
      assert.notEqual(await trigger.evaluate(element => getComputedStyle(element).outlineWidth), "0px");
      const box = await trigger.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
      await trigger.press("Enter");
      const iframe = section.locator("iframe");
      assert.equal(await iframe.count(), 1);
      assert.equal(await iframe.getAttribute("src"),
        `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`);
      const stop = section.getByRole("button", { name: `Stop video: ${title}`, exact: true });
      await stop.waitFor();
      await stop.press(id === videos[0][0] ? "Escape" : "Enter");
      await page.waitForFunction(expected =>
        document.activeElement?.getAttribute("aria-label") === expected, `Play video: ${title}`);
      assert.equal(await section.locator("iframe").count(), 0);
    }
    const company = section.getByRole("link", { name: "Learn more about Esoko", exact: true });
    assert.equal(await company.getAttribute("href"), "/esoko-next/company/");
    if (width === 1440) {
      await company.click();
      await page.waitForURL(`${origin}/esoko-next/company/`);
      assert.ok(await page.locator("main").count());
    }
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: SSR copy/order, optimized thumbnails, no initial YouTube players/scripts, all IDs via keyboard, stop/focus, Company link, no overflow/console errors.`);
    await context.close();
  }

  // A failed optimizer/thumbnail must not remove the accessible play control.
  const failureContext = await browser.newContext({ viewport: { width: 360, height: 1000 } });
  await failureContext.route(/\/_next\/image\/?\?/, route =>
    route.request().url().includes("i.ytimg.com") ? route.abort() : route.continue());
  const page = await failureContext.newPage();
  await page.goto(`${origin}/esoko-next/`, { waitUntil: "networkidle" });
  const failedVideo = page.locator("#who-is-esoko .esoko-story-featured");
  await failedVideo.scrollIntoViewIfNeeded();
  await failedVideo.getByText("Preview unavailable.", { exact: false }).waitFor();
  assert.equal(await failedVideo.getByRole("button", { name: `Play video: ${videos[0][1]}`, exact: true }).count(), 1);
  const fallback = failedVideo.getByRole("link", { name: /Watch .* on YouTube/ });
  assert.equal(await fallback.getAttribute("href"), `https://www.youtube.com/watch?v=${videos[0][0]}`);
  assert.equal(await fallback.getAttribute("rel"), "noopener noreferrer");
  assert.equal(await fallback.getAttribute("target"), "_blank");
  await failureContext.close();
  console.log("PASS failed-thumbnail state retains labelled play and safe YouTube fallback.");
} finally {
  await browser.close();
}
