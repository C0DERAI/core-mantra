# Architecture

Three layers inside a single plugin:

```
┌─────────────────────────────────────────────┐
│  COMPOUND LAYER                             │
│    extract-learnings, codify-to-skill       │
│  ┌───────────────────────────────────────┐  │
│  │  LIFECYCLE LAYER                      │  │
│  │    11 /mantra:* + /chant-mantra       │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  DISCIPLINE LAYER               │  │  │
│  │  │    tdd-red-green, yagni-check,  │  │  │
│  │  │    subagent-driven-dev,         │  │  │
│  │  │    systematic-debugging,        │  │  │
│  │  │    simplify                     │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Context management

1. **Lazy skill loading.** Skills are files; loaded only on demand via the `Skill` tool.
2. **Adaptive modes.** `mode-detector` picks lite/standard/full.
3. **Subagent isolation.** Heavy reads (`repo-scanner`, reviewers) return ≤300-word summaries.
4. **Artifact memory.** Specs, plans, progress, learnings persist to disk; context references paths, not contents.

## Extension points

- Commands and skills are plain markdown — portable in principle.
- Platform-specific bits (hooks, subagent dispatch) live behind a thin boundary for v2+ platform adapters.

## File layout

See `README.md` for the full tree. Key directories:

- `commands/` — 12 slash-command markdown files
- `skills/{core,lifecycle,discipline,compound}/` — 16 skills
- `agents/` — 4 subagents
- `hooks/` — 2 Bash hooks
- `templates/` — 4 artifact templates
