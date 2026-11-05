---
name: Visual baseline review
description: Handling browser-sensitive visual snapshot differences without masking regressions.
---

When a visual snapshot fails after unrelated work, verify the current element against its saved image, expected colors, dimensions, and relevant change history before changing application code or refreshing a baseline.

**Why:** The environment's fallback Chromium can differ from the browser that generated older snapshots. A small button snapshot can exceed its pixel threshold because of text and rounded-edge rasterization even when its appearance and brand color remain correct.

**How to apply:** Preserve comparison thresholds. Wait for fonts before capturing, and refresh only an individually reviewed snapshot when authorized; do not regenerate unrelated baselines to clear a failing check.
