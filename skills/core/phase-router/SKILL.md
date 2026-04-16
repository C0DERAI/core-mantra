---
name: phase-router
description: Use from /chant-mantra to decide which lifecycle command to run next for a given topic. Inspects docs/core-mantra/ artifacts and returns the next phase name. Never advances past a gate the user has not approved.
type: core
---

## Purpose

Given an intent and a topic, determine whether the next step is brainstorm, spec, plan, build, review, ship, or compound.

## Inputs

- `topic` (kebab-case)
- Paths present under `docs/core-mantra/`

## Signals

| Signal | Source |
|--------|--------|
| `hasSpec` | file exists in `specs/` matching topic |
| `hasPlan` | file exists in `plans/` matching topic |
| `progressComplete` | `progress/<topic>-progress.md` Status table has no `pending` or `in_progress` rows |
| `reviewed` | progress file's Decisions section has a `reviewed:` entry |
| `shipped` | progress file's Decisions section has a `shipped:` entry |

## Algorithm

Use `skills/core/phase-router/route.mjs`.

## Approval gates

After `brainstorm`, `plan`, and `review`, the router MUST pause and ask the user to approve before continuing — even when `/chant-mantra` is running end-to-end.
