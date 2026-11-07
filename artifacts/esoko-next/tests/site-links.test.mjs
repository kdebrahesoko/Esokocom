import test from "node:test";
import assert from "node:assert/strict";
import { siteHref, normalizeSitePath, CONTACT_HREF, DEMO_HREF, applicationHref, SITE_ROUTES } from "../src/lib/site-links.ts";

for (const [input, output] of [
  ["/", "/esoko-next/"],
  ["/resources", "/esoko-next/resources/"],
  ["/resources/blog", "/esoko-next/resources/blog/"],
  ["/resources/blog/example?source=home#article", "/esoko-next/resources/blog/example/?source=home#article"],
  ["/careers", "/esoko-next/careers/"],
  ["/careers/senior-software-engineer/", "/esoko-next/careers/senior-software-engineer/"],
  ["/#solutions", "/esoko-next/#solutions"],
  ["/#contact", "/esoko-next/#contact"],
  ["/demo", "/esoko-next/demo/"],
  ["#resources", "#resources"],
  ["/esoko-next/resources/", "/esoko-next/resources/"],
  ["/company#leadership", "/esoko-next/company/#leadership"],
  ["/products-services", "/esoko-next/products-services/"],
  ["/products-services#software-dev", "/esoko-next/products-services/#software-dev"],
  ["/sectors/agriculture", "/esoko-next/sectors/agriculture/"],
  ["/sectors", "/esoko-next/sectors/"],
  ["/solutions/insyt", "/esoko-next/solutions/insyt/"],
  ["/pricing", "/esoko-next/pricing/"],
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
test("contact, demo and application destinations stay in Next; staff remains separate", () => {
  assert.equal(CONTACT_HREF, "/esoko-next/#contact");
  assert.equal(DEMO_HREF, "/esoko-next/demo/");
  assert.equal(applicationHref("test-job"), "/esoko-next/careers/test-job/#apply");
  assert.equal(siteHref("/admin/login"), "/admin/login");
});
test("active path normalizes trailing slashes and empty input", () => {
  assert.equal(normalizeSitePath("/careers/"), "/careers");
  assert.equal(normalizeSitePath("/"), "/");
  assert.equal(normalizeSitePath(null), "/");
});

test("legacy destination changes are controlled by the route map, not page components", () => {
  const before = SITE_ROUTES.existingSiteBase;
  try {
    SITE_ROUTES.existingSiteBase = "https://legacy.example.invalid";
    for (const path of ["/admin", "/admin/login?role=hr", "/admin/resources/new"]) {
      assert.equal(siteHref(path), `https://legacy.example.invalid${path}`);
    }
    assert.equal(siteHref("/company#team"), "/esoko-next/company/#team");
    assert.equal(siteHref("/api/storage/public-objects/test.pdf"), "/api/storage/public-objects/test.pdf");
  } finally { SITE_ROUTES.existingSiteBase = before; }
});
