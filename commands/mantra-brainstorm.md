---
name: mantra:brainstorm
description: Refine an idea into aligned requirements through one-question-at-a-time Q&A and 2-3 proposed approaches.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, reduce Q&A to ≤2 clarifying questions and skip the 2-3 approaches step.
2. Invoke the `lifecycle/brainstorming` skill and follow it exactly.
3. At the end, produce an inline concept summary and hand off: suggest running `/mantra:spec` next.

Do not write any code. Do not create artifacts — that's `/mantra:spec`'s job.
