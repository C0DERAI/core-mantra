---
name: simplify
description: Invoked by /mantra:simplify and auto-triggered by /mantra:review. Scans changed code for unused exports, dead branches, premature abstractions, over-general interfaces, and excess tests. Proposes and applies targeted removals.
type: discipline
---

## Purpose

Every line removed is a line that cannot break.

## Scan checklist

- Exports that nothing imports
- Parameters every caller sets identically
- Try/catch blocks that swallow errors they cannot cause
- Type parameters used once
- Config options with only one value
- Tests that pass without exercising new code paths
- Comments that repeat the code
- Helper functions with a single caller

## Process

1. Run the scan on files changed in this feature only.
2. Present findings grouped by category, each with file:line and a one-line justification.
3. For each, propose a removal or fold.
4. Apply approved changes. Run tests after each.
5. Commit per category: `refactor(simplify): remove unused X`.

## Hard rules

- Simplify only what this feature touched. No drive-by cleanup.
- Never remove anything a test depends on without removing the test too and understanding why.
