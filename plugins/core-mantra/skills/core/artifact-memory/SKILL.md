---
name: artifact-memory
description: Use whenever a Core Mantra command needs to read or write an artifact under docs/core-mantra/ (specs, plans, progress, learnings). Enforces path conventions, avoids re-reading full files into context, and updates the INDEX.md.
type: core
---

## Purpose

Core Mantra persists everything meaningful to disk so main-thread context stays lean. This skill is the single place that knows where artifacts live and how they are named.

## Path conventions

All paths are relative to the **user project root** (not the plugin):

- `docs/core-mantra/.mantra-config.json` — per-project mode override and preferences
- `docs/core-mantra/specs/YYYY-MM-DD-<topic>-design.md`
- `docs/core-mantra/plans/YYYY-MM-DD-<topic>-plan.md`
- `docs/core-mantra/progress/<topic>-progress.md` (single live file per topic)
- `docs/core-mantra/learnings/YYYY-MM-DD-<topic>.md`
- `docs/core-mantra/INDEX.md` — generated list of all artifacts

`<topic>` is kebab-case, ≤40 chars. Date is the day the artifact was first created; it does not change on later edits.

## Reading rules

- Never read the full body of a spec or plan into context unless the current task requires producing or modifying that exact document.
- Prefer reading the `## Status` table from progress files over re-reading plan bodies.
- When a command needs just a subset (e.g. "has this topic been shipped?"), read `INDEX.md` first.

## Writing rules

- Always write through a template (`templates/spec.md`, etc.). Never generate from scratch.
- After writing or updating any artifact, update `INDEX.md` with a one-line entry: `- YYYY-MM-DD <type> <topic> <status> → <path>`.
- Progress files are updated *append-only* under `## Decisions` and `## Deviations`; the `## Status` table is edited in place.

## Failure modes

- If a target directory does not exist, create it.
- If an artifact with the same `<topic>` already exists for the same phase, do not overwrite — surface the conflict to the user with both paths.
