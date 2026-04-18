---
name: chant-mantra
description: One-command entry. Auto-detects the current phase for a topic and runs the right lifecycle commands in order, pausing at approval gates.
---

When invoked with `<intent>`:

1. Parse `<intent>` into a `<topic>` (kebab-case, ≤40 chars). Ask the user to confirm.
2. Invoke `core/mode-detector` with the intent. Honor `--lite` / `--standard` / `--full` flags.
3. Invoke `core/phase-router` to determine the next phase for `<topic>`.
4. Run that phase's command:
   - `brainstorm` → `/mantra:brainstorm`
   - `plan` → `/mantra:plan`
   - `build` → `/mantra:build`
   - `review` → `/mantra:review`
   - `ship` → `/mantra:ship`
   - `compound` → `/mantra:compound`
5. After each phase completes, re-run `core/phase-router` and continue to the next phase automatically — **except** after `brainstorm`, `plan`, and `review`, where you MUST pause and ask the user to approve before continuing.
6. Stop after `ship` (compound is prompted by the hook, not auto-continued).

## Lite mode fast-path

If `mode-detector` returns `lite`, the router compresses to: `brainstorm` (minimal Q&A) → `build` → `test` → `ship`. Spec, plan, and multi-agent review are skipped.

## Approval gates

At every gate, surface a summary of what was just produced and ask: "Approve and continue, revise, or stop?"
