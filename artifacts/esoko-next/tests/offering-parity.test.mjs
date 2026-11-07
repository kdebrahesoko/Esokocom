import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const original = path.resolve("artifacts/esoko-website/src");
const migrated = path.resolve("artifacts/esoko-next/src");
const read = file => fs.readFileSync(file, "utf8");
const tree = file => ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const clean = value => JSON.parse(JSON.stringify(value).replaceAll("/esoko-next/site-assets/", "ASSETS/"));
const icons = new Proxy({}, { get: (_target, name) => String(name) });
const stub = new Proxy(() => null, { get: (_target, name) => name === "motion" ? icons : () => null });

/** Isolated transpilation: imports are stubs, never the API, database or real app. */
function data(file, names = []) {
  const exports = {};
  const source = read(file).replaceAll("import.meta.env.BASE_URL", '"/"') +
    names.map(name => `\nexports.${name} = ${name};`).join("");
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
    esModuleInterop: true, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  vm.runInNewContext(compiled, {
    exports,
    require: name => name === "lucide-react" ? icons :
      name.startsWith("@assets/") ? `ASSETS/${path.basename(name)}` : stub,
  }, { timeout: 1000, filename: file });
  return clean(exports);
}

for (const [file, name] of [["sectors.ts", "SECTORS_DATA"], ["solutions.ts", "SOLUTIONS_DATA"]]) {
  test(`${name}: every source field, icon, slug, image and item order is preserved`, () => {
    const source = data(path.join(original, "data", file))[name];
    const next = data(path.join(migrated, "data", file))[name];
    assert.equal(source.length, 8);
    assert.deepEqual(next, source);
  });
}

test("all original named product/service catalogs are preserved", () => {
  const names = ["PRODUCTS", "SOFTWARE_SERVICES", "MESSAGING_CHANNELS", "CONTENT_CATEGORIES", "TECH_CHIPS", "ECOSYSTEM_NODES"];
  const source = data(path.join(original, "pages/ProductsServicesPage.tsx"), names);
  const next = data(path.join(migrated, "data/products-services.ts"));
  for (const name of names) assert.deepEqual(next[name], source[name], name);
});

test("enterprise quote pricing title, description, values and steps are unchanged", () => {
  const names = ["TITLE", "DESC", "VALUE", "STEPS"];
  const source = data(path.join(original, "pages/PricingPage.tsx"), names);
  const next = data(path.join(migrated, "data/pricing.ts"));
  for (const name of names) assert.deepEqual(next[name], source[name], name);
});

const decode = text => text.replace(/&(apos|quot|amp|lt|gt|nbsp);/g,
  (_, name) => ({ apos: "'", quot: '"', amp: "&", lt: "<", gt: ">", nbsp: " " })[name])
  .replace(/\s+/g, " ").trim();
const sourcePages = ["ProductsServicesPage", "SectorsPage", "SectorDetailPage", "solutions/SolutionPage", "PricingPage"];
const corpus = [...fs.readdirSync(path.join(migrated, "components/offering")).filter(n => /\.tsx?$/.test(n)).map(n => path.join(migrated, "components/offering", n)),
  ...fs.readdirSync(path.join(migrated, "data")).filter(n => /\.tsx?$/.test(n)).map(n => path.join(migrated, "data", n))].map(f => decode(read(f))).join(" ");
for (const name of sourcePages) {
  test(`${name}: all static JSX copy and inline-array strings survive extraction`, () => {
    const texts = new Set();
    function visit(node, inArray = false) {
      // The former client-only SEO selector table is not visible page copy.
      if (ts.isVariableDeclaration(node) && node.name.getText() === "META") return;
      if (ts.isJsxText(node) || (inArray && ts.isStringLiteral(node))) {
        const text = decode(node.text);
        if (text) texts.add(text);
      }
      ts.forEachChild(node, child => visit(child, inArray || ts.isArrayLiteralExpression(node)));
    }
    visit(tree(path.join(original, `pages/${name}.tsx`)));
    for (const text of texts) assert.ok(corpus.includes(text), `Missing/changed copy: ${text}`);
  });
}

function text(node) {
  if (ts.isJsxText(node)) return node.text;
  if (ts.isJsxExpression(node)) return node.expression && ts.isStringLiteral(node.expression) ? node.expression.text : "";
  if (ts.isJsxElement(node) || ts.isJsxFragment(node)) return node.children.map(text).join("");
  return "";
}
function attr(node, name) {
  const a = node.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText() === name);
  return a?.initializer && ts.isStringLiteral(a.initializer) ? a.initializer.text : "";
}

/** Expand actual section components at their call sites, including client explorers.
 * This checks authored section/heading order, not a simulation of browser state. */
function structure(file, name, seen = new Set()) {
  const key = file + ":" + name;
  if (seen.has(key)) return [];
  const ast = tree(file), functions = new Map(), imports = new Map();
  for (const statement of ast.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) functions.set(statement.name.text, statement);
    if (ts.isImportDeclaration(statement) && statement.importClause?.namedBindings &&
        ts.isNamedImports(statement.importClause.namedBindings)) {
      const from = statement.moduleSpecifier.text;
      for (const el of statement.importClause.namedBindings.elements)
        imports.set(el.name.text, { from, name: el.propertyName?.text ?? el.name.text });
    }
  }
  const fn = functions.get(name);
  assert.ok(fn, `${file}: missing function ${name}`);
  const result = [], returns = fn.body.statements.filter(ts.isReturnStatement);
  const root = returns.at(-1)?.expression;
  assert.ok(root, `${name}: main return missing`);
  function walk(node) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const tag = opening.tagName.getText(ast);
      if (["Navbar", "Footer"].includes(tag)) return;
      const logical = tag.startsWith("motion.") ? tag.slice(7) : attr(opening, "as") || tag;
      if (logical === "section") result.push(`section:${attr(opening, "id")}:${attr(opening, "className")}`);
      if (/^h[12]$/.test(logical)) result.push(`${logical}:${decode(text(node))}`);
      const wrap = ["Motion", "FadeUp", "RevealUp", "Image", "Link", "Button", "ScrollButton"];
      if (!wrap.includes(tag) && /^[A-Z]/.test(tag)) {
        let target = functions.has(tag) ? { file, name: tag } : null;
        const imported = imports.get(tag);
        if (imported?.from.startsWith("@/components/offering/")) {
          target = { file: path.join(migrated, imported.from.replace("@/", "") + ".tsx"), name: imported.name };
        }
        if (target) {
          result.push(...structure(target.file, target.name, new Set([...seen, key])));
          return;
        }
      }
      if (ts.isJsxElement(node)) node.children.forEach(walk);
      return;
    }
    ts.forEachChild(node, walk);
  }
  walk(root);
  return result;
}
for (const name of sourcePages) {
  const component = path.basename(name);
  test(`${component}: exact section identity/order and h1/h2 order match source`, () => {
    assert.deepEqual(
      structure(path.join(migrated, `components/offering/${component}.tsx`), component),
      structure(path.join(original, `pages/${name}.tsx`), component),
    );
  });
}

test("public Careers mounts the client application form on the central Next apply URL", () => {
  const view = read(path.join(migrated, "components/careers/CareersViews.tsx"));
  assert.match(view, /import ApplicationForm/);
  assert.match(view, /<ApplicationForm/);
  assert.match(view, /applicationHref\(job.id\)/);
  assert.ok(fs.existsSync(path.join(migrated, "components/careers/ApplicationForm.tsx")));
});

test("the documented inventory covers all 22 existing registered route patterns", () => {
  const doc = read(path.resolve("replit.md")), routes = [];
  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText() === "Route") {
      const route = attr(node, "path");
      if (route) routes.push(route);
    }
    ts.forEachChild(node, visit);
  }
  visit(tree(path.join(original, "App.tsx")));
  assert.equal(routes.length, 22);
  for (const route of routes) assert.ok(doc.includes(`\`${route}\``), `Undocumented existing route: ${route}`);
  assert.ok(doc.includes("Any unmatched path"));
});
