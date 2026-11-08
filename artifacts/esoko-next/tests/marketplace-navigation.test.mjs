import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { siteHref } from "../src/lib/site-links.ts";

const navbar = await readFile(new URL("../src/components/site/Navbar.tsx", import.meta.url), "utf8");

test("Products & Platforms Marketplace opens the existing internal overview", () => {
  const entry = navbar.match(/\{ label: 'Marketplace',[^\n]+/g);
  assert.equal(entry?.length, 1, "one shared entry serves desktop and mobile");
  assert.match(entry[0], /icon: ShoppingCart/);
  assert.match(entry[0], /desc: 'Connect Farmers to Buyers'/);
  assert.match(entry[0], /href: '\/solutions\/marketplace'/);
  assert.doesNotMatch(entry[0], /external: true|https:|target:/);
  assert.equal(siteHref("/solutions/marketplace"), "/esoko-next/solutions/marketplace/");
});

test("both product menus use the same-tab internal renderer and close on navigation", () => {
  const desktop = navbar.slice(navbar.indexOf('const sharedCls = "w-full'), navbar.indexOf("  function NavMenuLink("));
  const mobile = navbar.slice(navbar.indexOf("function MobileNavSection"), navbar.indexOf("function ResourcesMobileSection"));
  for (const [name, source] of [["desktop", desktop], ["mobile", mobile]]) {
    const internal = source.match(/: link\.href \? \(\s*(<Link[\s\S]*?)<\/Link>/)?.[1];
    assert.ok(internal, `${name} has an internal link branch`);
    assert.match(internal, /href=\{link.href\}/);
    assert.match(internal, /handleNavLinkClick\(link.href!, onClose\)/);
    assert.doesNotMatch(internal, /target=|opens in a new tab/);
  }
});

test("other platform navigation destinations remain external", () => {
  for (const url of ["https://insyt-survey.esoko.com/", "https://push.esoko.com/", "https://content-web.esoko.com/"]) {
    const entry = navbar.split("\n").find(line => line.includes(`href: '${url}'`));
    assert.ok(entry);
    assert.match(entry, /external: true/);
  }
});
