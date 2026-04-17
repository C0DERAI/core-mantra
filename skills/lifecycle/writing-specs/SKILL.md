---
name: writing-specs
description: Use after brainstorming to produce a design spec in docs/core-mantra/specs/. Uses templates/spec.md. Self-reviews for placeholders, internal consistency, ambiguity, and scope before asking the user to review.
type: lifecycle
---

## Purpose

Capture the agreed concept as a durable artifact so later phases don't re-derive it.

## Process

1. Invoke `artifact-memory` to resolve the target path `docs/core-mantra/specs/YYYY-MM-DD-<topic>-design.md`.
2. Load `templates/spec.md`.
3. Fill each section to the depth the feature warrants. Short for simple features; denser for nuanced ones.
4. Self-review: placeholder scan, contradiction check, scope check, ambiguity check. Fix inline.
5. Update `INDEX.md`.
6. Ask the user to review the written spec before proceeding to `/mantra:plan`.

## Hard rules

- No "TBD" or "TODO" in the committed spec.
- Architecture section must reference at least one concrete file path or module name.
- In `lite` mode, skip this skill entirely — jump to `/mantra:build`.
