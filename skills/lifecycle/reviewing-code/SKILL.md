---
name: reviewing-code
description: Use after build+test complete, before ship. Dispatches spec-reviewer, plan-reviewer, and code-reviewer subagents in parallel; aggregates their structured summaries; presents findings and required fixes to the user.
type: lifecycle
---

## Purpose

Three independent perspectives catch issues one cannot.

## Process

1. Confirm all tasks in `progress.md` are `completed`.
2. Dispatch in parallel:
   - `spec-reviewer` — does the implementation match the spec?
   - `plan-reviewer` — did we follow the plan? Flag any undocumented deviations.
   - `code-reviewer` — correctness, simplicity, obvious bugs.
3. Each subagent returns ≤300-word structured summary with: findings, severity (blocker/major/minor), and specific file:line references.
4. Aggregate: present blockers first, then majors, then minors.
5. If blockers exist, loop back through `/mantra:build` to address them.
6. On clean review, write `reviewed: YYYY-MM-DD` into progress.md Decisions.

## Hard rules

- Never skip any of the three reviewers in `standard` or `full` mode.
- In `lite` mode, run only `code-reviewer`.
