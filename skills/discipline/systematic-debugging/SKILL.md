---
name: systematic-debugging
description: Auto-triggered on any test failure, unexpected behavior, or reported bug. Enforces: reproduce first, narrow to minimal case, form a hypothesis with a falsifiable prediction, verify, fix root cause, add a regression test. Blocks shotgun fixes and "try random changes".
type: discipline
---

## Purpose

Most "fixes" that work by accident introduce two new bugs.

## The loop

1. **Reproduce** — shortest path to the failure. A one-line command or test run.
2. **Narrow** — remove inputs, data, config until the bug just barely reproduces.
3. **Hypothesize** — state one concrete theory of what's wrong.
4. **Predict** — what does the hypothesis imply you'd see if you changed X?
5. **Verify** — make the change. Did the prediction hold?
6. If no, pick a new hypothesis. If yes, write a regression test that fails without your fix, passes with it.
7. **Fix root cause**, not the symptom.

## Hard rules

- Never change more than one thing at a time.
- Never "fix" a test by loosening the assertion.
- If the bug disappeared without understanding why, keep digging — it will return.
- Log each hypothesis and its outcome in `progress.md` Decisions.
