import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { MARKETPLACE_URL, siteHref } from "../src/lib/site-links.ts";

const base = "artifacts/esoko-next/src/components/offering/marketplace/";
const page = fs.readFileSync(base + "MarketplacePage.tsx", "utf8");
const photo = fs.readFileSync(base + "MarketplacePhoto.tsx", "utf8");
const gallery = fs.readFileSync(base + "MarketplaceGallery.tsx", "utf8");
const content = fs.readFileSync(base + "marketplace-content.ts", "utf8");
const css = fs.readFileSync(base + "marketplace.css", "utf8");
const route = fs.readFileSync("artifacts/esoko-next/src/app/solutions/[slug]/page.tsx", "utf8");
const photos = JSON.parse(fs.readFileSync(base + "marketplace-photos.json", "utf8"));

test("only the Marketplace slug receives the approved redesign and metadata", () => {
  assert.match(route, /if \(slug === 'marketplace'\) return <MarketplacePage \/>/);
  assert.match(route, /return <SolutionPage solution=\{solution\} \/>/);
  assert.match(route, /if \(slug === 'marketplace'\) \{[\s\S]*?return pageMetadata/);
  assert.match(route, /marketplace-social\.webp/);
  assert.doesNotMatch(page, /use client|useState|useEffect|ScreenshotMockup|RelatedSolutions/);
});

test("all approved sections and copy remain in the agreed order", () => {
  const markers = ['className="mp-hero"', 'className="mp-how"', "<MarketplaceGallery", 'className="mp-closing"'];
  const positions = markers.map(marker => page.indexOf(marker));
  assert.ok(positions.every(position => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  for (const text of [
    "Empowering agricultural trade with innovative solutions",
    "Buy and sell agricultural products directly, with verified suppliers across the value chain.",
  ]) assert.ok(content.includes(text));
  for (const text of [
    "Direct trading",
    "Connect directly with farmers and wholesalers, without intermediaries.",
    "Agricultural products and commodities",
    "Source verified fresh crops, livestock, seeds, fertilizers and farm equipment directly from registered suppliers.",
    "Make your next agricultural connection.",
  ]) assert.ok(page.includes(text), text);
  assert.match(gallery, /Around the marketplace/);
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.doesNotMatch(page, /\$120M|85,000|Verified case study|Mariama|<header|<footer/);
});

test("launch actions use the central platform URL, not a preview or duplicate literal", () => {
  assert.equal(MARKETPLACE_URL, "https://marketplace.esoko.com/");
  assert.equal(siteHref("/solutions/marketplace"), "/esoko-next/solutions/marketplace/");
  assert.match(page, /href=\{MARKETPLACE_URL\} target="_blank" rel="noopener noreferrer"/);
  assert.match(page, /Opens in a new tab/);
  assert.match(page, /href="#how-it-works"/);
  assert.doesNotMatch(page, /https:\/\/marketplace|__mockup|marketplace-preview/);
});

test("the seven selected consented photos and social image are optimized metadata-free WebPs", () => {
  assert.equal(photos.length, 7);
  assert.deepEqual(photos.map(p => p.id).sort(), ["094705", "104114", "113358", "114744", "115613", "115630", "120906"]);
  for (const p of [...photos, { src: "/site-assets/marketplace/marketplace-social.webp" }]) {
    const bytes = fs.readFileSync("artifacts/esoko-next/public" + p.src);
    assert.ok(bytes.length < 250_000, p.src);
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    for (let offset = 12; offset + 8 <= bytes.length;) {
      const chunk = bytes.toString("ascii", offset, offset + 4);
      assert.ok(!["EXIF", "XMP ", "IPTC"].includes(chunk), `${p.src}: ${chunk}`);
      const length = bytes.readUInt32LE(offset + 4);
      offset += 8 + length + (length % 2);
    }
    if (p.id) {
      assert.ok(p.alt && p.caption && p.width > 0 && p.height > 0);
      assert.match(p.blurDataURL, /^data:image\/webp;base64,/);
    }
  }
});

test("Next Image is responsive, blur-backed and lazy except the sole hero", () => {
  assert.match(photo, /import Image from 'next\/image'/);
  assert.match(photo, /fill sizes=\{sizes\}/);
  assert.match(photo, /loading=\{priority \? undefined : 'lazy'\}/);
  assert.match(photo, /placeholder="blur" blurDataURL=\{photo.blurDataURL\}/);
  assert.match(photo, /onError=/);
  assert.match(photo, /Image unavailable/);
  assert.equal((page.match(/ priority\b/g) || []).length, 1);
  assert.doesNotMatch(gallery, / priority\b|<img\b/);
});

test("gallery preserves accessible viewing and reduced-motion behavior without a new library", () => {
  for (const text of ["<dialog", ".showModal()", ".close()", "ArrowRight", "ArrowLeft", "event.key === 'Tab'", "event.shiftKey",
    "openerRef.current?.focus()", "onCancel=", 'aria-haspopup="dialog"', 'aria-live="polite"', "document.body.style.overflow = previous"]) {
    assert.ok(gallery.includes(text), text);
  }
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /grid-template-rows:/);
  assert.match(css, /min-width:48px; min-height:48px/);
  assert.doesNotMatch(gallery, /framer-motion|embla|react-photo|yet-another/);
});
