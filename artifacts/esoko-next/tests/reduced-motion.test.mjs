import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, readdir } from 'node:fs/promises';
import { useReducedMotion } from '../src/hooks/use-reduced-motion.ts';

test('motion preference has a deterministic server snapshot without browser globals', () => {
  function Probe() {
    return createElement('span', { 'data-reduced': useReducedMotion() }, 'Motion');
  }
  assert.equal(renderToString(createElement(Probe)), '<span data-reduced="false">Motion</span>');
});

test('the hydration-safe preference subscribes to browser changes with cleanup', async () => {
  const source = await readFile(new URL('../src/hooks/use-reduced-motion.ts', import.meta.url), 'utf8');
  assert.match(source, /useSyncExternalStore\(subscribe, clientSnapshot, serverSnapshot\)/);
  assert.match(source, /const serverSnapshot = \(\) => false/);
  assert.match(source, /window\.matchMedia\(query\)\.matches/);
  assert.match(source, /addEventListener\('change', onChange\)/);
  assert.match(source, /removeEventListener\('change', onChange\)/);
});

test('no migrated component reads Framer Motion reduced-motion state during hydration', async () => {
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      if (entry.isDirectory()) await inspect(url);
      else if (/\.tsx?$/.test(entry.name)) {
        const source = await readFile(url, 'utf8');
        assert.doesNotMatch(source, /import\s*\{[^}]*useReducedMotion[^}]*\}\s*from\s*['"]framer-motion['"]/, url.pathname);
      }
    }
  }
  await inspect(new URL('../src/components/', import.meta.url));
});
