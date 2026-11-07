/**
 * MOCK-ONLY development browser verification. Every HTTP write is intercepted.
 * Uses the existing workspace Playwright dependency; no application/API imports.
 * Optional --browser=/path/to/chromium; otherwise Playwright's installed browser.
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";

assert.ok(process.env.REPLIT_DEV_DOMAIN, "Run against this workspace's development preview only");
const origin = `https://${process.env.REPLIT_DEV_DOMAIN}`;
const require = createRequire(new URL("../../esoko-website/package.json", import.meta.url));
const { chromium } = require("@playwright/test");
const executablePath = process.argv.find(x => x.startsWith("--browser="))?.slice(10);
const browser = await chromium.launch({ headless: true, ...(executablePath && { executablePath }), args: ["--no-sandbox"] });
const context = await browser.newContext({ serviceWorkers: "block" });
const writes = [], blocked = [], errors = [];
let mode = "400", release;
const receipts = { "/api/contact": 900101, "/api/demo-requests": 900102 };
await context.route("**/*", async route => {
  const req = route.request();
  if (["GET", "HEAD"].includes(req.method())) return route.continue();
  const path = new URL(req.url()).pathname;
  if (new URL(req.url()).origin !== origin || req.method() !== "POST" ||
      !(path in receipts || /^\/api\/jobs\/[^/]+\/apply$/.test(path))) {
    blocked.push(`${req.method()} ${path}`); return route.abort("blockedbyclient");
  }
  writes.push({ path, body: req.postData(), headers: req.headers() });
  if (mode === "network") return route.abort("failed");
  if (mode === "deferred") await new Promise(resolve => { release = resolve; });
  const status = mode === "400" ? 400 : mode === "500" ? 500 : 201;
  const body = status !== 201
    ? { error: "MOCK rejection", details: { fieldErrors: { email: ["MOCK email error"] } } }
    : mode === "malformed" ? { unexpected: true }
      : { id: receipts[path] ?? 900103, message: "MOCK submission received — no real record" };
  return route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
});
const page = await context.newPage();
page.on("pageerror", error => errors.push(error.message));
page.setDefaultTimeout(15000);

try {
  for (const kind of ["contact", "demo"]) {
    mode = "400";
    await page.goto(`${origin}/esoko-next/${kind === "contact" ? "#contact" : "demo/"}`);
    const form = page.getByTestId(`form-${kind}`);
    const submit = page.getByTestId(`button-${kind}-submit`);
    await submit.waitFor();
    await page.waitForFunction(id => !document.querySelector(`[data-testid="${id}"]`)?.disabled, `button-${kind}-submit`);
    const start = writes.length;
    await submit.click();
    await page.getByTestId(`error-${kind}-name`).waitFor();
    assert.equal(writes.length, start, "Invalid empty input reached a fetch");
    await page.getByTestId(`input-${kind}-name`).fill("TEST MOCK ONLY");
    const email = page.getByTestId(`input-${kind}-email`);
    await email.fill("not-an-email");
    if (kind === "contact") {
      await page.getByTestId("input-contact-subject").fill("TEST mock only");
      await page.getByTestId("input-contact-message").fill("TEST intercepted message, not sent.");
    } else {
      await page.getByTestId("input-demo-organization").fill("TEST mock organization");
      await page.getByTestId("select-demo-country").selectOption("Ghana");
      await page.getByTestId("select-demo-usecase").selectOption({ index: 1 });
    }
    await submit.click();
    await page.getByTestId(`error-${kind}-email`).waitFor();
    assert.equal(writes.length, start, "Invalid email reached a fetch");
    await email.fill("qa@example.invalid");
    for (const failure of ["400", "500", "network", "malformed"]) {
      mode = failure;
      const before = writes.length;
      await submit.click();
      await page.getByTestId(`${kind}-server-error`).waitFor();
      await page.waitForFunction(id => !document.querySelector(`[data-testid="${id}"]`)?.disabled, `button-${kind}-submit`);
      assert.equal(writes.length, before + 1);
      assert.equal(await email.inputValue(), "qa@example.invalid", "Error discarded input");
    }
    mode = "deferred"; release = undefined;
    const before = writes.length;
    await form.evaluate(el => { el.requestSubmit(); el.requestSubmit(); });
    for (let i = 0; i < 100 && !release; i++) await new Promise(r => setTimeout(r, 25));
    assert.ok(release, "Mock success request not observed");
    assert.equal(await submit.isDisabled(), true);
    assert.equal(writes.length, before + 1, "Duplicate submit bypassed in-flight guard");
    release();
    await page.getByTestId(`${kind}-success`).waitFor();
    assert.match(await page.getByTestId(`${kind}-success-reference`).innerText(), /90010[12]/);
    await page.getByTestId(`${kind}-success-reset`).click();
    assert.equal(await page.getByTestId(`input-${kind}-name`).inputValue(), "");
    console.log(`PASS ${kind}: invalid input blocked; mocked 400/500/network/malformed; pending/double-submit; success/reset`);
  }

  const response = await fetch(`${origin}/api/jobs`);
  assert.equal(response.status, 200);
  const { jobs } = await response.json();
  const job = jobs.find(j => j.status === "Published" && Date.parse(j.deadline) > Date.now()) ??
    jobs.find(j => j.status === "Published");
  assert.ok(job, "No published job: stop rather than create one");
  console.log(`Published application UI target: ${job.id} (${job.title}); no application record created.`);
  await page.goto(`${origin}/esoko-next/careers/${encodeURIComponent(job.id)}/#apply`);
  const form = page.locator('form[action^="/api/jobs/"]');
  const submit = form.locator('button[type="submit"]');
  await submit.waitFor();
  const before = writes.length;
  await submit.click();
  assert.equal(writes.length, before, "Empty application reached a fetch");
  const name = form.locator('input:not([type="email"]):not([type="file"]):not([type="tel"])').first();
  await name.fill("TEST MOCK APPLICANT");
  await form.locator('input[type="email"]').fill("qa@example.invalid");
  const cv = form.locator('input[type="file"]');
  await cv.setInputFiles({ name: "TEST-invalid.txt", mimeType: "text/plain", buffer: Buffer.from("MOCK") });
  await submit.click();
  await form.getByRole("alert").waitFor();
  assert.equal(writes.length, before, "Invalid CV type reached a fetch");
  await cv.setInputFiles({ name: "TEST-too-large.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(5 * 1024 * 1024 + 1) });
  await submit.click();
  await form.getByRole("alert").waitFor();
  assert.equal(writes.length, before, "Oversized CV reached a fetch");
  await cv.setInputFiles({ name: "TEST-mock.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\nMOCK ONLY\n%%EOF") });
  for (const failure of ["400", "500", "network", "malformed"]) {
    mode = failure;
    const count = writes.length;
    await submit.click();
    await form.getByRole("alert").waitFor();
    await page.waitForFunction(() => !document.querySelector('form[action^="/api/jobs/"] button[type="submit"]')?.disabled);
    assert.equal(writes.length, count + 1);
    assert.equal(await name.inputValue(), "TEST MOCK APPLICANT");
    assert.equal(await cv.evaluate(el => el.files[0]?.name), "TEST-mock.pdf");
  }
  mode = "success";
  await submit.click();
  await page.getByRole("status").filter({ hasText: "MOCK submission received" }).waitFor();
  const last = writes.at(-1);
  assert.match(last.headers["content-type"], /^multipart\/form-data; boundary=/);
  assert.match(last.body, /filename="TEST-mock.pdf"/);
  assert.match(last.body, /Content-Type: application\/pdf/i);
  assert.match(last.body, /qa@example.invalid/);
  assert.equal(blocked.length, 0, `Unexpected writes attempted: ${blocked}`);
  assert.deepEqual(errors, [], "Uncaught page exceptions");
  assert.equal(writes.length, 15, "Expected exactly five mocked requests for each form");
  console.log("PASS application: native required validation; rejected MIME/size; mocked errors retain CV; multipart success");
  console.log("PASS safety: 15 POST requests fulfilled/aborted locally; ZERO HTTP writes forwarded; ZERO real records/uploads.");
  console.log("Reference IDs 900101–900103 are synthetic mock values, not database IDs.");
} finally {
  await context.close();
  await browser.close();
}
