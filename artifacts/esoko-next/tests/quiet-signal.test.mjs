import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("the three-slide hero retains server-authored text and the unchanged opening sections", async () => {
  const source = await read("../src/components/home/QuietSignalOpening.tsx");
  const hero = await read("../src/components/home/HomepageHero.tsx");
  const controller = await read("../src/components/home/HeroCarouselClient.tsx");
  assert.doesNotMatch(source, /use client|useState|useEffect|Date\.now|Math\.random/);
  assert.doesNotMatch(hero, /use client|useState|useEffect|Date\.now|Math\.random/);
  assert.equal((hero.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((hero.match(/<h2\b/g) ?? []).length, 2);
  assert.match(controller, /id="top"/);
  assert.match(source, /<HomepageHero \/>/);
  assert.deepEqual([...source.matchAll(/<section[^>]*id="([^"]+)"/g)].map(m => m[1]), ["about", "services"]);
  for (const text of [
    "Sustainability, quality and efficiency",
    "Connecting last-mile communities with services through digital innovation",
    "We help organizations improve the quality and efficiency of surveys and last-mile service delivery, and manage development projects seamlessly on one tech-enabled platform.",
    "The decision is local. Information should meet it there.",
    "Support for the work around a farm decision.",
    "Understand what is happening in the field",
    "Share guidance in useful ways",
    "Bring market information within reach",
    "people photo planned",
  ]) assert.ok((source + hero).includes(text), text);
  assert.doesNotMatch(source, /qsr-message-example|<figure[^>]*qsr-hero|HeroCarousel|FloatCard/);
});

test("the approved source-attributed quote and attribution remain exact", async () => {
  const source = await read("../src/components/home/QuietSignalOpening.tsx");
  const original = await read("../../esoko-website/src/data/solutions.ts");
  for (const text of [
    "Now I compare prices from four buyers and choose the best deal.",
    "Mariama Diallo", "Smallholder Maize Farmer", "Northern Region, Ghana",
  ]) {
    assert.ok(source.includes(text), text);
    assert.ok(original.includes(text), `Existing-site evidence: ${text}`);
  }
});

test("the hero uses the approved consented WebP, next/image and mapped links", async () => {
  const source = await read("../src/components/home/HomepageHero.tsx");
  const controller = await read("../src/components/home/HeroCarouselClient.tsx");
  const images = await read("../src/components/home/hero-images.ts");
  assert.match(controller, /import Image, \{ getImageProps \} from "next\/image"/);
  assert.match(source, /SiteLink as Link/);
  assert.match(images, /NEXT_BASE_PATH/);
  assert.match(controller, /sizes="100vw"/);
  assert.match(controller, /\bfill\b/);
  assert.match(controller, /priority=\{index === 0\}/);
  assert.match(images, /Three people looking at a handheld device in a maize field\./);
  assert.equal((controller.match(/<Image\b/g) ?? []).length, 1);
  assert.doesNotMatch(source, /<img|<header|<nav|\/__mockup\/|\/esoko-next\//);
  assert.match(source, /href="\/products-services\/"/);
  assert.match(source, /href="\/demo\/"/);
  assert.match(source, /href="\/solutions\/marketplace\/"/);
  const target = await readFile(new URL("../public/site-assets/home/hero-field.webp", import.meta.url));
  const hash = data => createHash("sha256").update(data).digest("hex");
  // Verified against the approved metadata-stripped copy at graduation. Keep
  // this test portable: sandbox review assets are intentionally Git-ignored.
  assert.equal(hash(target), "21a3cecae2b5bd17fed26ab1fb1b2579eb16c7d2a576fef2c2517d273139db44");
  assert.ok(target.length < 250_000);
  assert.equal(target.toString("ascii", 0, 4), "RIFF");
  assert.equal(target.toString("ascii", 8, 12), "WEBP");
  assert.doesNotMatch(target.toString("latin1"), /EXIF|XMP |ICCP/);
});

test("brand tokens, large-label contrast and reduced-motion focus styles are preserved", async () => {
  const css = await read("../src/components/home/quiet-signal.css");
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|@import|DM Sans|Geist/gi);
  assert.match(css, /hsl\(var\(--brand\)\)/);
  assert.match(css, /font-size: 1\.25rem/);
  assert.match(css, /font-weight: 700/);
  assert.match(css, /\.qsr-hero :focus-visible.*outline-color: hsl\(var\(--background\)\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("photo styling preserves the approved hero-only orange and gentle reduced-motion entrance", async () => {
  const css = await read("../src/components/home/photo-hero.css");
  assert.deepEqual(css.match(/#[0-9a-f]{3,8}\b/gi), ["#C0570C"]);
  assert.match(css, /--hero-brand-accessible: #C0570C/);
  assert.match(css, /background: var\(--hero-brand-accessible\)/);
  assert.match(css, /color: hsl\(var\(--background\)\)/);
  assert.match(css, /object-fit: cover/);
  assert.match(css, /object-position: 55% 25%/);
  assert.match(css, /animation: photo-hero-arrive 560ms/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*animation: none/);
  assert.doesNotMatch(css, /@import|scroll-timeline|animation-timeline|DM Sans|Geist/);
});

test("everything below the hero remains byte-for-byte unchanged", async () => {
  const source = await read("../src/components/home/QuietSignalOpening.tsx");
  const lower = source.slice(source.indexOf('      <section className="qsr-about"'));
  assert.equal(createHash("sha256").update(lower).digest("hex"),
    "c96ba4c3aa68330436bc91759b725583064d90ee868adc489c2c50f25c320d2b");
});
