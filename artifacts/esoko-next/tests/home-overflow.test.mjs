import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

for (const file of ["DeveloperSection", "ContactHandoffSection"]) {
  test(`${file} does not shift its right-hand card beyond the mobile viewport`, async () => {
    const source = await readFile(new URL(`../src/components/home/sections/${file}.tsx`, import.meta.url), "utf8");
    assert.doesNotMatch(source, /initial=\{\{[^}]*\bx:\s*20\b/);
    assert.match(source, /initial=\{\{\s*opacity:\s*0,\s*y:\s*20\s*\}\}[\s\S]*?whileInView=\{\{\s*opacity:\s*1,\s*y:\s*0\s*\}\}/);
  });
}
