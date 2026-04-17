---
name: yagni-check
description: Auto-triggered whenever code, abstractions, config, or tests are about to be added. Asks "does the current task require this?" If not, cut it. Blocks speculative flexibility, pre-emptive extensibility, and "might need later" features.
type: discipline
---

## Purpose

Code that isn't needed is a liability, not an asset.

## Flags to cut

- New function/class/module "because we might use it elsewhere"
- Config option with only one value in practice
- Parameter that every caller passes the same way
- Error handling for conditions that cannot occur
- Backwards-compat shim for code that nobody depends on yet
- Abstraction with only one implementation
- Feature-flag for a decision already made

## Process

Before adding any unit of code, ask:

1. Does the current task require this?
2. Is there a concrete second caller today?
3. If removed, what test fails?

If the answers are *no, no, none* — cut it.

## Hard rules

- Three similar lines beats a premature abstraction.
- "Future-proofing" is almost always wrong — future needs differ from what you guessed.
- When in doubt, cut and commit. Adding back is easier than removing.
