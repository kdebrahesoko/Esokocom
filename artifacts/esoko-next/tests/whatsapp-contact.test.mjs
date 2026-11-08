import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { WHATSAPP_BUSINESS_NUMBER, WHATSAPP_GREETING, WHATSAPP_CHAT_URL } from "../src/lib/whatsapp.ts";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("WhatsApp destination uses the approved international number and exactly encoded greeting", () => {
  assert.equal(WHATSAPP_BUSINESS_NUMBER, "+233552783253");
  const url = new URL(WHATSAPP_CHAT_URL);
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/233552783253");
  assert.equal(url.searchParams.get("text"), "Hello Esoko, I'd like to learn more about your products and services.");
  assert.equal(url.searchParams.get("text"), WHATSAPP_GREETING);
  assert.deepEqual([...url.searchParams.keys()], ["text"]);
});

test("WhatsApp shortcut is a shared server-rendered outbound link, not an automatic messaging widget", async () => {
  const component = await read("../src/components/site/WhatsAppContact.tsx");
  const layout = await read("../src/app/layout.tsx");
  assert.equal((layout.match(/<WhatsAppContact\s*\/>/g) ?? []).length, 1);
  assert.match(component, /href=\{WHATSAPP_CHAT_URL\}/);
  assert.match(component, /target="_blank"/);
  assert.match(component, /rel="noopener noreferrer"/);
  assert.match(component, /Chat on WhatsApp/);
  assert.match(component, /opens in a new tab/);
  assert.doesNotMatch(component, /["']use client["']|useEffect|fetch\(|<script|onClick|iframe/);
});

test("contact placement uses existing tokens and separates the demo shortcut without changing its behavior", async () => {
  const css = await read("../src/components/site/whatsapp-contact.css");
  const demo = await read("../src/components/home/FloatingCTA.tsx");
  assert.match(css, /env\(safe-area-inset-bottom/);
  assert.match(css, /min-height: calc\(var\(--spacing\) \* 12\)/);
  assert.match(css, /:focus-visible/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|@import|animation:|transition:/i);
  assert.match(demo, /className="floating-demo-shortcut fixed/);
  assert.match(demo, /scrollPct >= 0\.4/);
  assert.match(demo, /rect\.top < window\.innerHeight \* 0\.85/);
  assert.match(demo, /sessionStorage\.getItem\(DISMISSED_KEY\)/);
  assert.match(demo, /sessionStorage\.setItem\(DISMISSED_KEY, '1'\)/);
  assert.match(demo, /visible && !isOpen && !dismissed/);
  assert.match(demo, /href=\{DEMO_HREF\}/);
});
