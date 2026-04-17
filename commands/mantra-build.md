---
name: mantra:build
description: Execute an approved plan task-by-task with TDD enforcement.
---

When invoked:

1. Invoke `core/mode-detector`.
2. In `full` mode, invoke `discipline/subagent-driven-dev` and follow it.
3. In `standard` or `lite` mode, invoke `lifecycle/executing-plans` and follow it.
4. In every mode, `discipline/tdd-red-green` is auto-triggered per task. Do not write implementation code before a failing test.
5. Update `progress.md` after every task.

On any test failure or unexpected behavior, invoke `discipline/systematic-debugging`.
