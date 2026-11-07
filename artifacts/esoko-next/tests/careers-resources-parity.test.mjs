import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");

const site = new URL("../../esoko-website/src/", import.meta.url);
const next = new URL("../src/", import.meta.url);
const read = (base, p) => fs.readFile(new URL(p, base), "utf8");
const icons = new Proxy({}, { get: (_t, key) => String(key) });

function evaluate(source) {
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: name => { assert.equal(name, "lucide-react", "Parity data must not import runtime services."); return icons; },
  }, { timeout: 1000 });
  return JSON.parse(JSON.stringify(exports).replaceAll("/esoko-next/site-assets/", "/"));
}

function jsxText(source) {
  const tree = ts.createSourceFile("c.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const out = [];
  const visit = node => {
    if (ts.isJsxText(node)) {
      const t = node.text.replace(/&(apos|quot|amp);/g, (_a, n) => ({ apos: "'", quot: '"', amp: "&" })[n]).replace(/\s+/g, " ").trim();
      if (t) out.push(t);
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return out;
}

/** Ordered component tags rendered inside a named function's JSX. */
function rendered(source, fnName, names) {
  const tree = ts.createSourceFile("c.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let body = null;
  tree.forEachChild(n => { if (ts.isFunctionDeclaration(n) && n.name?.text === fnName) body = n.getText(tree); });
  assert.ok(body, `${fnName} not found`);
  return [...body.matchAll(/<([A-Z]\w+)\b/g)].map(m => m[1]).filter(n => names.includes(n));
}

/* ───────────────────────── Careers ───────────────────────── */

const CAREERS_ORDER = [
  "CareersHeroSection", "WhyJoinSection", "LifeAtEsokoSection", "CareersListing", "ProgrammesSection",
  "RecruitmentProcessSection", "BenefitsSection", "DiversitySection", "MeetTeamSection", "FaqSection", "FinalCtaSection",
];
// Original section markers, in source order, mapped to the migrated components.
const ORIGINAL_MARKERS = {
  "S1 HERO": "CareersHeroSection", "S2 WHY JOIN": "WhyJoinSection", "S3 LIFE AT ESOKO": "LifeAtEsokoSection",
  "S4 OPEN POSITIONS": "CareersListing", "S5 INTERNSHIP & GRADUATE": "ProgrammesSection",
  "S6 RECRUITMENT PROCESS": "RecruitmentProcessSection", "S7 BENEFITS": "BenefitsSection",
  "S8 DIVERSITY & INCLUSION": "DiversitySection", "S9 MEET THE TEAM": "MeetTeamSection", "S10 FAQ": "FaqSection",
  "FINAL CTA": "FinalCtaSection",
};

test("Careers page renders the landing around server-fetched jobs, never fixture JOBS", async () => {
  const page = await read(next, "app/careers/page.tsx");
  assert.match(page, /getJobs\(\)/);
  assert.match(page, /<CareersLanding jobs=\{jobs\} search=\{search\} \/>/);
  assert.doesNotMatch(page, /use client/);
  for (const f of ["CareersData.ts", "CareersStatic.ts", "CareersSections.tsx", "CareersLanding.tsx", "CareersIslands.tsx"]) {
    const s = await read(next, `components/careers/parity/${f}`);
    assert.doesNotMatch(s, /\bJOBS\b|data\/careers|fetch\(/, `${f} must not use fixture jobs or client fetching`);
  }
  for (const f of ["CareersSections.tsx", "CareersLanding.tsx"]) {
    assert.doesNotMatch(await read(next, `components/careers/parity/${f}`), /^["']use client["']/m, `${f} must stay a Server Component`);
  }
  assert.match(await read(next, "components/careers/parity/CareersIslands.tsx"), /^"use client";/);
});

test("Careers section composition matches the original section order", async () => {
  const original = await read(site, "pages/CareersPage.tsx");
  const markers = [...original.matchAll(/\{\/\* ══ (.+?) ═/g)].map(m => m[1].trim()).filter(m => m in ORIGINAL_MARKERS);
  assert.deepEqual(markers.map(m => ORIGINAL_MARKERS[m]), CAREERS_ORDER);
  const landing = await read(next, "components/careers/parity/CareersLanding.tsx");
  assert.deepEqual(rendered(landing, "CareersLanding", CAREERS_ORDER), CAREERS_ORDER);
});

test("Careers programmes, FAQ and team data equal the original data module", async () => {
  const original = evaluate(await read(site, "data/careers.ts"));
  const migrated = evaluate(await read(next, "components/careers/parity/CareersData.ts"));
  assert.deepEqual(Object.keys(migrated).sort(), ["CAREERS_TEAM", "FAQ_ITEMS", "PROGRAMMES"]);
  for (const k of ["PROGRAMMES", "FAQ_ITEMS", "CAREERS_TEAM"]) assert.deepEqual(migrated[k], original[k], k);
});

test("Careers static section data equals the original page constants (asset prefix only)", async () => {
  const original = await read(site, "pages/CareersPage.tsx");
  const block = original.slice(original.indexOf("const WHY_JOIN"), original.indexOf("/* ── Hero stat counter"));
  const lucide = original.match(/import \{[^}]+\} from 'lucide-react';/)[0];
  const expected = evaluate(`${lucide}\n${block.replace(/^const /gm, "export const ")}`);
  const migrated = evaluate(await read(next, "components/careers/parity/CareersStatic.ts"));
  delete migrated.ASSET_BASE;
  assert.deepEqual(migrated, expected);
  assert.deepEqual(Object.keys(migrated), ["WHY_JOIN", "BENEFITS", "PROCESS_STEPS", "TESTIMONIALS", "DI_HIGHLIGHTS", "MOSAIC_IMAGES", "HERO_STATS"]);
});

test("Careers visible copy survives; each section renders its original heading", async () => {
  const original = jsxText(await read(site, "pages/CareersPage.tsx"));
  const files = ["components/careers/parity/CareersSections.tsx", "components/careers/parity/CareersIslands.tsx", "components/careers/CareersViews.tsx"];
  const all = (await Promise.all(files.map(f => read(next, f)))).flatMap(jsxText);
  // Fixture-job card / client filter strings replaced by the existing server jobs browser.
  const browserOnly = new Set(["Clear all", "found", "No positions match your filters.", "Clear filters", "Posted", "d ago", "View Position", "·"]);
  for (const t of original) if (!browserOnly.has(t)) assert.ok(all.includes(t), `missing/changed copy "${t}"`);

  const sections = await read(next, "components/careers/parity/CareersSections.tsx");
  const headings = {
    WhyJoinSection: "Why Join Esoko?", LifeAtEsokoSection: "Life at Esoko", ProgrammesSection: "Start Your Technology Journey With Esoko",
    RecruitmentProcessSection: "Our Recruitment Process", BenefitsSection: "We Take Care of Our Team", DiversitySection: "Everyone Belongs",
    MeetTeamSection: "Meet Our Team", FaqSection: "Common Questions", FinalCtaSection: "Future of Agriculture?",
  };
  for (const [fn, h] of Object.entries(headings)) {
    const body = sections.slice(sections.indexOf(`export function ${fn}(`));
    const end = body.indexOf("\nexport function ", 10);
    assert.ok((end > 0 ? body.slice(0, end) : body).includes(h), `${fn} must render "${h}"`);
  }
  assert.match(sections.slice(sections.indexOf("function MeetTeamSection")), /<TeamGrid \/>/);
  assert.match(sections.slice(sections.indexOf("function FaqSection")), /<FaqList \/>/);
});

test("Careers has exactly one h1 (hero) and the jobs browser is the #open-positions target", async () => {
  const sections = await read(next, "components/careers/parity/CareersSections.tsx");
  const views = await read(next, "components/careers/CareersViews.tsx");
  const listing = views.slice(views.indexOf("export function CareersListing"), views.indexOf("function List("));
  assert.equal((sections.match(/<h1\b/g) ?? []).length, 1);
  assert.doesNotMatch(listing, /<h1\b|<main\b/);
  assert.match(listing, /<section id="open-positions"/);
  assert.match(listing, /Explore Opportunities<\/h2>/);
  assert.match(sections, /href="#open-positions"/);
});

test("Careers images keep original assets/alt text through next/image with one priority hero", async () => {
  const original = await read(site, "pages/CareersPage.tsx");
  const srcs = [...original.matchAll(/<img src="(\/[^"]+)" alt="([^"]+)"/g)].map(m => [m[1], m[2]]);
  const sections = await read(next, "components/careers/parity/CareersSections.tsx");
  assert.match(sections, /from "next\/image"/);
  assert.doesNotMatch(sections, /<img\b/);
  const migrated = [...sections.matchAll(/<Image src=\{`\$\{ASSET_BASE\}(\/[^`]+)`\} alt="([^"]+)"/g)].map(m => [m[1], m[2]]);
  assert.deepEqual(migrated, srcs);
  const tags = [...sections.matchAll(/<Image\b[^>]*>/g)].map(m => m[0]);
  assert.ok(tags.every(t => /\bsizes=/.test(t)), "all images need sizes");
  assert.equal(tags.filter(t => /\bpriority\b/.test(t)).length, 1);
  assert.match(tags.find(t => /priority/.test(t)), /hero-slide-1/);
});

/* ───────────────────────── Resources ───────────────────────── */

test("Resources landing keeps server fetching with published-only listing rules", async () => {
  const page = await read(next, "app/resources/page.tsx");
  assert.doesNotMatch(page, /use client/);
  assert.match(page, /getResources\(search\)/);
  assert.match(page, /getTaxonomy\(\)/);
  assert.match(page, /getResources\(\{\}, slug\)/, "type counts come from the published-only getResources path");
  assert.doesNotMatch(page, /catch\s*[{(]/, "failed counts must reach the error boundary, not pretend no content exists");
  const api = await read(next, "lib/resource-api.ts");
  assert.match(api, /r\.status === "Published"/);
  const parity = await read(next, "components/resources/ResourcesParity.tsx");
  assert.doesNotMatch(parity, /use client|fetch\(/);
});

test("restored Resources sections are full-width, not nested inside the narrow listing container", async () => {
  const views = await read(next, "components/resources/ResourceViews.tsx");
  const css = await read(next, "app/resources/resources.css");
  assert.match(views, /landing \? "resources-main resources-main--landing bg-white" : "resources-main"/);
  assert.match(css, /\.resources-main--landing\s*\{[^}]*width:\s*100%;[^}]*max-width:\s*none;/);
});

test("Resources hero, featured and Browse by Type copy match the original", async () => {
  const original = jsxText(await read(site, "pages/resources/ResourcesPage.tsx"));
  const migrated = jsxText(await read(next, "components/resources/ResourcesParity.tsx"));
  for (const t of ["Knowledge Hub", "Resources", "Insights. Ideas. Knowledge.",
    "Explore Esoko's latest insights, research, events, webinars, podcasts, guides, and stories shaping the future of digital agriculture across Africa.",
    "Explore Latest Insights", "Browse All Resources", "Featured Insights", "Hand-picked by the Esoko team", "View all",
    "New insights are coming soon.", "Published content will appear here automatically.", "Featured", "Read Article",
    "Browse by Type", "Dive into the format that works best for you — from short reads to in-depth research.", "Coming Soon", "min read", "Esoko"]) {
    assert.ok(original.includes(t), `fixture drift: "${t}" not in original`);
    assert.ok(migrated.includes(t), `missing/changed copy "${t}"`);
  }
});

test("Resources category cards equal the original CATEGORY_CARDS", async () => {
  const block = s => s.match(/const CATEGORY_CARDS = \[([\s\S]*?)\] as const;/)[1];
  const original = await read(site, "pages/resources/ResourcesPage.tsx");
  const migrated = await read(next, "components/resources/ResourcesParity.tsx");
  assert.equal(block(migrated), block(original));
});

test("Resources landing composition follows original order; type routes keep their own h1", async () => {
  const views = await read(next, "components/resources/ResourceViews.tsx");
  const browser = views.slice(views.indexOf("export function ResourceBrowser"), views.indexOf("/* ── Detail panels"));
  const order = ["<ResourcesHero", 'className="rs-types"', 'className="rs-filters"', "<FeaturedInsightsSection", "<BrowseByTypeSection", 'aria-labelledby="rs-latest"'];
  const idx = order.map(m => browser.indexOf(m));
  assert.ok(idx.every(i => i >= 0), `missing landing section: ${order[idx.indexOf(-1)]}`);
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, "landing sections out of original order");
  assert.match(browser, /\{landing && <ResourcesHero \/>\}/);
  assert.match(browser, /\{!landing && <>[\s\S]*?<h1>\{label\}<\/h1>/);
  assert.equal((browser.match(/<h1\b/g) ?? []).length, 1);
  const parity = await read(next, "components/resources/ResourcesParity.tsx");
  assert.equal((parity.match(/<h1\b/g) ?? []).length, 1);
  assert.match(parity, /id="featured-insights"/);
  assert.match(parity, /id="browse-by-type"/);
  assert.match(parity, /href=\{`\/resources\/\$\{card\.slug\}\/`\}/);
});

test("route CSS no longer declares DM Sans and uses project font tokens", async () => {
  for (const f of ["app/careers/careers.css", "app/resources/resources.css"]) {
    const css = await read(next, f);
    assert.doesNotMatch(css, /DM Sans/);
    assert.match(css, /var\(--app-font-sans, var\(--font-sans\)\)/);
  }
});
