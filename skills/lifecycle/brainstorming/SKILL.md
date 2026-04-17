---
name: brainstorming
description: Use at the start of any new feature when requirements are fuzzy. One question at a time; propose 2-3 approaches with tradeoffs; present design in approval-gated sections; produce a written concept that /mantra:spec can turn into a spec.
type: lifecycle
---

## Purpose

Turn a vague idea into an aligned concept before any file is written.

## Process

1. Restate the idea in one sentence and confirm with the user.
2. If the idea spans multiple independent subsystems, flag and help decompose before proceeding.
3. Ask clarifying questions one at a time. Prefer multiple-choice. Purpose, constraints, success criteria.
4. Propose 2-3 approaches with trade-offs and a recommendation.
5. Present the agreed concept in sections (architecture, components, data flow, testing). Get approval after each.
6. Hand off: the next step is `/mantra:spec`, which writes the design file.

## Hard rules

- Never write code during brainstorming.
- Never skip the "2-3 approaches" step, even for "obvious" tasks.
- Respect `mode-detector`: in `lite` mode, collapse the Q&A and skip the approaches step.
