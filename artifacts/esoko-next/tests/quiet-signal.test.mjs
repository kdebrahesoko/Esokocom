import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("the approved quiet opening remains server-rendered with all three sections", async () => {
  const source = await read("../src/components/home/QuietSignalOpening.tsx");
  assert.doesNotMatch(source, /use client|useState|useEffect|Date\.now|Math\.random/);
  assert.equal((source.match(/<h1\b/g) ?? []).length, 1);
  assert.deepEqual([...source.matchAll(/<section[^>]*id="([^"]+)"/g)].map(m => m[1]), ["top", "about", "services"]);
  for (const text of [
    "A useful message can make the next step clearer.",
    "The decision is local. Information should meet it there.",
    "Support for the work around a farm decision.",
    "Understand what is happening in the field",
    "Share guidance in useful ways",
    "Bring market information within reach",
    "people photo planned",
    "This photographed message is an example, not a live alert.",
  ]) assert.ok(source.includes(text), text);
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

test("the opening uses only the approved optimized SMS asset and mapped links", async () => {
  const source = await read("../src/components/home/QuietSignalOpening.tsx");
  assert.match(source, /import Image from "next\/image"/);
  assert.match(source, /SiteLink as Link/);
  assert.match(source, /NEXT_BASE_PATH/);
  assert.match(source, /sizes=/);
  assert.equal((source.match(/<Image\b/g) ?? []).length, 1);
  assert.doesNotMatch(source, /<img|<header|<nav|\/__mockup\/|\/esoko-next\//);
  assert.match(source, /href="\/products-services\/"/);
  assert.match(source, /href="\/solutions\/marketplace\/"/);
  const target = await readFile(new URL("../public/site-assets/home/feature-phone-weather-alert-example.webp", import.meta.url));
  const hash = data => createHash("sha256").update(data).digest("hex");
  // Verified against the approved metadata-stripped copy at graduation. Keep
  // this test portable: sandbox review assets are intentionally Git-ignored.
  assert.equal(hash(target), "f6ad0b25a864b239e747db0997bf1acb89f8b12edb1f1c4c6da9565bd93dad5c");
  assert.ok(target.length < 150_000);
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
