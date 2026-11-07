import test from "node:test";
import assert from "node:assert/strict";
import { siteHref, normalizeSitePath, EXISTING_CONTACT_HREF } from "../src/lib/site-links.ts";

for (const [input, output] of [
  ["/", "/esoko-next/"],
  ["/resources", "/esoko-next/resources/"],
  ["/resources/blog", "/esoko-next/resources/blog/"],
  ["/resources/blog/example?source=home#article", "/esoko-next/resources/blog/example/?source=home#article"],
  ["/careers", "/esoko-next/careers/"],
  ["/careers/senior-software-engineer/", "/esoko-next/careers/senior-software-engineer/"],
  ["/#solutions", "/esoko-next/#solutions"],
  ["#resources", "#resources"],
  ["/esoko-next/resources/", "/esoko-next/resources/"],
  ["/company#leadership", "/company#leadership"],
  ["/products-services", "/products-services"],
  ["/sectors/agriculture", "/sectors/agriculture"],
  ["/solutions/insyt", "/solutions/insyt"],
  ["/pricing", "/pricing"],
  ["/admin/login?role=hr", "/admin/login?role=hr"],
  ["/admin/login?role=content", "/admin/login?role=content"],
  ["https://example.invalid/resources", "https://example.invalid/resources"],
  ["mailto:info@example.invalid", "mailto:info@example.invalid"],
  ["tel:+0000000000", "tel:+0000000000"],
]) {
  test(`routes ${input} without escaping/double-prefixing the intended site`, () => {
    assert.equal(siteHref(input), output);
  });
}
test("contact/demo handoff explicitly retains the original website", () => {
  assert.equal(EXISTING_CONTACT_HREF, "/#contact");
});
test("active path normalizes trailing slashes and empty input", () => {
  assert.equal(normalizeSitePath("/careers/"), "/careers");
  assert.equal(normalizeSitePath("/"), "/");
  assert.equal(normalizeSitePath(null), "/");
});
