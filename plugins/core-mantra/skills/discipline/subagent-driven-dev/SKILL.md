---
name: subagent-driven-dev
description: Used in full mode during /mantra:build. Dispatches a fresh subagent per plan task, reviews the task's commit between dispatches, and keeps the main thread's context clean of task-internal details.
type: discipline
---

## Purpose

Context contamination is the main failure mode of long autonomous runs. A fresh subagent per task is the simplest fix.

## Process

For each task in the plan:

1. **Dispatch** a subagent with a self-contained brief: the task's full step list, the files it may touch, relevant invariants from the plan's Working Conventions, and the exact commit-message prefix to use.
2. The subagent executes all steps and commits.
3. **Review** the resulting commit in the main thread: does the diff match the task? Do tests pass? Was the commit message correct?
4. If review fails, dispatch a second subagent with the findings to correct. Do not retry silently.
5. Update `progress.md`.

## Hard rules

- Only dispatch tasks, never phases. Each subagent handles exactly one plan task.
- Subagents must return a ≤200-word summary of what they did; never paste the diff.
- Always review before the next dispatch — never chain without a review gate.
