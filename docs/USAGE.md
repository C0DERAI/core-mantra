# Usage

## The fast path

```
/chant-mantra "what you want to build"
```

`/chant-mantra` auto-detects:
- **Mode** — `lite` / `standard` / `full` based on scope signals. Override with `--lite` / `--standard` / `--full`.
- **Phase** — `brainstorm` / `spec` / `plan` / `build` / `review` / `ship` / `compound` based on artifacts already present under `docs/core-mantra/`.

At `brainstorm`, `plan`, and `review` boundaries it pauses for your approval before continuing.

## Manual phase commands

Skip `/chant-mantra` when you want precise control over a single step. See the README command table. Every phase command also works standalone.

## Modes at a glance

| Mode | When | Skips |
|------|------|-------|
| lite | ≤1 file, ≤30 LOC, no new API/deps | spec, plan, multi-agent review |
| standard | typical feature work | — |
| full | new public API / multi-component / user `--full` | — uses subagent-driven build |

## Artifacts

All persistent state lives in your project:

```
docs/core-mantra/
├── .mantra-config.json
├── specs/YYYY-MM-DD-<topic>-design.md
├── plans/YYYY-MM-DD-<topic>-plan.md
├── progress/<topic>-progress.md
├── learnings/YYYY-MM-DD-<topic>.md
└── INDEX.md
```

Commit these. They're how future runs stay context-efficient.

## Compounding

After `/mantra:ship`, a hook asks whether to capture learnings. Saying yes runs `/mantra:compound`, which writes a learning file and (optionally) codifies it into the skills it cites.
