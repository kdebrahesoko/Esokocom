import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("the retained legacy hero preserves its five slides for reference", async () => {
  const original = await readFile(new URL("../../esoko-website/src/components/hero/HeroCarousel.tsx", import.meta.url), "utf8");
  const migrated = await readFile(new URL("../src/components/home/HeroCarousel.tsx", import.meta.url), "utf8");
  const slides = s => s.match(/const SLIDES = \[([\s\S]*?)\] as const;/)?.[1];
  assert.ok(slides(original));
  const normalized = slides(migrated)?.replace(/image: `\$\{ASSET_BASE\}([^`]+)`/g, "image: '$1'")
    .replaceAll("/esoko-next/site-assets/", "/");
  assert.equal(normalized, slides(original));
  assert.equal((slides(migrated).match(/image:/g) ?? []).length, 5);
  assert.match(migrated, /SLIDE_DURATION = 6000/);
});

test("the approved opening and product discovery retain all original sections in source order", async () => {
  const original = await readFile(new URL("../../esoko-website/src/pages/HomePage.tsx", import.meta.url), "utf8");
  const migrated = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const sections = s => [...s.matchAll(/<(\w+Section)\s*\/>/g)].map(m => m[1]);
  const replaced = ["HeroSection", "WhoWeAreSection", "WhyEsokoSection"];
  const expected = sections(original).map(s => s === "ContactSection" ? "ContactHandoffSection" : s).filter(s => !replaced.includes(s));
  assert.deepEqual(sections(migrated).filter(s => s !== "ProductsServicesSection"), expected);
  assert.equal((migrated.match(/<ProductsServicesSection\s*\/>/g) ?? []).length, 1);
  assert.ok(migrated.indexOf("<QuietSignalOpening") < migrated.indexOf("<ProductsServicesSection"));
  assert.ok(migrated.indexOf("<ProductsServicesSection") < migrated.indexOf("<SolutionsSection"));
  assert.match(migrated, /<QuietSignalOpening\s*\/>/);
  assert.equal((migrated.match(/<QuietSignalOpening\s*\/>/g) ?? []).length, 1);
  assert.doesNotMatch(migrated, /<(HeroCarousel|WhoWeAreSection|WhyEsokoSection)\b/);
  assert.ok(migrated.indexOf("<QuietSignalOpening") < migrated.indexOf("<SolutionsSection"));
});

test("the photo hero is the deliberate live replacement, not the archived five-slide carousel", async () => {
  const opening = await readFile(new URL("../src/components/home/QuietSignalOpening.tsx", import.meta.url), "utf8");
  assert.match(opening, /photo-hero-opening/);
  assert.match(opening, /Connecting last-mile communities with services through digital innovation/);
  assert.doesNotMatch(opening, /HeroCarousel|SLIDES|SLIDE_DURATION|A useful message can make the next step clearer/);
});

test("platform demo does not randomize its initial server-rendered marker geometry", async () => {
  const source = await readFile(new URL("../src/components/home/sections/PlatformDemoSection.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /Math\.random\s*\(/);
});
