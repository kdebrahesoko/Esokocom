# Esoko development setup

## Supported setup

Use **Node.js 24.x** and **pnpm 10.26.1**. The root package declares these
requirements and `.nvmrc` selects Node 24. Current verification runs on Linux;
Windows/WSL instructions below have not been executed on a Windows machine.

For Windows, use **WSL2 with Ubuntu**, Git inside WSL, and VS Code's WSL
extension. Run repository commands from Ubuntu, not PowerShell. Keep the clone
under `~/projects/` rather than `/mnt/c/` for better filesystem performance.
Native Windows is not certified: some API and Expo scripts use POSIX syntax.
Do not share `node_modules` between Windows, WSL, and the remote environment.

To install WSL, run this in Administrator PowerShell, restart if requested,
then complete Ubuntu's first-run setup:

```powershell
wsl --install -d Ubuntu
```

Inside Ubuntu, install Git and Node 24 using your approved system tooling or
Node version manager. Install pnpm 10.26.1 once Node is available:

```bash
npm install --global pnpm@10.26.1
git --version
node --version
pnpm --version
```

## Install locked project dependencies

From the repository root:

```bash
pnpm install --frozen-lockfile --ignore-scripts
```

Do not use `npm install` for this workspace or delete/regenerate the lockfile
just to resolve an installation error. Packages already declare React, Vite,
Tailwind, Express, Drizzle, `pg`, TypeScript, Expo, and testing tools.

The workspace no longer excludes native packages for other operating systems.
pnpm selects the appropriate optional esbuild, Rollup, Tailwind Oxide and
Lightning CSS binaries for the current machine. A cross-platform lockfile
includes metadata for other platforms; this does not mean they all execute.

Lifecycle scripts remain disabled during setup. If a native package needs a
build hook, review that specific package's hook and obtain approval before
running a targeted rebuild. Do not enable all scripts, run an unattended
rebuild, or run the post-merge script as a local startup shortcut.

## Prepare the website's generated types

TypeScript project references consume generated declarations. Refresh only the
API client's declarations before the standalone website check:

```bash
pnpm --filter @workspace/esoko-website run typecheck:prepare
pnpm --filter @workspace/esoko-website run typecheck
```

This emits ignored files under `lib/api-client-react/dist` and its TypeScript
build metadata; it does not regenerate API contracts or database declarations.
Do not run OpenAPI code generation merely to install dependencies.

The broader root `pnpm run typecheck` builds declarations for all referenced
libraries before checking applications. That broader generation is not needed
for the website-only setup above.

## Run the website locally in WSL

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/esoko-website run dev
```

Open `http://localhost:5173`. These variables apply only to this command.
For a frontend production build:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/esoko-website run build
```

No database credentials are required to render static public pages. Features
that request `/api` need approved backend connectivity. Local Vite does not
provide Replit's shared routing proxy, so do not assume those features work
from port 5173 alone. Backend routing and authenticated integration need a
separate approved setup; do not point local tooling at production.

In the remote workspace, use the existing website workflow instead of starting
a duplicate server. Keep its managed service variables unchanged.

## Browser tests

On your local Ubuntu/WSL machine, install the Playwright browser and Linux
libraries (the dependency installation may request elevated permissions):

```bash
pnpm --filter @workspace/esoko-website exec playwright install --with-deps chromium
```

The test helper prefers Playwright's installed browser. In the Nix remote
environment, it can discover the provided system Chromium without a hardcoded
store hash. That fallback can differ from Playwright's pinned version and is
not equivalent evidence for exact pixel baselines. An explicitly configured
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` overrides discovery.

With the website already running:

```bash
pnpm --filter @workspace/esoko-website run test:leadership http://localhost:5173
PLAYWRIGHT_BASE_URL=http://localhost:5173 pnpm --filter @workspace/esoko-website run test:visual
```

The leadership check mocks API requests and performs no backend writes.
The legacy brand visual suite checks older page expectations and may report
unrelated mismatches. Missing baselines fail rather than being created during
comparison. Use `test:visual:update` only after explicitly reviewing and
approving replacement baselines.

## Database and backend safety

Use only the existing Replit-managed PostgreSQL database; do not substitute
another database or overwrite managed `DATABASE_URL`. Do not copy credentials
into this repository, use production resources, or run migrations/schema
pushes as part of dependency setup.

API startup is **not** a read-only test: administrator bootstrap and the
Resources scheduler may write data after readiness checks. Do not start the
API until the approved database/recovery verification permits it.
See [the database workflow](lib/db/README.md).

## Optional mobile development

For Expo development on a physical device, install Expo Go compatible with the
project's Expo SDK 54 and run from WSL with suitable host/network access:

```bash
pnpm --filter @workspace/esoko-mobile exec expo start --lan
```

The remote mobile `dev` script is Replit-specific; do not copy its managed
variables to your local shell. WSL networking may require additional setup for
a phone to reach Metro. Android emulators require Android Studio/SDK on the
host and separate connectivity configuration. An iOS simulator requires macOS;
it is not available on Windows. Local mobile connectivity is not yet certified.
