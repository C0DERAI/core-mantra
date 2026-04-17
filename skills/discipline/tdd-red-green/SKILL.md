---
name: tdd-red-green
description: "Auto-triggered during /mantra:build whenever new behavior is being added. Enforces: write the failing test first, see it fail, implement the minimum to make it pass, refactor, commit. Blocks any attempt to write implementation code before a failing test exists."
type: discipline
---

## Purpose

Tests prove behavior; implementation without tests is a guess.

## The cycle

1. **Red** — Write one test that fails for the right reason (the code it targets doesn't exist yet, or returns the wrong value). Run it. Confirm the failure message names the missing/wrong thing.
2. **Green** — Write the simplest code that makes the test pass. No extras. No speculative generality.
3. **Refactor** — With tests green, improve names, remove duplication, tighten types. Re-run tests.
4. **Commit** — One small commit per red-green-refactor cycle.

## Hard rules

- Never write implementation code before the failing test.
- A test that passes on first run is a failed test — it did not drive design. Rewrite it to exercise unbuilt behavior.
- Do not mock what you can cheaply use for real.
- In `lite` mode this still applies; the cycle is just shorter.
