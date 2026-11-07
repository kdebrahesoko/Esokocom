import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";
import {
  contactSchema, demoRequestSchema, validatePublicForm, submitPublicForm,
  DEMO_COUNTRIES, DEMO_USE_CASES,
} from "../src/lib/public-forms.ts";

const require = createRequire(import.meta.url);
const contact = { name: "TEST Contact", email: "qa@example.invalid", subject: "TEST only", message: "TEST mock message only" };
const demo = { name: "TEST Demo", email: "qa@example.invalid", organization: "TEST organization", country: "Ghana", useCase: DEMO_USE_CASES[0] };

/** Registration is stubbed; callbacks/DB imports can never execute. */
function apiSchemas() {
  const exports = {};
  const source = fs.readFileSync("artifacts/api-server/src/routes/submissions.ts", "utf8") +
    "\nexports.schemas = { contactSchema, demoRequestSchema };";
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, {
    exports, require: name => {
      if (name === "zod") return require("zod");
      if (name === "express") return { Router: () => ({ post() {} }) };
      if (name === "@workspace/db") return {};
      throw Error(`Unexpected import; refusing execution: ${name}`);
    },
  }, { timeout: 1000 });
  return exports.schemas;
}
const sourceSchemas = apiSchemas();
for (const [kind, input, schema, original] of [
  ["contact", contact, contactSchema, sourceSchemas.contactSchema],
  ["demo", demo, demoRequestSchema, sourceSchemas.demoRequestSchema],
]) {
  test(`${kind}: client schema matches unchanged API for required fields and all length/email boundaries`, () => {
    assert.deepEqual(Object.keys(schema.shape), Object.keys(original.shape));
    const samples = [input, {}, null, { ...input, email: "bad" }, { ...input, email: ".bad@example.invalid" }];
    for (const field of Object.keys(input)) {
      for (const length of [0, 1, 2, 9, 10, 100, 101, 200, 201, 1000, 1001, 2000, 2001])
        samples.push({ ...input, [field]: "x".repeat(length) });
      const missing = { ...input }; delete missing[field]; samples.push(missing);
    }
    for (const sample of samples) {
      const a = schema.safeParse(sample), b = original.safeParse(sample);
      assert.equal(a.success, b.success, JSON.stringify(sample)?.slice(0, 90));
      if (a.success) assert.deepEqual(a.data, b.data);
    }
  });
  test(`${kind}: invalid client data cannot call even the injected fetcher`, async () => {
    let calls = 0;
    await assert.rejects(submitPublicForm(kind, {}, async () => { calls++; throw Error("Must not call"); }), /highlighted/);
    assert.equal(calls, 0);
    assert.ok(Object.keys(validatePublicForm(kind, {})).length);
  });
  test(`${kind}: exact endpoint/body, 201 receipt; unknown fields stripped`, async () => {
    const receipt = await submitPublicForm(kind, { ...input, ignored: true }, async (url, init) => {
      assert.equal(url, kind === "demo" ? "/api/demo-requests" : "/api/contact");
      assert.equal(init.method, "POST");
      assert.deepEqual(JSON.parse(init.body), input);
      return new Response(JSON.stringify({ id: 900001, message: "MOCK ONLY" }), { status: 201 });
    });
    assert.deepEqual(receipt, { id: 900001, message: "MOCK ONLY" });
  });
  test(`${kind}: API validation, 429, 500, network and malformed successes cannot become success`, async () => {
    for (const status of [400, 429, 500]) {
      await assert.rejects(submitPublicForm(kind, input, async () => new Response(JSON.stringify({
        error: "MOCK rejection", details: { fieldErrors: { email: ["MOCK email error"] } },
      }), { status })), error => error.message === "MOCK rejection" && error.fieldErrors.email === "MOCK email error");
    }
    await assert.rejects(submitPublicForm(kind, input, async () => { throw Error("MOCK network"); }), /MOCK network/);
    for (const [status, body] of [[200, { id: 1, message: "bad status" }], [201, {}], [201, { id: -1, message: "bad ID" }], [201, { id: 1.5, message: "bad ID" }]]) {
      await assert.rejects(submitPublicForm(kind, input, async () => new Response(JSON.stringify(body), { status })), /unexpected confirmation/);
    }
  });
}
test("demo countries/use cases preserve the original selectable options and order", () => {
  const source = fs.readFileSync("artifacts/esoko-website/src/components/BookDemoModal.tsx", "utf8");
  const options = name => {
    const match = source.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]);`));
    return vm.runInNewContext(match[1]);
  };
  assert.deepEqual([...DEMO_COUNTRIES], [...options("COUNTRIES")]);
  assert.deepEqual([...DEMO_USE_CASES], [...options("USE_CASES")]);
});
