import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("the migrated hero preserves the existing five slides verbatim except asset prefix", async () => {
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

test("homepage retains the original section order with an explicit contact handoff", async () => {
  const original = await readFile(new URL("../../esoko-website/src/pages/HomePage.tsx", import.meta.url), "utf8");
  const migrated = await readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8");
  const sections = s => [...s.matchAll(/<(\w+Section)\s*\/>/g)].map(m => m[1]);
  const expected = sections(original).map(s => s === "ContactSection" ? "ContactHandoffSection" : s).filter(s => s !== "HeroSection");
  assert.deepEqual(sections(migrated), expected);
  assert.match(migrated, /<HeroCarousel\s*\/>/);
});

test("platform demo does not randomize its initial server-rendered marker geometry", async () => {
  const source = await readFile(new URL("../src/components/home/sections/PlatformDemoSection.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /Math\.random\s*\(/);
});
