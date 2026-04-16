# Resume Here

Work-in-progress build of Core Mantra. Pick up from this checkpoint.

## State

- **Spec:** `docs/specs/2026-04-16-core-mantra-design.md` (approved)
- **Plan:** `docs/plans/2026-04-16-core-mantra-implementation.md` (43 tasks, 10 phases)
- **Phase 0 (Tasks 1–3):** complete — commits `be1e5c4`, `8248ded`, `018c593`
- **Phase 1 (Tasks 4–6):** complete — commits `395fe33`, `e7343d5`, `710ba99`
- **Tests:** 21/21 passing (`npm test`)

## Next

Phase 2 — Tasks 7–12 in the plan: six lifecycle skill markdown files
(`brainstorming`, `writing-specs`, `writing-plans`, `executing-plans`,
`reviewing-code`, `shipping`). Each task = one `SKILL.md` + one
validator test.

## Execution approach

Subagent-driven development with phase-level checkpoints. Paste task
text verbatim from the plan into each subagent prompt — subagents do
not read the plan file themselves. Haiku for markdown tasks, Sonnet
for logic tasks.

## To resume

1. Open this directory in Claude Code.
2. Say "resume Core Mantra from the plan, starting at Phase 2".
3. Approve the phase plan; work will proceed task by task.
