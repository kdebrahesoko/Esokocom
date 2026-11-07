import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");

async function files(directory) {
  const result = [];
  for (const item of await fs.readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${item.name}`;
    if (item.isDirectory()) result.push(...await files(path));
    else if (/\.(tsx?|jsx?)$/.test(item.name)) result.push(path);
  }
  return result;
}

test("native anchors cannot hardcode existing-site root paths outside the route boundary", async () => {
  const root = new URL("../src", import.meta.url).pathname;
  const violations = [];
  for (const path of await files(root)) {
    const source = ts.createSourceFile(path, await fs.readFile(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = node => {
      if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(source) === "a") {
        for (const attr of node.attributes.properties) {
          if (ts.isJsxAttribute(attr) && attr.name.getText(source) === "href" && attr.initializer &&
            ts.isStringLiteral(attr.initializer) && /^\/(?!\/)/.test(attr.initializer.text)) {
            const line = source.getLineAndCharacterOfPosition(attr.pos).line + 1;
            violations.push(`${path}:${line}: use SiteLink, siteHref or a route-map constant`);
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
  assert.deepEqual(violations, []);
});
