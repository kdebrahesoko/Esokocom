/** GET-only smoke check. Run once under next start and again under next dev. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const origin = process.env.ESOKO_CHECK_ORIGIN ||
  (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "");
assert.ok(origin, "Set ESOKO_CHECK_ORIGIN or run in the Replit preview workspace.");
async function get(path) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(45000) });
  return { response, html: await response.text() };
}
const api = async path => {
  const { response, html } = await get(path);
  assert.equal(response.status, 200, path);
  return JSON.parse(html);
};
const { resources } = await api("/api/resources?limit=100");
const resource = resources.find(r => r.typeSlug === "blog" && r.status === "Published");
assert.ok(resource, "A published blog is required for this read-only check.");
const { jobs } = await api("/api/jobs");
const job = jobs.find(j => j.status === "Published" && Date.parse(j.deadline) > Date.now());
assert.ok(job, "No published future-deadline vacancy available; do not fabricate one.");
const paths = [
  "/esoko-next/", "/esoko-next/resources/", "/esoko-next/resources/blog/",
  `/esoko-next/resources/blog/${encodeURIComponent(resource.slug)}/`,
  "/esoko-next/careers/", `/esoko-next/careers/${encodeURIComponent(job.id)}/`,
];
if (process.argv.includes("--company")) paths.push("/esoko-next/company/");
const offering = process.argv.includes("--offering");
const offeringPaths = [
  "/esoko-next/products-services/", "/esoko-next/sectors/", "/esoko-next/pricing/",
  ...["sectors", "solutions"].flatMap(kind =>
    [...readFileSync(new URL(`../src/data/${kind}.ts`, import.meta.url), "utf8").matchAll(/slug: '([^']+)'/g)]
      .map(match => `/esoko-next/${kind}/${match[1]}/`)),
];
if (offering) paths.push(...offeringPaths);
const offeringTitles = new Set();
for (const path of paths) {
  const { response, html } = await get(path);
  assert.equal(response.status, 200, path);
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head, `${path}: initial head missing`);
  assert.match(head, /<title>[^<]+<\/title>/, path);
  for (const [attribute, key] of [
    ["name", "description"], ["property", "og:title"], ["property", "og:description"],
    ["property", "og:image"], ["property", "og:url"], ["name", "twitter:card"],
    ["name", "twitter:image"],
  ]) {
    const tag = head.match(new RegExp(`<meta ${attribute}="${key}" content="([^"]+)"`));
    assert.ok(tag, `${path}: missing initial ${key}`);
    if (key === "og:url") {
      assert.equal(new URL(tag[1]).origin, new URL(origin).origin, `${path}: ${key} origin`);
    } else if (["og:image", "twitter:image"].includes(key)) {
      assert.ok([new URL(origin).origin, "https://images.unsplash.com"].includes(new URL(tag[1]).origin), `${path}: unexpected image origin`);
    }
    if (key === "og:url") assert.equal(tag[1], new URL(path, origin).href, `${path}: canonical OG URL`);
  }
  assert.match(head, /name="robots" content="[^"]*noindex/, path);
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/, path);
  assert.match(head, /rel="canonical" href="https?:\/\//, path);
  if (offeringPaths.includes(path)) {
    const title = head.match(/<title>([^<]+)<\/title>/)[1];
    assert.ok(!offeringTitles.has(title), `${path}: reused generic title`);
    offeringTitles.add(title);
  }
  if (path === `/esoko-next/careers/${encodeURIComponent(job.id)}/`) {
    assert.ok(html.includes(`/careers/${encodeURIComponent(job.id)}#apply`), "Original application handoff missing");
    assert.doesNotMatch(html, /<input[^>]*type="file"/, "Next must not mount an application upload form");
  }
  const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const organizations = structured.filter(value => value["@type"] === "Organization");
  assert.equal(organizations.length, path === "/esoko-next/" ? 1 : 0, `${path}: homepage-only Organization schema`);
  if (organizations[0]) {
    assert.equal(organizations[0].name, "Esoko");
    assert.equal(organizations[0].url, new URL("/esoko-next/", origin).href);
    assert.equal(organizations[0].logo, new URL("/esoko-next/site-assets/esoko-logo.png", origin).href);
    assert.equal(organizations[0].sameAs, undefined, "No organization social profile is evidenced by the existing site.");
  }
  console.log(`PASS 200, initial HTML metadata, canonical and noindex: ${path}`);
}
if (offering) {
  assert.equal(offeringTitles.size, 19);
  for (const [kind, message] of [["sectors", "Sector not found"], ["solutions", "Solution not found"]]) {
    const path = `/esoko-next/${kind}/not-a-real-source-slug/`;
    const { response, html } = await get(path);
    assert.equal(response.status, 404, path);
    assert.ok(html.includes(message), `${path}: source not-found copy missing`);
    assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
    console.log(`PASS 404, source error copy and noindex: ${path}`);
  }
}
console.log(`PASS ${paths.length} pages; open API vacancy ${job.id}. GET-only; no JavaScript or submissions.`);
