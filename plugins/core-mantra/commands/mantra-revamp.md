---
name: mantra:revamp
description: Surface architectural friction and propose deepening opportunities — refactors that turn shallow modules into deep ones for better testability and AI-navigability.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, limit exploration to the 3 highest-friction areas only.
2. Invoke the `discipline/core-architectural-revamp` skill and follow it exactly.
3. At the end of the grilling loop, suggest the appropriate next step: `/mantra:spec` to capture the agreed design, or `/mantra:plan` if a spec already exists.

Do not write implementation code. Do not create ADRs or update CONTEXT.md outside the grilling loop — those side effects happen inline as decisions crystallize.
