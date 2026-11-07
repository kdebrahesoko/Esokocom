import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { usesOverlayHeader } from "../src/lib/hero-landings.ts";

test("the app foundation uses the existing fonts, not a leftover Geist import", async () => {
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(layout + css, /Geist|geist-|next\/font/);
  assert.match(css, /--app-font-sans:\s*'Inter'/);
  assert.match(css, /--app-font-heading:\s*'Plus Jakarta Sans'/);
});

test("the development indicator cannot request its root-relative Geist font", async () => {
  const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
  assert.match(config, /basePath:\s*"\/esoko-next"/);
  assert.match(config, /devIndicators:\s*false/);
});

test("restoring the two hero headers does not change other routes or detail pages", async () => {
  for (const path of ["/", "/resources", "/careers"]) assert.equal(usesOverlayHeader(path), true, path);
  for (const path of [
    "/company", "/products-services", "/sectors", "/pricing", "/demo",
    "/resources/blog", "/resources/blog/example", "/careers/example",
  ]) assert.equal(usesOverlayHeader(path), false, path);
  for (const file of ["Navbar.tsx", "SiteChrome.tsx"]) {
    const source = await readFile(new URL(`../src/components/site/${file}`, import.meta.url), "utf8");
    assert.match(source, /usesOverlayHeader\(/, file);
  }
});

test("restored route styles cannot override shared responsive utilities with duplicate Tailwind imports", async () => {
  const global = await readFile(new URL("../src/app/globals.css", import.meta.url), "utf8");
  assert.match(global, /@source "\.\.\/components\/careers\/parity"/);
  assert.match(global, /@source "\.\.\/components\/resources\/ResourcesParity\.tsx"/);
  for (const route of ["careers", "resources"]) {
    const css = await readFile(new URL(`../src/app/${route}/${route}.css`, import.meta.url), "utf8");
    assert.doesNotMatch(css, /@import.*tailwindcss/);
    assert.doesNotMatch(css, /DM Sans/);
  }
});
