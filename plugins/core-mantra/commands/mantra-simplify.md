---
name: mantra:simplify
description: Post-build code-health pass on files changed by this feature.
---

When invoked:

1. Identify files changed in this feature (git diff against the branch base or last ship tag).
2. Invoke `discipline/simplify` and follow it. Scope is limited to changed files.
3. Commit approved removals per category.
4. Re-run tests after each commit.
