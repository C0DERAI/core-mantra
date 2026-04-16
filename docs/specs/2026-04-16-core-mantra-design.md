# Core Mantra — Design Spec

**Date:** 2026-04-16
**Status:** Draft — pending user review
**Target platform (v1):** Claude Code (Cursor, OpenCode, Antigravity, Gemini deferred to v2+)
**Packaging:** Single Claude Code plugin

---

## 1. Purpose

Core Mantra synthesizes three existing AI workflow systems —
[`agent-skills`](https://github.com/addyosmani/agent-skills),
[`compound-engineering-plugin`](https://github.com/EveryInc/compound-engineering-plugin),
and [`superpowers`](https://github.com/obra/superpowers) —
into a single, installable, well-documented Claude Code plugin for enterprise software creation.

It keeps what each does best and removes redundancy:

- **From agent-skills:** the clean lifecycle command UX (one command per phase).
- **From compound-engineering:** the compounding loop — every project makes the next one easier.
- **From superpowers:** process discipline — spec gates, TDD red/green, subagent-driven development, YAGNI enforcement.

The signature identity is **"all three, layered"** — a compounding outer loop around lifecycle commands around a discipline engine — with aggressive context management so the full stack doesn't bloat the model's working context.

## 2. Success Criteria

A user installs the plugin into Claude Code and can:

1. Run `/chant-mantra "<what I want>"` against a real project and have it route through the right phases automatically.
2. Run any individual phase command (`/mantra:plan`, `/mantra:build`, etc.) when they want manual control.
3. Get a semi-auto prompt to compound learnings after shipping.
4. Have the system pick `lite` / `standard` / `full` mode based on task complexity, and override it.
5. End up with persisted artifacts under `docs/core-mantra/` that future runs read incrementally — not re-loaded wholesale.

Non-goals for v1: multi-platform support, npm CLI companion, marketplace with sub-plugins.

## 3. Architecture

Three conceptual layers in a single plugin:

```
┌─────────────────────────────────────────────┐
│  COMPOUND LAYER  (outer loop)               │
│  captures learnings → feeds back to skills  │
│  ┌───────────────────────────────────────┐  │
│  │  LIFECYCLE LAYER  (user-facing)       │  │
│  │  /mantra:ideate → spec → plan →       │  │
│  │  build → test → review → ship         │  │
│  │  plus /chant-mantra (auto-router)     │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │  DISCIPLINE LAYER  (under hood) │  │  │
│  │  │  TDD gates, YAGNI checks,       │  │  │
│  │  │  subagent-driven dev, debug,    │  │  │
│  │  │  simplify — auto-triggered      │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

**Context-management strategy (runs through all layers):**

1. **Lazy skill loading** — skills are files, loaded on demand via the `Skill` tool. No mega system prompt.
2. **Project-adaptive modes** — `lite` / `standard` / `full`, picked by a `mode-detector` skill (or user flag).
3. **Subagent isolation** — heavy reads (repo scans, multi-file reviews) run in subagents; only summaries return.
4. **Artifact-based memory** — specs, plans, progress, learnings persist to `docs/core-mantra/*`. Context references paths, not contents.

Deferred optimizations (v2+): async compound, tiered per-skill loading granularity.

## 4. Components

### 4.1 Folder structure

```
core-mantra/
├── .claude-plugin/
│   └── plugin.json                    # plugin manifest
├── commands/                          # 11 lifecycle + 1 meta
│   ├── mantra-ideate.md
│   ├── mantra-brainstorm.md
│   ├── mantra-spec.md
│   ├── mantra-plan.md
│   ├── mantra-build.md
│   ├── mantra-test.md
│   ├── mantra-debug.md
│   ├── mantra-simplify.md
│   ├── mantra-review.md
│   ├── mantra-ship.md
│   ├── mantra-compound.md
│   └── chant-mantra.md                # auto-router meta-command
├── skills/
│   ├── core/                          # always relevant, tiny
│   │   ├── mode-detector/             # picks lite/standard/full
│   │   ├── artifact-memory/           # read/write docs/core-mantra/*
│   │   └── phase-router/              # used by /chant-mantra
│   ├── lifecycle/                     # loaded per phase command
│   │   ├── brainstorming/
│   │   ├── writing-specs/
│   │   ├── writing-plans/
│   │   ├── executing-plans/
│   │   ├── reviewing-code/
│   │   └── shipping/
│   ├── discipline/                    # auto-triggered under the hood
│   │   ├── tdd-red-green/
│   │   ├── yagni-check/
│   │   ├── subagent-driven-dev/
│   │   ├── systematic-debugging/
│   │   └── simplify/
│   └── compound/                      # post-ship learnings loop
│       ├── extract-learnings/
│       └── codify-to-skill/
├── agents/                            # reusable subagents
│   ├── repo-scanner.md                # heavy read, returns summary
│   ├── spec-reviewer.md
│   ├── plan-reviewer.md
│   └── code-reviewer.md
├── hooks/
│   ├── post-ship-compound.sh          # triggers semi-auto compound prompt
│   └── session-start-context.sh       # loads project mode preference
├── templates/                         # artifact scaffolds
│   ├── spec.md
│   ├── plan.md
│   ├── progress.md
│   └── learning.md
├── docs/
│   ├── README.md
│   ├── INSTALL.md
│   ├── USAGE.md
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   └── specs/                         # our own design docs live here
└── LICENSE
```

### 4.2 Per-user-project artifacts

Created on first `/chant-mantra` or `/mantra:ideate` run in a target project:

```
<user-project>/docs/core-mantra/
├── .mantra-config.json                # mode override, preferences
├── specs/YYYY-MM-DD-<topic>-design.md
├── plans/YYYY-MM-DD-<topic>-plan.md
├── progress/<topic>-progress.md
└── learnings/YYYY-MM-DD-<topic>.md
```

### 4.3 Command surface

| Command | Purpose |
|---------|---------|
| `/mantra:ideate` | Divergent ideation — surfaces high-impact improvement ideas |
| `/mantra:brainstorm` | Refine an idea into requirements through Q&A |
| `/mantra:spec` | Write a design spec (produces `specs/<topic>-design.md`) |
| `/mantra:plan` | Turn spec into atomic task list (produces `plans/<topic>-plan.md`) |
| `/mantra:build` | Execute the plan; subagent per task; updates progress |
| `/mantra:test` | Run/expand tests; red-green enforced |
| `/mantra:debug` | Systematic debugging on any failure |
| `/mantra:simplify` | Post-build code-health pass |
| `/mantra:review` | Multi-agent review (spec, plan, code) |
| `/mantra:ship` | Final gate; PR/commit; triggers post-ship hook |
| `/mantra:compound` | Extract learnings → `learnings/*.md` (usually invoked by hook) |
| `/chant-mantra "<intent>"` | Auto-router — detects phase and mode, runs the right commands |

## 5. Data flow

### 5.1 Lifecycle (standard mode)

```
/mantra:ideate    → (optional) idea list → feeds brainstorm
/mantra:brainstorm → Q&A, approaches → approved concept
/mantra:spec      → specs/<topic>-design.md
/mantra:plan      → plans/<topic>-plan.md (atomic tasks, TDD beats)
/mantra:build     → subagent per task; progress.md updated after each
/mantra:test      → runs/expands test suite
/mantra:debug     → invoked automatically on any failure
/mantra:simplify  → code-health pass
/mantra:review    → multi-agent review
/mantra:ship      → final gate; commit/PR; fires post-ship hook
/mantra:compound  → semi-auto via hook → learnings/*.md
```

### 5.2 `/chant-mantra` auto-router

On invocation with intent string:

1. **Detect phase** (via `phase-router` skill) by inspecting existing artifacts under `docs/core-mantra/` matching the topic:
   - No spec → `brainstorm`
   - Spec exists, no plan → `plan`
   - Plan exists, progress incomplete → `build`
   - Build done, no review → `review`
   - Reviewed, not shipped → `ship`
2. **Detect mode** (via `mode-detector` skill):
   - **lite:** ≤1 file, ≤~30 LOC change, no new public API, no new dependencies → skip spec+plan, go straight to build+test
   - **standard:** single feature, bounded scope → full lifecycle, single-agent build
   - **full:** multi-component or cross-cutting, or user flags `--full` → full lifecycle + subagent-driven-dev + all discipline gates
3. **Run** matched phase commands sequentially, pausing at approval gates (after spec, after plan, after review).

### 5.3 Artifact-memory rules

- Commands read only artifact paths they need; never re-load previous full artifacts unless asked.
- Subagents return ≤300-word summaries, not raw findings.
- `progress/<topic>-progress.md` is the single source of truth for build state.
- Each lifecycle skill has a "context budget" heuristic: if it has read >N files or ~M tokens of artifacts, it dispatches a subagent instead.
- `mode-detector` can downgrade mid-run if a "standard" task turns out trivial.

### 5.4 Compound hook (semi-auto)

- `/mantra:ship` success → `post-ship-compound.sh` prompts: *"Compound learnings from this work? (y/n)"*
- On yes → invokes `compound/extract-learnings` skill → writes `learnings/<date>-<topic>.md` → offers to upgrade any skill whose notes were added to (via `codify-to-skill`).
- Hook failure never blocks shipping.

## 6. Error handling

- **Gates fail loud.** Spec review finding contradictions halts `/mantra:spec` and reports; it does not silently rewrite.
- **Build failures auto-route to `/mantra:debug`.** No silent retry loops.
- **Subagent failures are structured:** `{status: "blocked", reason, needs}`. Main thread surfaces to user; never swallows.
- **Hooks are best-effort.** Compound hook failure still allows ship to succeed.
- **Artifact schema checks** at the top of each consuming skill; malformed artifacts report which section is broken rather than guessing.

## 7. Testing

```
tests/
├── skills/           # each skill: fixtures-based smoke test
├── commands/         # each command: end-to-end on a fake project, assert artifact shape
├── hooks/            # hook scripts against fixture events
├── mode-detector/    # golden tests: input X → mode Y
└── integration/      # chant-mantra full lifecycle on a toy repo
```

- Skills tested via deterministic fixtures (markdown in, markdown out where possible).
- Integration tests run `/chant-mantra` against a throwaway repo in a temp dir.
- CI: GitHub Actions on push + PR.

## 8. Open-source readiness

- `README.md` — pitch, install, 60-second quickstart, link tree.
- `INSTALL.md` — Claude Code marketplace + local dev; v2 note for Cursor/etc.
- `USAGE.md` — each command with example, common flows, mode selection.
- `ARCHITECTURE.md` — three-layer diagram + context strategy + extension points.
- `CONTRIBUTING.md` — skill-authoring guide, test requirements, PR process.
- `CHANGELOG.md` — semantic versioning.
- `LICENSE` — MIT (consistent with all three source projects).
- `.github/` — issue templates, PR template, CI workflow.
- `CREDITS.md` — attribution to agent-skills, compound-engineering, superpowers.

**Extension points for v2 platform adapters:**
- Commands and skills are plain markdown — portable in principle.
- Platform-specific bits (hooks, subagent dispatch) isolated behind `adapters/claude-code/`; Cursor/Gemini adapters plug in later without touching skills.

## 9. Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Mode detector misjudges complexity | `--lite` / `--full` override; detector logs reasoning to progress file for tuning |
| Compound loop creates noisy learnings | Semi-auto gate + quality heuristic in extract-learnings (must cite specific decisions, not generic takeaways) |
| Subagent summaries lose critical detail | Subagent prompts specify "preserve exact file paths, error messages, decisions"; reviewers can request full re-dispatch |
| Artifact directory sprawl | Dated filenames + `docs/core-mantra/INDEX.md` auto-maintained by ship command |
| Skill overlap with user's existing plugins | Namespaced commands (`/mantra:*`); skill names prefixed `mantra-*` where collision likely |
| v1 scope creep blocks shipping | Non-goals explicitly listed above; platform adapters and CLI companion deferred |

## 10. Assumptions

- Claude Code plugin format (skills, commands, hooks, agents as markdown + scripts) remains the supported surface.
- Users have git installed; artifact files are meant to be committed to user project repos.
- MIT licensing is compatible across all three source projects (to be re-verified before publish).
- `/chant-mantra` as a top-level slash command name (non-namespaced) is acceptable in Claude Code; fallback is `/mantra:chant`.

## 11. Open questions (to resolve during planning)

- Exact file format of `.mantra-config.json` schema.
- Whether `/mantra:ideate` should be a standalone flow or always feed directly into `/mantra:brainstorm`.
- Minimum test coverage threshold enforced by `/mantra:ship`.
- Whether `codify-to-skill` writes into the plugin's own skills dir (shared) or a per-project skill overlay.
