import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
import { siteHref } from "../src/lib/site-links.ts";

const navbar = await readFile(new URL("../src/components/site/Navbar.tsx", import.meta.url), "utf8");
const ast = ts.createSourceFile("Navbar.tsx", navbar, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let navDeclaration;
for (const statement of ast.statements) {
  if (ts.isVariableStatement(statement)) {
    navDeclaration ??= statement.declarationList.declarations.find(node => node.name.getText(ast) === "NAV_ITEMS");
  }
}
assert.ok(navDeclaration);
// Evaluate only the literal navigation catalog, replacing icon references with null.
// Never import React, the application, its API client or database.
const nav = JSON.parse(JSON.stringify(vm.runInNewContext(
  `(${navDeclaration.initializer.getText(ast).replace(/icon:\s*\w+/g, "icon: null")})`, {}, { timeout: 1000 },
)));
const products = nav.find(item => item.label === "Products & Services");

test("standalone Marketplace opens the existing internal overview", () => {
  const entry = navbar.match(/\{ label: 'Marketplace',[^\n]+/g);
  assert.equal(entry?.length, 1, "one shared entry serves desktop and mobile");
  assert.match(entry[0], /icon: ShoppingCart/);
  assert.match(entry[0], /desc: 'Connect Farmers to Buyers'/);
  assert.match(entry[0], /href: '\/solutions\/marketplace'/);
  assert.doesNotMatch(entry[0], /external: true|https:|target:/);
  assert.equal(siteHref("/solutions/marketplace"), "/esoko-next/solutions/marketplace/");
});

test("the ecosystem overview links to Products & Services and has exactly the requested three children", () => {
  const ecosystem = products.columns.find(column => column.heading === "Esoko Platform Ecosystem");
  assert.ok(ecosystem);
  assert.equal(ecosystem.overviewHref, "/products-services");
  assert.equal(siteHref(ecosystem.overviewHref), "/esoko-next/products-services/");
  assert.deepEqual(ecosystem.links.map(link => link.label), ["Insyt & Survey", "Push Messaging", "E Content"]);
  assert.deepEqual(products.standaloneLinks.map(link => link.label), ["Marketplace"]);
  assert.equal(products.standaloneLinks[0].href, "/solutions/marketplace");
  assert.ok(products.columns.every(column => !column.links.some(link => link.label === "Marketplace")));
  assert.deepEqual(products.columns.find(column => column.heading === "Services").links.map(link => link.label),
    ["Deployments", "Software Development", "Messaging Services", "Content Services"]);
});

test("only the requested group becomes linked and both menu variants share the overview and standalone renderers", () => {
  for (const item of nav) for (const column of item.columns) {
    assert.equal(Boolean(column.overviewHref), item.label === "Products & Services" && column.heading === "Esoko Platform Ecosystem");
  }
  assert.equal((navbar.match(/<PlatformOverviewLink column=\{col\} onClose=\{onClose\}/g) || []).length, 2);
  assert.equal((navbar.match(/<StandaloneProductLinks links=\{item.standaloneLinks\} onClose=\{onClose\}/g) || []).length, 2);
  const overview = navbar.slice(navbar.indexOf("function PlatformOverviewLink"), navbar.indexOf("function StandaloneProductLinks"));
  assert.match(overview, /href=\{column.overviewHref\}/);
  assert.match(overview, /handleNavLinkClick\(column.overviewHref!, onClose\)/);
  assert.match(overview, /min-h-11/);
  assert.match(overview, /focus-visible:outline/);
  assert.doesNotMatch(overview, /target=|external: true/);
});

test("both product menus use the same-tab internal renderer and close on navigation", () => {
  const desktop = navbar.slice(navbar.indexOf('const sharedCls = "w-full'), navbar.indexOf("  function NavMenuLink("));
  const mobile = navbar.slice(navbar.indexOf("function MobileNavSection"), navbar.indexOf("function ResourcesMobileSection"));
  for (const [name, source] of [["desktop", desktop], ["mobile", mobile]]) {
    const internal = source.match(/: link\.href \? \(\s*(<Link[\s\S]*?)<\/Link>/)?.[1];
    assert.ok(internal, `${name} has an internal link branch`);
    assert.match(internal, /href=\{link.href\}/);
    assert.match(internal, /handleNavLinkClick\(link.href!, onClose\)/);
    assert.doesNotMatch(internal, /target=|opens in a new tab/);
  }
});

test("other platform navigation destinations remain external", () => {
  for (const url of ["https://insyt-survey.esoko.com/", "https://push.esoko.com/", "https://content-web.esoko.com/"]) {
    const entry = navbar.split("\n").find(line => line.includes(`href: '${url}'`));
    assert.ok(entry);
    assert.match(entry, /external: true/);
  }
});
