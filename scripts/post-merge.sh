#!/bin/bash
set -e
pnpm install --frozen-lockfile --ignore-scripts

printf '%s\n' \
  'Dependency installation complete; lifecycle scripts were disabled.' \
  'No database schema changes were applied.' \
  'Database preparation requires separate approval; see lib/db/README.md.'
