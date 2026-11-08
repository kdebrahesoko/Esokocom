import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = file => readFile(new URL(file, import.meta.url), "utf8");

test("the trust showcase occupies a server-rendered slot immediately after the hero", async () => {
  const home = await read("../src/app/page.tsx");
  const opening = await read("../src/components/home/QuietSignalOpening.tsx");
  assert.match(home, /<QuietSignalOpening afterHero=\{\s*<>\s*<TrustSection\s*\/>\s*<WhoIsEsokoSection\s*\/>\s*<\/>\s*\} \/>/);
  assert.equal((home.match(/<TrustSection\s*\/>/g) ?? []).length, 1);
  assert.match(opening, /<\/section>\s*\{afterHero\}\s*<section className="qsr-about"/);
  assert.match(opening, /afterHero\?: ReactNode/);
  assert.doesNotMatch(opening, /["']use client["']/);
});

test("the homepage leadership heading links to the existing Company team anchor", async () => {
  const section = await read("../src/components/home/sections/LeadershipSection.tsx");
  const company = await read("../src/components/company/TeamSection.tsx");
  assert.match(section, /<SiteLink\s+href="\/company#team"[\s\S]*?>\s*Our Leadership Team\s*<\/SiteLink>/);
  assert.match(section, /focus-visible:outline-primary/);
  assert.match(company, /<section id="team"/);
});

test("both Get Started controls use ordinary external anchors and retain menu closure", async () => {
  const navbar = await read("../src/components/site/Navbar.tsx");
  assert.match(navbar, /const GET_STARTED_HREF = 'https:\/\/insyt-survey\.esoko\.com\/';/);
  assert.match(navbar, /<a href=\{GET_STARTED_HREF\} data-testid="nav-get-started" onClick=\{\(\) => setActiveMenu\(null\)\}>/);
  assert.match(navbar, /<a href=\{GET_STARTED_HREF\} data-testid="mobile-get-started" onClick=\{\(\) => setMobileOpen\(false\)\}>/);
  for (const id of ["nav-pricing", "mobile-pricing"]) {
    assert.match(navbar, new RegExp(`<Link\\s+href="/pricing"[\\s\\S]*?data-testid="${id}"`));
  }
});
