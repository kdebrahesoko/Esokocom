/** GET-only smoke check. Run once under next start and again under next dev. */
import assert from "node:assert/strict";
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
    if (["og:url", "og:image", "twitter:image"].includes(key)) {
      assert.equal(new URL(tag[1]).origin, new URL(origin).origin, `${path}: ${key} origin`);
    }
    if (key === "og:url") assert.equal(tag[1], new URL(path, origin).href, `${path}: canonical OG URL`);
  }
  assert.match(head, /name="robots" content="[^"]*noindex/, path);
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/, path);
  assert.match(head, /rel="canonical" href="https?:\/\//, path);
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
console.log(`PASS ${paths.length} pages; open API vacancy ${job.id}. GET-only; no JavaScript or submissions.`);
