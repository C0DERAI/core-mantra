---
name: executing-plans
description: Use to execute an approved plan task-by-task in the current session. Reads one task at a time, runs each step, updates progress.md after every task, and pauses at checkpoints.
type: lifecycle
---

## Purpose

Turn a written plan into working code without drifting from it.

## Process

1. Load the plan via `artifact-memory`. Read the Working Conventions and Phase 0 only.
2. For each task in order:
   a. Read just that task's steps.
   b. Execute each step. Write failing test → confirm failure → implement → confirm pass → commit.
   c. Update the `## Status` table in `progress.md` with task number, status, commit SHA.
   d. If a step fails or a test keeps failing, invoke `systematic-debugging`.
3. At the end of each phase, pause and summarize for the user.

## Hard rules

- Do not skip steps. Do not combine steps. Do not write implementation before the failing test.
- If the plan is wrong, stop and log a deviation in `progress.md` before changing course.
- Never commit with failing tests.
