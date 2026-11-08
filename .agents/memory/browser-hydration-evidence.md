---
name: Browser-injected hydration warnings
description: Distinguishing extension-injected attributes from genuine Next.js hydration defects.
---

The user-facing preview can report hydration warnings caused by browser-injected attributes even when fresh extension-free browser contexts hydrate correctly. On 2026-11-08 the reported diff contained `fdprocessedid`, `data-scribe-recorder-ready`, `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed`; these attributes were absent from server HTML and clean-browser DOMs.

**Why:** Altering application rendering or suppressing warnings would conceal the symptom without preventing the browser extensions from modifying the document.

**How to apply:** Inspect the current full attribute diff and compare server HTML with a fresh extension-free browser before changing code. Attribute differences matching this evidence warrant disabling the responsible extensions for the preview and reloading, not blanket suppression. This finding does not prove that every future hydration warning is extension-related; reproduce each new mismatch independently.
