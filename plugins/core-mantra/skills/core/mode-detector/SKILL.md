---
name: mode-detector
description: Use at the start of any Core Mantra command to pick lite/standard/full. Inspects the stated intent and (when available) git diff signals; honors --lite / --standard / --full overrides and .mantra-config.json preferences. Can downgrade mid-run if a task turns out trivial.
type: core
---

## Purpose

Match ceremony to task size. A one-line bugfix should not trigger a full spec + plan + review cycle.

## Inputs

- User intent string (the argument to `/chant-mantra` or the current command).
- Optional git diff stats (if the user has already started editing).
- `docs/core-mantra/.mantra-config.json` (if present).
- Explicit flag: `--lite`, `--standard`, `--full`.

## Heuristic

Use `src/skills/core/mode-detector.ts` (exports `detectMode`):

1. Explicit flag wins.
2. Introduces new public API or new dependency → `full`.
3. ≤1 file, ≤30 LOC, no API or dep changes → `lite`.
4. ≤3 files, ≤200 LOC, no API or dep changes → `standard`.
5. Otherwise → `full`.

## Mode behaviors

| Mode | Brainstorm | Spec | Plan | Build | Review |
|------|-----------|------|------|-------|--------|
| lite | skip | skip | skip | TDD single-agent | quick self-review |
| standard | yes | yes | yes | TDD single-agent | multi-agent review |
| full | yes | yes | yes | subagent-driven | multi-agent + debug gate |

## Mid-run downgrade

If during a `standard` build the executor discovers the change is actually trivial (e.g. one-line fix), it MUST log a deviation in `progress.md` and invoke this skill again with updated diff stats. If the result is `lite`, skip remaining gates.

## Logging

Write the chosen mode and the inputs that led to it into the `## Decisions` section of `progress.md`.
