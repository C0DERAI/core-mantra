---
name: mantra:test
description: Run and expand tests for the current feature. Red-green enforced.
---

When invoked:

1. Detect the project's test runner (npm/pytest/cargo/go). If unclear, ask the user.
2. Run the full suite. Report pass/fail counts and any failures with file:line.
3. If new behavior exists without a matching test, invoke `discipline/tdd-red-green` and add the missing test(s).
4. If a test is flaky, invoke `discipline/systematic-debugging` rather than retrying.
