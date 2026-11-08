// GET-only preview verification. Outbound social navigation is intercepted:
// verifies each launch without loading platform scripts, cookies or trackers.
import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";
import { SITE_SOCIAL_LINKS } from "../src/lib/site-config.ts";

const origin = process.env.ESOKO_CHECK_ORIGIN ||
  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "");
assert.ok(origin, "Run in the preview workspace or supply a preview origin.");
const home = new URL("/esoko-next/", origin).href;

// These checks parse the original response, not the hydrated DOM.
for (const path of ["/esoko-next/", "/esoko-next/company/", "/esoko-next/pricing/"]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200);
  const html = await response.text();
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const organizations = scripts.map(m => JSON.parse(m[1])).filter(o => o["@type"] === "Organization");
  assert.equal(organizations.length, path === "/esoko-next/" ? 1 : 0);
  if (organizations[0]) assert.deepEqual(organizations[0].sameAs, SITE_SOCIAL_LINKS.map(p => p.href));
  for (const profile of SITE_SOCIAL_LINKS) assert.ok(html.includes(`href="${profile.href}"`));
  assert.match(html, /name="robots" content="[^"]*noindex/);
  assert.match(html, /property="og:title"/);
  console.log(`PASS raw HTML: ${path}, social links, metadata/noindex, homepage-only sameAs`);
}

const browser = await launchBrowser();
try {
  for (const width of [360, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const intercepted = [];
    await context.route("**/*", route => {
      const request = route.request();
      if (SITE_SOCIAL_LINKS.some(p => new URL(p.href).hostname === new URL(request.url()).hostname)) {
        intercepted.push(request.url());
        return route.abort();
      }
      return ["GET", "HEAD"].includes(request.method()) ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    assert.equal((await page.goto(home, { waitUntil: "networkidle" })).status(), 200);
    const section = page.locator(".esoko-social-follow");
    assert.equal(await section.count(), 1);
    assert.equal(await section.evaluate(el => el.previousElementSibling?.id), "contact");
    await section.scrollIntoViewIfNeeded();
    for (const [group, location] of [[section, "section"], [page.locator("footer"), "footer"]]) {
      const links = group.locator('a[aria-label^="Esoko on "]');
      assert.equal(await links.count(), 5);
      for (const [i, profile] of SITE_SOCIAL_LINKS.entries()) {
        const link = links.nth(i);
        assert.equal(await link.getAttribute("href"), profile.href);
        assert.equal(await link.getAttribute("target"), "_blank");
        assert.equal(await link.getAttribute("rel"), "noopener noreferrer");
        assert.equal(await link.getAttribute("aria-label"), `Esoko on ${profile.name} (opens in a new tab)`);
        assert.equal(await link.locator("svg").count(), 1);
        await link.scrollIntoViewIfNeeded();
        const box = await link.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44, `${width}px ${location} ${profile.name}: target`);
        assert.ok(box.x >= 0 && box.x + box.width <= width, `${width}px ${profile.name}: fits viewport`);
        await link.focus();
        assert.notEqual(await link.evaluate(el => getComputedStyle(el).outlineStyle), "none");
        assert.equal(await link.evaluate(el => el.getAnimations().length), 0);
        // All ten links are keyboard activated at 360px; other widths check styling.
        if (width === 360) {
          const popupPromise = context.waitForEvent("page");
          const requestPromise = context.waitForEvent("request", { predicate: r => r.url() === new URL(profile.href).href });
          await link.press("Enter");
          const [popup, request] = await Promise.all([popupPromise, requestPromise]);
          assert.equal(request.url(), new URL(profile.href).href);
          await popup.close();
        }
      }
    }
    if (width === 360) assert.equal(intercepted.length, 10);
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await section.evaluate(el => el.getAnimations({ subtree: true }).length), 0);
    assert.equal(await page.evaluate(() => document.body.scrollWidth), width);
    assert.deepEqual(errors, [], `${width}px console/hydration errors`);
    console.log(`PASS ${width}px: section/footer destinations, labels, SVGs, touch targets, focus, no animation/overflow/errors`);
    await context.close();
  }
} finally {
  await browser.close();
}
