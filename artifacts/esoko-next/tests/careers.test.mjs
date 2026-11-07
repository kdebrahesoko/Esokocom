import test from "node:test";
import assert from "node:assert/strict";
import {
  validateApplication, applicationData, submitApplication, deadlineDate, jobIsExpired,
  CV_MAX_BYTES, CV_TYPES,
} from "../src/lib/careers.ts";

const input = (values = {}) => ({
  name: " Example Candidate ", email: " example@example.invalid ",
  phone: "", coverLetter: "", questions: [], answers: [], cv: null, ...values,
});

test("requires a nonblank candidate name", () => {
  assert.match(validateApplication(input({ name: " " })), /name/);
});
test("rejects malformed email without a request", () => {
  assert.match(validateApplication(input({ email: "invalid" })), /email/);
});
test("CV remains optional", () => assert.equal(validateApplication(input()), null));
for (const mime of CV_TYPES) {
  test(`accepts existing backend CV type ${mime}`, () => {
    assert.equal(validateApplication(input({ cv: new File(["cv"], "document", { type: mime }) })), null);
  });
}
test("rejects unsupported CV type", () => {
  assert.match(validateApplication(input({ cv: new File(["bad"], "bad.exe", { type: "application/octet-stream" }) })), /PDF or Word/);
});
test("accepts exactly the backend's 5 MB boundary", () => {
  const cv = new File([new Uint8Array(CV_MAX_BYTES)], "cv.pdf", { type: "application/pdf" });
  assert.equal(validateApplication(input({ cv })), null);
});
test("rejects a CV above the backend size limit", () => {
  const cv = new File([new Uint8Array(CV_MAX_BYTES + 1)], "cv.pdf", { type: "application/pdf" });
  assert.match(validateApplication(input({ cv })), /5 MB/);
});
test("rejects more than 20 custom answers", () => {
  assert.match(validateApplication(input({ questions: Array(21).fill("Question") })), /questions/);
});
test("answers remain optional", () => {
  const data = applicationData(input({ questions: ["Question"] }));
  assert.deepEqual(JSON.parse(data.get("answers")), [{ question: "Question", answer: "" }]);
});
test("rejects answers beyond the backend storage length", () => {
  assert.match(validateApplication(input({ answers: ["x".repeat(2001)] })), /2,000/);
});
test("multipart trims identity and omits blank optional fields", () => {
  const data = applicationData(input());
  assert.equal(data.get("name"), "Example Candidate");
  assert.equal(data.get("email"), "example@example.invalid");
  for (const name of ["phone", "coverLetter", "cv", "answers"]) assert.equal(data.has(name), false);
});
test("multipart retains optional CV, text and ordered question/answer pairs", () => {
  const cv = new File(["cv"], "cv.pdf", { type: "application/pdf" });
  const data = applicationData(input({
    cv, phone: " 000 ", coverLetter: " letter ", questions: ["A", "B"], answers: ["one", "two"],
  }));
  assert.equal(data.get("cv").name, "cv.pdf");
  assert.equal(data.get("phone"), "000");
  assert.equal(data.get("coverLetter"), "letter");
  assert.deepEqual(JSON.parse(data.get("answers")), [{ question: "A", answer: "one" }, { question: "B", answer: "two" }]);
});
test("invalid local input never reaches injected fetch", async () => {
  let calls = 0;
  await assert.rejects(submitApplication("job", input({ name: "" }), async () => { calls++; throw Error("Unexpected request"); }), /name/);
  assert.equal(calls, 0);
});
test("mocked submission uses the real multipart API contract and 201 confirmation", async () => {
  let calls = 0;
  const message = await submitApplication("senior-engineer", input(), async (url, init) => {
    calls++;
    assert.equal(url, "/api/jobs/senior-engineer/apply");
    assert.equal(init.method, "POST");
    assert.ok(init.body instanceof FormData);
    assert.equal(init.headers, undefined); // Browser must supply multipart boundary.
    return new Response(JSON.stringify({ id: 42, message: "Application submitted" }), { status: 201 });
  });
  assert.equal(calls, 1);
  assert.equal(message, "Application submitted");
});
test("mocked closed-job response is not success", async () => {
  await assert.rejects(submitApplication("job", input(), async () =>
    new Response(JSON.stringify({ error: "Job not accepting applications" }), { status: 404 })), /not accepting/);
});
test("unexpected success payload does not fabricate confirmation", async () => {
  await assert.rejects(submitApplication("job", input(), async () =>
    new Response("{}", { status: 200 })), /unexpected confirmation/);
});
test("mocked non-JSON error stays a failure", async () => {
  await assert.rejects(submitApplication("job", input(), async () =>
    new Response("Unavailable", { status: 503 })), /HTTP 503/);
});
test("network errors are not converted into success", async () => {
  await assert.rejects(submitApplication("job", input(), async () => { throw Error("Network unavailable"); }), /Network unavailable/);
});
test("known deadlines parse strictly; impossible or ambiguous dates do not", () => {
  assert.equal(deadlineDate("September 30, 2026"), "2026-09-30");
  assert.equal(deadlineDate("2026-12-31"), "2026-12-31");
  assert.equal(deadlineDate("February 30, 2026"), null);
  assert.equal(deadlineDate("Dec 2026"), null);
});
test("expired deadline detection is deterministic without changing global time", () => {
  assert.equal(jobIsExpired({ deadline: "September 30, 2026" }, Date.parse("2026-11-07")), true);
  assert.equal(jobIsExpired({ deadline: "December 31, 2026" }, Date.parse("2026-11-07")), false);
});
