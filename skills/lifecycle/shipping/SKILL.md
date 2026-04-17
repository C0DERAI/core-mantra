---
name: shipping
description: Use after review passes. Runs final verification (full test suite, lint if configured), creates a commit or PR, updates INDEX.md with "shipped" status, and fires the post-ship-compound hook.
type: lifecycle
---

## Purpose

Close out the work and surface the compound opportunity.

## Process

1. Confirm Decisions section has `reviewed: ...` entry. If not, halt and route to `/mantra:review`.
2. Run the project's test suite (`npm test` / `pytest` / `cargo test` as appropriate). All must pass.
3. If a linter is configured, run it. Fix any auto-fixable issues; surface the rest to the user.
4. Create a final commit or (if on a feature branch with a remote) open a PR. Use the spec's purpose line as the PR title; link to spec and plan in the body.
5. Append `shipped: YYYY-MM-DD <commit-sha>` to progress.md Decisions.
6. Update `INDEX.md`.
7. Fire `hooks/post-ship-compound.sh`. If it fails, log a warning but do not block.

## Hard rules

- Never ship with failing tests.
- Never `git commit --no-verify` unless the user explicitly approves.
- Never force-push.
