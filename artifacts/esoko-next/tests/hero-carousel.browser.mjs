// Read-only production/preview checks. No form submission or API mutation.
import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";

const origin = process.argv[2] || `https://${process.env.REPLIT_DEV_DOMAIN}`;
const browser = await launchBrowser();
const expected = [
  "Connecting last-mile communities with services through digital innovation",
  "Empowering agricultural trade with innovative solutions",
  "One platform, six integrated services",
];
try {
  for (const [width, height] of [[360, 800], [360, 1000], [768, 1000], [1024, 1000], [1440, 1000]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    await context.route("**/*", route => ["GET", "HEAD", "OPTIONS"].includes(route.request().method()) ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto(`${origin}/esoko-next/`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    const html = await response.text();
    for (const text of expected) assert.ok(html.includes(text), `Server HTML: ${text}`);
    assert.match(html, /property="og:title"/);
    assert.match(html, /name="robots"[^>]*noindex/);
    const hero = page.locator("#top");
    const serverPictures = await page.evaluate(raw => new DOMParser().parseFromString(raw, "text/html").querySelector("#top").querySelectorAll("picture").length, html);
    assert.equal(serverPictures, 1, "Only first photograph is in initial server HTML");
    assert.equal(await hero.locator("h1").count(), 1);
    assert.equal(await hero.locator("h2").count(), 2);
    for (const button of await hero.locator("button").all()) {
      const box = await button.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44);
    }
    const timing = await page.evaluate(() => ({
      load: performance.getEntriesByType("navigation")[0].loadEventStart,
      requests: performance.getEntriesByType("resource").filter(r => /marketplace-(desktop|mobile)|service-pillars-(desktop|mobile)/.test(decodeURIComponent(r.name))).map(r => ({ name: r.name, start: r.startTime, bytes: r.encodedBodySize })),
    }));
    assert.ok(timing.requests.length >= 2);
    for (const request of timing.requests) assert.ok(request.start >= timing.load, "Later image request must follow load");
    const positions = [];
    for (let slide = 0; slide < 3; slide++) {
      const dot = hero.getByRole("button", { name: new RegExp(`^Slide ${slide + 1} of 3:`) });
      await dot.focus();
      await dot.press("Enter");
      await page.waitForFunction(index => document.querySelectorAll("#top .esoko-carousel-slide")[index].getAttribute("aria-hidden") === "false", slide);
      const active = hero.locator(".esoko-carousel-slide.is-active");
      assert.equal(await active.locator("h1,h2").textContent().then(s => s.replace(/\s+/g, " ").trim()), expected[slide]);
      assert.equal(await hero.locator(".esoko-carousel-slide[inert]").count(), 2);
      assert.equal(await hero.locator(".esoko-carousel-picture.is-active img").evaluate(img => img.complete && img.naturalWidth > 0), true);
      assert.equal(await active.locator("a").first().getAttribute("href"), ["/esoko-next/demo/", "/esoko-next/solutions/marketplace/", "/esoko-next/products-services/"][slide]);
      const kicker = await active.locator(".qsr-kicker").boundingBox();
      const cta = await active.locator("a").first().boundingBox();
      for (const link of await active.locator("a").all()) {
        assert.ok(await link.evaluate(e => {
          const r = e.getBoundingClientRect();
          return e.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
        }), "Hero actions must not be covered by floating shortcuts");
      }
      positions.push({ kicker: kicker.y, cta: cta.y });
      assert.equal(await active.evaluate(e => getComputedStyle(e.parentElement).transitionDuration), "0s", "Reduced motion removes crossfade");
      if ([360, 1440].includes(width)) await page.screenshot({ path: `/tmp/hero-integrated-${slide + 1}-${width}.png` });
    }
    assert.ok(positions.every(position => Math.abs(position.kicker - positions[0].kicker) < 1 && Math.abs(position.cta - positions[0].cta) < 1), "Same message and CTA anchor positions");
    const next = hero.getByRole("button", { name: "Next slide", exact: true });
    await next.focus();
    assert.notEqual(await next.evaluate(e => getComputedStyle(e).outlineStyle), "none");
    await next.press("Enter");
    await page.waitForFunction(() => document.querySelector("#top .esoko-carousel-dot[aria-current=true]").getAttribute("aria-label").startsWith("Slide 1"));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}`);
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}×${height}px: all three slides, server HTML, mapped links, deferred images, keyboard, inert slides, fixed positions, reduced motion, no console/hydration errors.`);
    console.log(JSON.stringify({ width, timing }));
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(`${origin}/esoko-next/`, { waitUntil: "networkidle" });
  await page.clock.install();
  const active = () => page.locator("#top .esoko-carousel-dot[aria-current=true]").getAttribute("aria-label");
  await page.mouse.move(500, 500);
  await page.clock.fastForward(8000);
  assert.match(await active(), /^Slide 1/);
  await page.mouse.move(10, 10); // Fixed navigation, outside the hero's event subtree.
  await page.clock.fastForward(7100);
  await page.waitForFunction(() => document.querySelector("#top .esoko-carousel-dot[aria-current=true]").getAttribute("aria-label").startsWith("Slide 2"));
  const next = page.getByRole("button", { name: "Next slide", exact: true }).first();
  await next.focus();
  await page.clock.fastForward(8000);
  assert.match(await active(), /^Slide 2/, "Focus pauses automatic advances");
  await next.press("Enter");
  await page.waitForFunction(() => document.querySelector("#top .esoko-carousel-dot[aria-current=true]").getAttribute("aria-label").startsWith("Slide 3"));
  await next.evaluate(e => e.blur());
  await page.mouse.move(10, 10);
  await page.clock.fastForward(20000);
  assert.match(await active(), /^Slide 3/, "Manual interaction permanently stops autoplay");
  await page.locator("#top").dispatchEvent("pointerdown", { pointerType: "touch", clientX: 300, clientY: 500 });
  await page.locator("#top").dispatchEvent("pointerup", { pointerType: "touch", clientX: 200, clientY: 500 });
  await page.waitForFunction(() => document.querySelector("#top .esoko-carousel-dot[aria-current=true]").getAttribute("aria-label").startsWith("Slide 1"));
  console.log("PASS autoplay: hover/focus pause, seven-second advance, permanent manual stop and swipe.");
  await context.close();
} finally {
  await browser.close();
}
