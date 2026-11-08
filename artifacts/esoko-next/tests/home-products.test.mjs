import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PRODUCTS, PROFESSIONAL_SERVICES } from "../src/data/products-services.ts";

const section = await readFile(new URL("../src/components/home/sections/ProductsServicesSection.tsx", import.meta.url), "utf8");

test("homepage product discovery uses the existing catalogue rather than separate names and launch URLs", () => {
  assert.equal(PRODUCTS.length, 4);
  assert.equal(new Set(PRODUCTS.map(product => product.id)).size, 4);
  assert.match(section, /import \{ PRODUCTS, PROFESSIONAL_SERVICES \} from "@\/data\/products-services"/);
  assert.match(section, /PRODUCTS\.map/);
  assert.match(section, /\{product\.name\}/);
  assert.match(section, /href=\{product\.url\}/);
  assert.doesNotMatch(section, /https?:\/\//);
  for (const product of PRODUCTS) {
    assert.equal(new URL(product.url).protocol, "https:");
    assert.match(section, new RegExp(`\\b${product.id}:`), `Missing ${product.id} description`);
  }
});

test("product launches disclose new tabs and professional services use the central internal link helper", () => {
  assert.match(section, /target="_blank"/);
  assert.match(section, /rel="noopener noreferrer"/);
  assert.match(section, /aria-label=\{`Visit \$\{product\.name\} platform \(opens in a new tab\)`\}/);
  assert.match(section, /<SiteLink[\s\S]*?href="\/products-services\/"/);
  assert.match(section, /<SiteLink[\s\S]*?href="\/products-services\/#services"/);
  assert.match(section, /PROFESSIONAL_SERVICES\.map/);
  assert.equal(PROFESSIONAL_SERVICES.length, 4);
});

test("product discovery is server-rendered, token-based and does not duplicate the existing services anchor", () => {
  assert.doesNotMatch(section, /["']use client["']|framer-motion|useEffect|@import|#[0-9a-f]{6}\b/i);
  assert.match(section, /id="products-services"/);
  assert.match(section, /aria-labelledby="products-services-title"/);
  assert.match(section, /<h2[\s\S]*?Products &amp; Services/);
  assert.doesNotMatch(section, /id="services"/);
  assert.match(section, /min-h-11/);
  assert.match(section, /focus-visible:outline/);
  // Existing brand orange meets AA for large bold text, not normal small text.
  assert.match(section, /bg-brand[^"]*text-xl font-bold text-background/);
});
