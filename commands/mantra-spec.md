---
name: mantra:spec
description: Produce a design spec in docs/core-mantra/specs/ from the aligned concept.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, halt and tell the user specs are skipped in lite — route them to `/mantra:build`.
2. Invoke `core/artifact-memory` to resolve the spec path.
3. Invoke the `lifecycle/writing-specs` skill and follow it exactly.
4. After writing, ask the user to review the file before `/mantra:plan`.

Commit the spec as `docs: add spec for <topic>`.
