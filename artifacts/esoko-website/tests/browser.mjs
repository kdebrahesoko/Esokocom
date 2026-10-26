import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

// Use Playwright's matching browser locally. Nix provides a system Chromium in
// the remote environment; use that only when no downloaded browser is available.
export async function launchBrowser() {
  const explicitPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (explicitPath) {
    if (!existsSync(explicitPath)) {
      throw new Error('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH does not exist');
    }
    return chromium.launch({ headless: true, executablePath: explicitPath });
  }
  if (existsSync(chromium.executablePath())) {
    return chromium.launch({ headless: true });
  }
  if (process.platform === 'linux' && existsSync('/nix/store')) {
    const candidates = readdirSync('/nix/store').filter(name =>
      /playwright-chromium/.test(name),
    ).sort();
    for (const name of candidates) {
      const executablePath = join('/nix/store', name, 'chrome-linux', 'chrome');
      if (existsSync(executablePath)) {
        console.warn('Using Nix system Chromium; visual results may differ from the Playwright-pinned browser.');
        return chromium.launch({ headless: true, executablePath });
      }
    }
  }
  throw new Error('Chromium is missing. Run pnpm --filter @workspace/esoko-website exec playwright install chromium (Linux/WSL: add --with-deps).');
}
