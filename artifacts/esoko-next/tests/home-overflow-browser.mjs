// Run from the repository root against the running development preview.
// GET-only: no submissions, API mutations, or saved environment changes.
import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";

const origin = process.env.ESOKO_CHECK_ORIGIN ||
  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "");
assert.ok(origin, "Set ESOKO_CHECK_ORIGIN or run in the preview workspace.");
const browser = await launchBrowser();
try {
  for (const width of [360, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 874 } });
    await context.route("**/*", route =>
      ["GET", "HEAD"].includes(route.request().method()) ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });
    const response = await page.goto(new URL("/esoko-next/", origin).href, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    async function check(stage) {
      const metrics = await page.evaluate(() => ({
        viewport: innerWidth,
        body: document.body.scrollWidth,
        document: document.documentElement.scrollWidth,
        rootOverflow: [document.body, document.documentElement].map(el => getComputedStyle(el).overflowX),
      }));
      assert.equal(metrics.body, width, `${width}px ${stage}: body overflow`);
      assert.equal(metrics.document, width, `${width}px ${stage}: document overflow`);
      assert.ok(metrics.rootOverflow.every(value => !["hidden", "clip"].includes(value)),
        "Global clipping must not hide the problem.");
    }
    await check("before scroll reveals");
    const codeCard = page.locator("main section").filter({ has: page.getByRole("heading", { name: "Build on Esoko" }) })
      .locator(".shadow-2xl");
    const contactCard = page.locator("#contact .rounded-3xl");
    for (const [name, card] of [["developer", codeCard], ["contact", contactCard]]) {
      await card.scrollIntoViewIfNeeded();
      await check(`${name} reveal`);
      // Framer Motion drives these transforms with requestAnimationFrame,
      // rather than Element.getAnimations(); wait for its actual final state.
      await page.waitForFunction(el => {
        const transform = getComputedStyle(el).transform;
        return transform === "none" ||
          Math.abs(new DOMMatrixReadOnly(transform).m42) < 0.01;
      }, await card.elementHandle());
      await check(`after ${name} reveal`);
    }
    assert.deepEqual(errors, [], `${width}px browser errors`);
    console.log(`PASS ${width}px: no page overflow before, during or after reveals; no global clipping or browser errors.`);
    await context.close();
  }
} finally {
  await browser.close();
}
