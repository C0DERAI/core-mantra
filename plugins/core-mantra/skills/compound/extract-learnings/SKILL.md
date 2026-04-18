---
name: extract-learnings
description: Invoked by /mantra:compound after shipping (usually via the semi-auto hook). Reads the shipped spec, plan, and progress; produces a learnings/<date>-<topic>.md file citing specific decisions, surprises, and skills to update. Rejects generic takeaways.
type: compound
---

## Purpose

Compounding only works if each learning is specific enough to change future behavior.

## Process

1. Read the spec, plan, and progress for the shipped topic via `artifact-memory`.
2. Load `templates/learning.md`.
3. Fill each section with citations. Every bullet must reference:
   - A specific decision (spec section, commit SHA, or progress entry), and
   - Why it mattered (what failed or succeeded because of it).
4. In "Skills to update", list concrete skills from the plugin with the exact sentence or rule to add.
5. Self-reject any bullet that could apply to any project (e.g. "write tests" is too generic).
6. Save to `docs/core-mantra/learnings/YYYY-MM-DD-<topic>.md`.

## Hard rules

- No generic bullets. Every item names a file, a decision, or a measurable outcome.
- If there are fewer than two non-generic items, write no learning file and say so.
