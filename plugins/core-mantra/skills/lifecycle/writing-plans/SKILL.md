---
name: writing-plans
description: Use after a spec is approved to produce a bite-sized TDD implementation plan in docs/core-mantra/plans/. Each task has exact file paths, complete code per step, exact commands with expected output, and a commit step. No placeholders.
type: lifecycle
---

## Purpose

Turn a spec into tasks an engineer with no context can execute.

## Process

1. Load the approved spec.
2. Map out every file that will be created or modified. Group into phases.
3. For each task, write:
   - **Files** list (create / modify with line ranges / test path)
   - Steps: write failing test → run it → implement → run passes → commit
   - Complete code in each code-producing step. Never "similar to Task N".
4. Self-review: spec coverage, placeholders, type consistency.
5. Save to `docs/core-mantra/plans/YYYY-MM-DD-<topic>-plan.md` via `artifact-memory`.

## Hard rules

- Every step that changes code must include the code.
- Every test step must include the exact test command and expected output.
- Never write "TBD", "fill in later", "add error handling" without concrete content.
