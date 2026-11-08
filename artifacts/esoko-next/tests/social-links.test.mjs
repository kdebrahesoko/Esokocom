import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { SITE_SOCIAL_LINKS } from "../src/lib/site-config.ts";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("social site config contains exactly the five approved organisation profiles", () => {
  assert.deepEqual(SITE_SOCIAL_LINKS.map(p => [p.name, p.href]), [
    ["Facebook", "https://www.facebook.com/EsokoNews"],
    ["Instagram", "https://www.instagram.com/esoko_news"],
    ["LinkedIn", "https://www.linkedin.com/company/1402657"],
    ["X", "https://x.com/Esoko"],
    ["YouTube", "https://www.youtube.com/user/esokonetworks"],
  ]);
  assert.equal(new Set(SITE_SOCIAL_LINKS.map(p => p.href)).size, 5);
  for (const profile of SITE_SOCIAL_LINKS) {
    assert.ok(profile.context.trim());
    assert.equal(new URL(profile.href).search, "");
  }
});

test("social destinations are declared only once in application source", async () => {
  const root = new URL("../src/", import.meta.url);
  const files = await readdir(root, { recursive: true });
  for (const relative of files.filter(f => /\.[cm]?[jt]sx?$/.test(f) && f !== "lib/site-config.ts")) {
    const source = await readFile(new URL(relative, root), "utf8");
    for (const profile of SITE_SOCIAL_LINKS) assert.ok(!source.includes(profile.href), `${relative}: duplicates ${profile.name} URL`);
  }
});

test("shared social links have safe new-tab labels and inline brand SVGs without widgets or tracking", async () => {
  const component = await read("../src/components/site/SocialLinks.tsx");
  const icon = await read("../src/components/site/SocialBrandIcon.tsx");
  const section = await read("../src/components/home/sections/SocialFollowSection.tsx");
  const footer = await read("../src/components/site/Footer.tsx");
  assert.match(component, /SITE_SOCIAL_LINKS\.map/);
  assert.match(component, /href=\{platform.href\}/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /aria-label=\{`Esoko on \$\{platform.name\} \(opens in a new tab\)`\}/);
  assert.match(icon, /viewBox="0 0 24 24"/);
  assert.match(icon, /aria-hidden="true"/);
  assert.match(icon, /fill="currentColor"/);
  assert.match(section, /Follow our work in the field/);
  assert.match(section, /<SocialLinks\s*\/>/);
  assert.match(footer, /<SocialLinks compact\s*\/>/);
  assert.doesNotMatch(component + section + icon, /["']use client["']|useEffect|onClick|fetch\(|<script|iframe|trackEvent/);
  const css = await read("../src/components/site/social-links.css");
  assert.match(css, /:focus-visible/);
  assert.match(css, /--social-orange: #c0570c/);
  assert.match(css, /--social-orange: hsl\(var\(--brand\)\)/);
  assert.doesNotMatch(css, /@import|animation:|transition:|gradient|box-shadow/);
});

test("Organization schema derives sameAs from the same site config and remains homepage-only", async () => {
  const metadata = await read("../src/lib/page-metadata.ts");
  assert.match(metadata, /import \{ SITE_SOCIAL_LINKS \} from "\.\/site-config"/);
  assert.match(metadata, /sameAs: SITE_SOCIAL_LINKS\.map\(profile => profile.href\)/);
  const home = await read("../src/app/page.tsx");
  assert.equal((home.match(/__html: organizationJsonLd\(\)/g) ?? []).length, 1);
  const company = await read("../src/app/company/page.tsx");
  assert.doesNotMatch(company, /organizationJsonLd/);
});
