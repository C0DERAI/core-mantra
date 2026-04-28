# Skill Additions — Progress

**Plan:** `C:\Users\riwat\.claude\plans\let-s-add-new-skill-purrfect-fountain.md`
**Mode:** standard
**Started:** 2026-04-28

## Status

| Task | Status | Notes |
|------|--------|-------|
| Add `stupefy` skill + command | done | `plugins/core-mantra/skills/discipline/stupefy/SKILL.md`, `commands/mantra-stupefy.md` |
| Add `core-architectural-revamp` skill + command | done | 4 files in `skills/discipline/core-architectural-revamp/`, `commands/mantra-revamp.md` |
| Fix YAML parse error in stupefy description | done | Changed `: ` to ` — ` in description field |
| Add regression test for bare colon-space in description | done | `tools/tests/test_validate_skill.py::test_rejects_bare_colon_space_in_description` |

## Decisions

- 2026-04-28 — **Hypothesis 1**: Python validator fails on `stupefy/SKILL.md` because `communication: drops` in the description is a bare colon-space, which PyYAML interprets as a new key-value pair mid-scalar.
  **Outcome: CONFIRMED.** `yaml.safe_load()` in `validate_skill.py:49` raises a mapping parse error. The TS `parseFrontmatter` regex (`^([a-zA-Z_][\w-]*):\s*(.*)$`) reads the whole line and never sees the inner colon.

- 2026-04-28 — **Hypothesis 2**: The root cause is a missing test case — no test in `tools/tests/test_validate_skill.py` covers a description with a bare `: ` sequence.
  **Outcome: CONFIRMED.** Added `test_rejects_bare_colon_space_in_description`. 7/7 Python tests pass, 60/60 Node tests pass.

- 2026-04-28 — The TS validator is intentionally lenient (fast, regex-based) per the comment in `src/harness/validate-skill.ts:21`. The regression test belongs in the Python suite only — no change to the TS validator needed.

## Deviations from plan

- 2026-04-28 — The original stupefy SKILL.md description used `: ` after "communication". Fixed to ` — ` (em dash) to avoid YAML significance. Not anticipated in the plan.
