---
name: Workspace dependency scope
description: Why a filtered package addition still needs a whole-lockfile scope review.
---

Treat a pnpm package filter as a manifest target, not a guarantee that unrelated
workspace peer resolutions stay unchanged.

**Why:** A Next-only dependency addition also reselected React and Vite-related
peer resolutions for other workspace consumers. That would exceed an approval
limited to the new artifact even though their manifests were not edited.

**How to apply:** Review the entire lockfile diff after package operations,
including importers and peer snapshots. Preserve unrelated resolutions when
other artifacts are protected; do not introduce global overrides to make a
local addition work. Verify with the frozen lockfile and disable lifecycle
scripts when application startup or database operations are not authorized.

For one-off image processing, prefer installed tools rather than widening the
workspace dependency graph merely because an import fails.

**Why:** A transitive image processor was installed but not resolvable from the
chosen workspace package, and its compiled entry layout differed from older
versions. Neither failure demonstrated a missing dependency.

**How to apply:** Check package availability, resolution scope and declared
exports before proposing an installation or upgrade; keep media preparation
within the approved artifact scope.
