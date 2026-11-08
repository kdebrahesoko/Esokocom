import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("every requested Marketplace and service-pillar message is server-authored", async () => {
  const source = await read("../src/components/home/HomepageHero.tsx");
  for (const text of [
    "Esoko Marketplace", "Empowering agricultural trade with innovative solutions",
    "Trade directly with farmers and wholesalers, without intermediaries.", "See how it works",
    "Our core service pillars", "One platform, six integrated services", "Farmer registration:",
    "digital identity, profiling and traceability for over 800,000 smallholders in Ghana",
    "Agronomy and extension:", "expert advice, weather intelligence and market price alerts, delivered by SMS, voice and call centre",
    "Explore all six pillars",
  ]) assert.ok(source.includes(text), text);
  assert.equal((source.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((source.match(/<h2\b/g) ?? []).length, 2);
  assert.match(source, /href="\/solutions\/marketplace\/"/);
  assert.match(source, /href="\/products-services\/"/);
});

test("controller defers later images until load, gates activation on readiness and isolates hidden slides", async () => {
  const source = await read("../src/components/home/HeroCarouselClient.tsx");
  assert.match(source, /index !== 0 && !pageLoaded/);
  assert.match(source, /window\.addEventListener\("load", loaded, \{ once: true \}\)/);
  assert.match(source, /pending !== null && ready\.includes\(pending\)/);
  assert.match(source, /aria-hidden=\{index !== active\} inert=\{index !== active\}/);
  assert.match(source, /7000/);
  assert.match(source, /stopped \|\| hovered \|\| focused \|\| hidden \|\| reducedMotion !== false/);
  assert.match(source, /setStopped\(true\)/);
  assert.match(source, /onPointerCancel/);
  assert.match(source, /onError/);
  assert.match(source, /placeholder="blur"/);
  assert.doesNotMatch(source, /framer-motion|embla|Math\.random|Date\.now/);
});

test("all new photography is WebP under size budgets with no EXIF or GPS metadata", async () => {
  for (const name of ["marketplace", "service-pillars"]) {
    for (const size of ["desktop", "mobile"]) {
      const bytes = await readFile(new URL(`../public/site-assets/home/${name}-${size}.webp`, import.meta.url));
      assert.ok(bytes.length < (size === "mobile" ? 100_000 : 250_000));
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
      assert.doesNotMatch(bytes.toString("latin1"), /EXIF|XMP |ICCP/);
    }
  }
});

test("carousel CSS reserves its layout and disables crossfades for reduced motion", async () => {
  const css = await read("../src/components/home/hero-carousel.css");
  assert.match(css, /height: 32rem/);
  assert.match(css, /height: 38rem/);
  assert.match(css, /width: 2\.75rem/);
  assert.match(css, /height: 2\.75rem/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*transition: none/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|@import|DM Sans|Geist/gi);
});
