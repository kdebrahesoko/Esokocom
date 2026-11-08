import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { ISSUE_REPORTING_URL } from "../src/lib/site-config.ts";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("Documentation uses the single approved issue-portal destination", async () => {
  assert.equal(ISSUE_REPORTING_URL, "https://issues.esoko.com/");
  const navbar = await read("../src/components/site/Navbar.tsx");
  assert.match(navbar, /label: 'Documentation'[^\n]*desc: 'Report an issue'[^\n]*href: ISSUE_REPORTING_URL, external: true/);
  assert.doesNotMatch(navbar, /https:\/\/issues\.esoko\.com/);
  assert.match(navbar, /label: 'Reports'[^\n]*href: '\/resources\/reports'/);
  assert.match(navbar, /label: 'Developer Hub'[^\n]*href: undefined/);
});

test("desktop and mobile Resources distinguish external links safely without changing internal navigation", async () => {
  const navbar = await read("../src/components/site/Navbar.tsx");
  const desktop = navbar.slice(navbar.indexOf("  function NavMenuLink("), navbar.indexOf("  function NavMenuLink(") + 3100);
  const mobile = navbar.slice(navbar.indexOf("function ResourcesMobileSection"));
  for (const source of [desktop, mobile]) {
    assert.match(source, /link.external && link.href \? \(\s*<a/);
    assert.match(source, /target="_blank"/);
    assert.match(source, /rel="noopener noreferrer"/);
    assert.match(source, /opens in a new tab/);
    assert.match(source, /min-h-11/);
    assert.match(source, /focus-visible:outline-primary/);
    assert.match(source, /onClick=\{onClose\}/);
    assert.match(source, /: link.href \? \(\s*<Link/);
    assert.match(source, /Soon|soon/);
  }
});
