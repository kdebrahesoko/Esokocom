// Read-only navigation checks; never open external platforms or submit forms.
import assert from "node:assert/strict";
import { launchBrowser } from "../../esoko-website/tests/browser.mjs";

const origin = `https://${process.env.REPLIT_DEV_DOMAIN}`;
const path = "/esoko-next/products-services/";
const browser = await launchBrowser();
try {
  for (const width of process.argv.length > 2 ? process.argv.slice(2).map(Number) : [360, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    await page.route("**/*", route => ["GET", "HEAD", "OPTIONS"].includes(route.request().method()) ? route.continue() : route.abort());
    const errors = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", error => errors.push(error.message));
    assert.equal((await page.goto(origin + path, { waitUntil: "networkidle" })).status(), 200);
    const mobile = width < 1280; // Match the existing xl breakpoint, including tablet widths.
    const toggle = page.locator('[aria-controls="site-mobile-menu"]');
    const trigger = page.getByTestId(mobile ? "mobile-nav-products & services" : "nav-products & services");
    async function open() {
      if (mobile) await toggle.click();
      await trigger.focus();
      await page.keyboard.press("Enter");
    }
    await open();
    const menu = page.locator(mobile ? "#site-mobile-menu" : "#site-menu-products-services");
    const ecosystem = menu.getByRole("group", { name: "Esoko Platform Ecosystem", exact: true });
    const overview = ecosystem.getByRole("link", { name: "Esoko Platform Ecosystem", exact: true });
    await overview.waitFor({ state: "visible" });
    const links = await ecosystem.locator("a").evaluateAll(nodes => nodes.map(a => ({
      label: a.textContent.trim(), href: a.getAttribute("href"), target: a.target, rel: a.rel,
    })));
    assert.equal(links.length, 4, "Overview plus exactly three platform children");
    assert.equal(links[0].label, "Esoko Platform Ecosystem");
    assert.equal(links[0].href, path);
    for (const [index, label, href] of [
      [1, "Insyt & Survey", "https://insyt-survey.esoko.com/"],
      [2, "Push Messaging", "https://push.esoko.com/"],
      [3, "E Content", "https://content-web.esoko.com/"],
    ]) {
      assert.ok(links[index].label.startsWith(label));
      assert.equal(links[index].href, href);
      assert.equal(links[index].target, "_blank");
      assert.match(links[index].rel, /noopener/);
      assert.match(links[index].rel, /noreferrer/);
    }
    const marketplace = menu.getByRole("group", { name: "Other products", exact: true }).getByRole("link", { name: /Marketplace/ });
    assert.equal(await marketplace.getAttribute("href"), "/esoko-next/solutions/marketplace/");
    assert.equal(await marketplace.getAttribute("target"), null);
    assert.equal(await ecosystem.getByRole("link", { name: /Marketplace/ }).count(), 0);
    for (const link of await ecosystem.locator("a").all()) {
      const box = await link.boundingBox();
      assert.ok(box.width >= 44 && box.height >= 44, "44px touch targets");
    }
    await overview.focus();
    assert.ok(await overview.evaluate(a => {
      const style = getComputedStyle(a);
      return a.matches(":focus-visible") && style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
    }), "The overview has a visible keyboard focus outline");
    await page.keyboard.press("Tab");
    assert.equal(await ecosystem.locator("a").nth(1).evaluate(a => a === document.activeElement), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if ([360, 1440].includes(width)) {
      await overview.focus();
      await page.screenshot({ path: `/tmp/esoko-ecosystem-menu-${width}.png` });
    }
    await page.keyboard.press("Escape");
    await menu.waitFor({ state: "hidden" });
    if (!mobile) assert.equal(await trigger.evaluate(button => button === document.activeElement), true);
    await open();
    await Promise.all([page.waitForURL(origin + path), overview.click()]);
    await menu.waitFor({ state: "hidden" });
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: exact three-child group, overview route, separate Marketplace, touch targets, focus, Tab/Enter/Escape, menu closing and no console/hydration errors.`);
    await page.close();
  }
} finally {
  await browser.close();
}
