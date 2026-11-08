import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = path => readFile(new URL(path, import.meta.url), "utf8");
const sectionPath = "../src/components/home/sections/WhoIsEsokoSection.tsx";
const playerPath = "../src/components/home/sections/StoryVideos.tsx";

test("the introduction keeps approved exact copy and the centrally routed Company link on the server", async () => {
  const source = await read(sectionPath);
  const normalized = source.replace(/\s+/g, " ");
  assert.match(normalized, /Who is Esoko\?/);
  assert.ok(normalized.includes("Esoko was founded in 2008 to use the power of mobile phones to connect farmers to markets. Today, we are one of Africa’s leading agritech companies, helping organizations that work in rural communities with innovative technology."));
  assert.match(source, /<SiteLink className="esoko-story-about-link" href="\/company\/">/);
  assert.match(source, /Learn more about Esoko/);
  assert.doesNotMatch(source, /["']use client["']/);
});

test("the approved introduction occurs once, directly after trust and before retained about/services", async () => {
  const home = await read("../src/app/page.tsx");
  const opening = await read("../src/components/home/QuietSignalOpening.tsx");
  assert.equal((home.match(/<WhoIsEsokoSection\s*\/>/g) ?? []).length, 1);
  assert.match(home, /<TrustSection \/>\s*<WhoIsEsokoSection \/>/);
  assert.match(opening, /\{afterHero\}\s*<section className="qsr-about"/);
  assert.ok(opening.indexOf('className="qsr-about"') < opening.indexOf('className="qsr-services"'));
});

test("video previews use optimized lazy thumbnails and exactly the three supplied IDs without tracking parameters", async () => {
  const source = await read(playerPath);
  const config = await read("../next.config.ts");
  for (const id of ["5TRjt4fyrU0", "NIzzcknUmRY", "QJwhX5rIFmg"]) {
    assert.match(source, new RegExp(`id: "${id}"`));
    assert.ok(config.includes(`"${id}"`));
  }
  assert.equal((source.match(/\{ id:/g) ?? []).length, 3);
  assert.match(source, /import Image from "next\/image"/);
  assert.match(source, /<Image[\s\S]*?alt=""[\s\S]*?fill[\s\S]*?sizes=/);
  assert.match(config, /hostname: "i\.ytimg\.com"/);
  assert.match(config, /pathname: `\/vi\/\$\{id\}\/hqdefault\.jpg`/);
  assert.doesNotMatch(source, /si=|priority|<script|youtube\.com\/iframe_api/);
});

test("only user activation creates a privacy-enhanced player, with stop, focus restoration and fallback", async () => {
  const source = await read(playerPath);
  assert.match(source, /useState<string \| null>\(null\)/);
  assert.match(source, /playing \? \([\s\S]*?<iframe/);
  assert.match(source, /https:\/\/www\.youtube-nocookie\.com\/embed\/\$\{video\.id\}\?autoplay=1/);
  assert.match(source, /aria-label=\{`Play video: \$\{video\.title\}`\}/);
  assert.match(source, /setActiveId\(video\.id\)/);
  assert.match(source, /setActiveId\(null\)/);
  assert.match(source, /triggers\.current\[previous\]\?\.focus\(\)/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /target="_blank"\s*rel="noopener noreferrer"/);
  assert.match(source, /Player not loading\? Watch on YouTube/);
  assert.match(source, /onError=/);
});
