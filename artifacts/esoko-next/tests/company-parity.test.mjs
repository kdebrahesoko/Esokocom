import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const original = new URL("../../esoko-website/src/pages/company/", import.meta.url);
const migrated = new URL("../src/components/company/", import.meta.url);

async function data(url) {
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
  for (const name of ["CompanyPage.tsx", "CompanySections.tsx", "TeamSection.tsx", "GallerySection.tsx", "StoryVideoSection.tsx"]) {
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
  for (const name of ["CompanyPage.tsx", "CompanySections.tsx", "LeadershipPortrait.tsx", "GallerySection.tsx"]) {
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
