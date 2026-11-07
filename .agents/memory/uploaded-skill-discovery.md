---
name: Uploaded skill discovery
description: Locate user-supplied skills across earlier uploads before requesting them again.
---

When locating an uploaded project skill, search existing Markdown uploads by
their YAML `name` before concluding the source is missing. Do not limit the
search to the latest attachment list or infer identity from a filename.

**Why:** The general frontend skill was available in an earlier upload while
the newest pair contained two versions of the Esoko skill. Checking only that
pair led to repeated unnecessary upload requests.

**How to apply:** Search the upload directory, read candidate frontmatter, then
read the complete matching source before installation. Preserve the genuine
skill contents and project-specific precedence; do not substitute a duplicate
under a different name.
