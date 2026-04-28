---
name: mantra:cook
description: Stress-test a plan or design through relentless one-at-a-time Q&A, resolving every decision branch before committing.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, limit the session to the 3 highest-risk decision branches.
2. Invoke the `lifecycle/cook-me` skill and follow it exactly.
3. At the end, surface the decision summary and suggest the appropriate next step: `/mantra:spec` if no spec exists yet, or `/mantra:plan` if a spec is already in place.

Do not write code. Do not create artifacts — that is `/mantra:spec`'s job.
