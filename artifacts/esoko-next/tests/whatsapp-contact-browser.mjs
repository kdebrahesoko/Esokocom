// Run from the repository root against the preview. No real WhatsApp requests.
import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";
import { WHATSAPP_CHAT_URL } from "../src/lib/whatsapp.ts";

const origin = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : process.env.ESOKO_CHECK_ORIGIN;
assert.ok(origin, "A preview origin is required.");
const base = new URL("/esoko-next/", origin).href;
const browser = await launchBrowser();
try {
  for (const width of [360, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 874 } });
    const intercepted = [];
    await context.route("**/*", route => {
      if (new URL(route.request().url()).hostname === "wa.me") {
        intercepted.push(route.request().url());
        return route.abort();
      }
      return ["GET", "HEAD"].includes(route.request().method()) ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const path of ["company/", ""]) {
      assert.equal((await page.goto(new URL(path, base).href, { waitUntil: "networkidle" })).status(), 200);
      const chat = page.getByRole("link", { name: "Chat on WhatsApp (opens in a new tab)", exact: true });
      assert.equal(await chat.count(), 1);
      assert.equal(await chat.getAttribute("href"), WHATSAPP_CHAT_URL);
      const box = await chat.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
      assert.ok(box.x >= 0 && box.x + box.width <= width);
      assert.ok(box.y >= 0 && box.y + box.height <= 874);
      await chat.focus();
      assert.notEqual(await chat.evaluate(el => getComputedStyle(el).outlineWidth), "0px");
      await page.emulateMedia({ reducedMotion: "reduce" });
      assert.equal(await chat.evaluate(el => el.getAnimations().length), 0);

      if (path === "") {
        const demo = page.locator(".floating-demo-shortcut");
        assert.equal(await demo.count(), 0, "Demo must retain its scroll trigger.");
        await page.evaluate(() => window.scrollTo(0,
          (document.documentElement.scrollHeight - innerHeight) * 0.45));
        await demo.waitFor({ state: "visible" });
        await page.waitForFunction(() =>
          Number(getComputedStyle(document.querySelector(".floating-demo-shortcut")).opacity) >= 0.99);
        const demoBox = await demo.boundingBox();
        const chatBox = await chat.boundingBox();
        // Twenty extra pixels also cover the demo entrance/exit translation.
        assert.ok(demoBox.y + demoBox.height + 20 <= chatBox.y, "Floating shortcuts collide.");
        assert.equal(await demo.getByRole("link", { name: "Book a Demo", exact: true }).getAttribute("href"),
          "/esoko-next/demo/");
        await demo.getByRole("button", { name: "Dismiss Book a Demo shortcut" }).click();
        await demo.waitFor({ state: "detached" });
        assert.ok(await chat.isVisible());
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await demo.count(), 0, "Demo dismissal must survive reload.");
        assert.ok(await chat.isVisible());
        assert.equal(await page.evaluate(() => document.body.scrollWidth), width);
      }
    }

    const chat = page.getByRole("link", { name: "Chat on WhatsApp (opens in a new tab)", exact: true });
    const popupPromise = context.waitForEvent("page");
    const requestPromise = context.waitForEvent("request", {
      predicate: request => request.url().startsWith("https://wa.me/"),
    });
    await chat.focus();
    await chat.press("Enter");
    const [popup, request] = await Promise.all([popupPromise, requestPromise]);
    assert.equal(request.url(), new URL(WHATSAPP_CHAT_URL).href);
    await popup.close();
    assert.equal(intercepted.length, 1);
    assert.deepEqual(errors, [], `${width}px browser errors`);
    console.log(`PASS ${width}px: Company/home visibility, focus, touch size, no overflow, separate demo controls, persistent dismissal and intercepted keyboard launch.`);
    await context.close();
  }
  for (const path of ["resources/", "careers/", "products-services/", "sectors/", "pricing/", "demo/", "#contact"]) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes('aria-label="WhatsApp contact"'), `${path}: shared shortcut missing`);
    assert.ok(html.includes("https://wa.me/233552783253?text="));
    assert.match(html, /name="robots" content="[^"]*noindex/);
    console.log(`PASS server-rendered shared shortcut/noindex: ${path}`);
  }
} finally {
  await browser.close();
}
