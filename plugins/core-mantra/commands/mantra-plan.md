---
name: mantra:plan
description: Turn an approved spec into a bite-sized TDD plan in docs/core-mantra/plans/.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, halt and route to `/mantra:build`.
2. Require an approved spec path. If missing, route to `/mantra:spec`.
3. Invoke `lifecycle/writing-plans` and follow it exactly.
4. After writing, ask the user to review before `/mantra:build`.

Commit as `docs: add plan for <topic>`.
