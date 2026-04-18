---
name: mantra:review
description: Multi-agent review before ship. Dispatches spec-reviewer, plan-reviewer, code-reviewer in parallel.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, dispatch only `code-reviewer`.
2. Otherwise invoke `lifecycle/reviewing-code` and follow it. It will dispatch `spec-reviewer`, `plan-reviewer`, `code-reviewer` in parallel.
3. Aggregate findings; present blockers first.
4. On blockers, route to `/mantra:build` or `/mantra:debug` as appropriate.
5. On clean, write `reviewed: YYYY-MM-DD` to progress.md Decisions.
