import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("the approved photo hero remains server-rendered with all three opening sections", async () => {
  const source = await read("../src/components/home/QuietSignalOpening.tsx");
  assert.doesNotMatch(source, /use client|useState|useEffect|Date\.now|Math\.random/);
  assert.equal((source.match(/<h1\b/g) ?? []).length, 1);
  assert.deepEqual([...source.matchAll(/<section[^>]*id="([^"]+)"/g)].map(m => m[1]), ["top", "about", "services"]);
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
  ]) assert.ok(source.includes(text), text);
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
  const source = await read("../src/components/home/QuietSignalOpening.tsx");
  assert.match(source, /import Image from "next\/image"/);
  assert.match(source, /SiteLink as Link/);
  assert.match(source, /NEXT_BASE_PATH/);
  assert.match(source, /sizes="\(max-width: 767px\) 1600px, \(max-width: 1299px\) 1300px, 100vw"/);
  assert.match(source, /\bfill\b/);
  assert.match(source, /\bpriority\b/);
  assert.match(source, /alt="Three people looking at a handheld device in a maize field\."/);
  assert.equal((source.match(/<Image\b/g) ?? []).length, 1);
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
