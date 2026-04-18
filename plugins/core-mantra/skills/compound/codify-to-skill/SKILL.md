---
name: codify-to-skill
description: Invoked after extract-learnings. Offers to upgrade any Core Mantra skill whose "Skills to update" section of the learning file names it. Shows a diff to the user before writing; requires approval.
type: compound
---

## Purpose

Learnings that stay in a file don't compound. Codifying them into the skills that will be auto-triggered next time is how the loop closes.

## Process

1. Read the learning file's "Skills to update" section.
2. For each named skill:
   a. Load the current `SKILL.md`.
   b. Draft the addition in the appropriate section (usually "Hard rules" or a new "Learned" section).
   c. Present a diff to the user.
   d. On approval, write and commit as `compound(<skill>): codify learning from <topic>`.
3. If the skill is a user-project overlay candidate, ask whether to write into the plugin globally or into a per-project `docs/core-mantra/skills/` overlay.

## Hard rules

- Never write to a skill without a diff + approval.
- Never duplicate existing rules. If the new rule is already implied, say so and skip.
