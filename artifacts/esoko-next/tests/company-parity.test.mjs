import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const original = new URL("../../esoko-website/src/pages/company/", import.meta.url);
const migrated = new URL("../src/components/company/", import.meta.url);

async function data(url, imports = {}) {
  let source = await fs.readFile(url, "utf8");
  source = source.replaceAll("import.meta.env.BASE_URL", '"/"');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  const icons = new Proxy({}, { get: (_target, key) => String(key) });
  vm.runInNewContext(code, {
    exports,
    require: name => {
      if (Object.hasOwn(imports, name)) return imports[name];
      assert.equal(name, "lucide-react", "Data parity must not import runtime services.");
      return icons;
    },
  }, { timeout: 1000 });
  return JSON.parse(JSON.stringify(exports).replaceAll("/esoko-next/site-assets/", "/"));
}

test("Company data preserves all source facts, names, roles, biographies, links and ordering", async () => {
  const next = await data(new URL("CompanyData.ts", migrated));
  assert.equal(next.ASSET_BASE, "/esoko-next/site-assets");
  delete next.ASSET_BASE; // Infrastructure constant is not source editorial content.
  assert.deepEqual(next, await data(new URL("CompanyData.ts", original)));
});

function jsxText(source) {
  const tree = ts.createSourceFile("content.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const content = [];
  function visit(node) {
    if (ts.isJsxText(node)) {
      const text = node.text.replace(/&(apos|quot|amp|gt|lt|nbsp);/g,
        (_all, name) => ({ apos: "'", quot: '"', amp: "&", gt: ">", lt: "<", nbsp: " " })[name])
        .replace(/\s+/g, " ").trim();
      if (text) content.push(text);
    }
    if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression)) {
      content.push(node.expression.text.replace(/\s+/g, " ").trim());
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return content;
}

test("Company's visible static JSX wording survives server/client extraction unchanged", async () => {
  const targets = (await fs.readdir(migrated)).filter(name => /\.tsx$/.test(name));
  const all = [
    ...await Promise.all(targets.map(name => fs.readFile(new URL(name, migrated), "utf8"))),
    await fs.readFile(new URL("../src/app/company/page.tsx", import.meta.url), "utf8"),
  ].flatMap(jsxText);
  // The separately approved gallery redesign is covered by the explicit tests
  // below. Every other Company section still has strict original-copy parity.
  for (const name of ["CompanyPage.tsx", "CompanySections.tsx", "TeamSection.tsx", "StoryVideoSection.tsx"]) {
    const texts = jsxText(await fs.readFile(new URL(name, original), "utf8"));
    for (const text of texts) assert.ok(all.includes(text), `${name}: missing/changed text "${text}"`);
  }
});

test("Company section composition and section ordering match the original", async () => {
  const source = await fs.readFile(new URL("CompanyPage.tsx", original), "utf8");
  const next = await fs.readFile(new URL("CompanyPage.tsx", migrated), "utf8");
  const names = [
    "TrustSection", "StoryVideoSection", "MissionSection", "OverviewSection", "JourneySection",
    "ImpactSection", "PresenceSection", "TeamSection", "GallerySection", "MarketOpportunitySection",
    "WhyEsokoSection", "ProductEcosystemSection", "ValuesSection", "FinalStorySection",
  ];
  const composition = text => [...text.matchAll(/<([A-Z]\w+)\b/g)].map(m => m[1]).filter(n => names.includes(n));
  assert.deepEqual(composition(next), composition(source));
});

test("optimized Company images reserve priority for one above-fold hero, not portraits", async () => {
  let priorities = 0;
  for (const name of ["CompanyPage.tsx", "CompanySections.tsx", "LeadershipPortrait.tsx", "gallery/GalleryPhoto.tsx", "gallery/GalleryLightbox.tsx"]) {
    const source = await fs.readFile(new URL(name, migrated), "utf8");
    assert.match(source, /from ['"]next\/image['"]/);
    const tree = ts.createSourceFile(name, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = node => {
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(tree) === "Image") {
        const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
        assert.ok(attrs.some(a => a.name.getText(tree) === "sizes"), `${name}: responsive sizes required`);
        if (attrs.some(a => ["priority", "preload"].includes(a.name.getText(tree)))) {
          assert.equal(name, "CompanyPage.tsx");
          priorities++;
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(tree);
  }
  assert.equal(priorities, 1);
});

test("approved gallery retains all six existing images and adds exactly the six confirmed no-face WebPs", async () => {
  const { COMPANY_GALLERY_IMAGES: images } = await data(new URL("gallery/gallery-data.ts", migrated), {
    "../CompanyData": { ASSET_BASE: "/esoko-next/site-assets" },
  });
  const { GALLERY_IMAGES: existing } = await data(new URL("CompanyData.ts", original));
  assert.equal(images.length, 12);
  assert.equal(new Set(images.map(image => image.id)).size, 12);
  assert.equal(new Set(images.map(image => image.src)).size, 12);
  assert.deepEqual(images.filter(image => image.existing).map(image => image.src).sort(),
    existing.map(image => image.src).sort(), "No previously approved gallery image may disappear.");
  assert.deepEqual(images.filter(image => !image.existing).map(image => image.src.split("/").at(-1)).sort(), [
    "agricultural-input-bottles-on-shelves.webp",
    "agricultural-products-and-input-shop-shelves.webp",
    "feature-phone-weather-alert-example.webp",
    "hands-holding-maize-kernels.webp",
    "sprayers-and-inputs-in-farm-shop.webp",
    "tablet-in-agricultural-input-shop.webp",
  ].sort());
  assert.deepEqual(images.map(image => image.id), [
    "market", "tablet", "maize", "team", "field", "meeting",
    "registration", "helpline", "bottles", "sprayers", "products", "phone",
  ], "Preserve the approved photographic arrangement.");
  for (const image of images) {
    assert.ok(image.alt.trim() && image.caption.trim());
    assert.ok(["Field work", "Technology", "Agriculture", "Team & communities"].includes(image.category));
    await fs.access(new URL(`../public/site-assets${image.src}`, import.meta.url));
  }
  assert.match(images.find(image => image.id === "registration").caption, /promotional graphic/);
  assert.match(images.find(image => image.id === "phone").alt, /Product graphic/);
});

test("approved gallery preserves its heading, introduction, anchor, and accessible browsing controls", async () => {
  const source = await fs.readFile(new URL("gallery/CompanyGallery.tsx", migrated), "utf8");
  const texts = jsxText(source);
  assert.ok(texts.includes("Esoko in the field"));
  assert.ok(texts.includes("People. Places. Technology. Impact."));
  assert.ok(texts.includes("A closer look at the field teams, farming communities, and technology that make Esoko’s work tangible."));
  assert.match(source, /id="gallery"/);
  assert.match(source, /const INITIAL_COUNT = 6/);
  assert.match(source, /aria-pressed=\{category === item\}/);
  assert.match(source, /View all/);
  assert.match(source, /<GalleryLightbox/);
  assert.doesNotMatch(source, /__mockup|suppressHydrationWarning/);
});
