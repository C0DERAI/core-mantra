# Core Mantra Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Core Mantra v1 — a single Claude Code plugin that layers a compounding outer loop over lifecycle commands (`/mantra:ideate` … `/mantra:ship` + `/chant-mantra`) over a discipline engine (TDD, YAGNI, subagent-driven dev), with lazy skill loading, adaptive lite/standard/full modes, subagent isolation, and artifact-based memory.

**Architecture:** Three conceptual layers inside one plugin. Skills live as markdown files loaded on demand via the `Skill` tool. A `mode-detector` skill picks `lite` / `standard` / `full` per task. A `phase-router` skill lets `/chant-mantra` pick the next command based on which artifacts already exist under `<user-project>/docs/core-mantra/`. Heavy reads run in subagents (`repo-scanner`, `spec-reviewer`, etc.). Shipping fires a semi-auto compound hook.

**Tech Stack:** Claude Code plugin format (markdown skills, markdown commands, markdown subagents, Bash hooks), Bash for hooks, Node.js + Bats for the test harness, GitHub Actions for CI, MIT license.

**Spec reference:** `core-mantra/docs/specs/2026-04-16-core-mantra-design.md`

---

## Working conventions (apply to every task)

- All paths are relative to `core-mantra/` (the plugin root).
- Use forward-slash paths in committed files; the host OS is Windows but the plugin ships cross-platform.
- Commit after each task with `feat:`, `test:`, `docs:`, or `chore:` prefix as appropriate.
- For skills, commands, and agents, each file is a standalone markdown document with YAML frontmatter. The engineer must not deviate from the frontmatter schemas shown.
- Fixture tests for markdown artifacts verify: (a) frontmatter parses, (b) required fields exist, (c) body contains expected section headings. They do not verify semantic quality.
- The repo is initialized as a git repo in Task 1. Every subsequent task commits.

---

## Phase 0 — Scaffold

### Task 1: Initialize repo, plugin manifest, license, .gitignore

**Files:**
- Create: `.git/` (via `git init`)
- Create: `.claude-plugin/plugin.json`
- Create: `LICENSE`
- Create: `.gitignore`
- Create: `package.json`
- Create: `tests/harness/parse-frontmatter.mjs`

- [ ] **Step 1: Initialize git repo**

Run from `core-mantra/`:
```bash
git init
git branch -M main
```

- [ ] **Step 2: Write the failing frontmatter-parser test**

Create `tests/harness/parse-frontmatter.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "./parse-frontmatter.mjs";

test("parses valid frontmatter", () => {
  const src = `---\nname: foo\ndescription: bar\ntype: skill\n---\n\nbody`;
  const { data, body } = parseFrontmatter(src);
  assert.equal(data.name, "foo");
  assert.equal(data.description, "bar");
  assert.equal(data.type, "skill");
  assert.equal(body.trim(), "body");
});

test("throws on missing closing fence", () => {
  assert.throws(() => parseFrontmatter("---\nname: foo\nbody"));
});
```

Run: `node --test tests/harness/parse-frontmatter.test.mjs`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement the parser**

Create `tests/harness/parse-frontmatter.mjs`:
```javascript
export function parseFrontmatter(src) {
  if (!src.startsWith("---\n")) return { data: {}, body: src };
  const end = src.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("Unclosed frontmatter fence");
  const head = src.slice(4, end);
  const body = src.slice(end + 5);
  const data = {};
  for (const line of head.split("\n")) {
    const m = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (m) data[m[1]] = m[2].trim();
  }
  return { data, body };
}
```

- [ ] **Step 4: Verify the test passes**

Run: `node --test tests/harness/parse-frontmatter.test.mjs`
Expected: PASS (2/2).

- [ ] **Step 5: Write the plugin manifest**

Create `.claude-plugin/plugin.json`:
```json
{
  "name": "core-mantra",
  "version": "0.1.0",
  "description": "Layered engineering workflow — compounding loop over lifecycle commands over a discipline engine. Synthesis of agent-skills, compound-engineering, and superpowers.",
  "license": "MIT",
  "homepage": "https://github.com/core-mantra/core-mantra",
  "engines": {
    "claudeCode": ">=1.0.0"
  }
}
```

- [ ] **Step 6: Write LICENSE (MIT) and .gitignore**

Create `LICENSE` with the standard MIT template, copyright `2026 Core Mantra contributors`.

Create `.gitignore`:
```
node_modules/
.DS_Store
*.log
coverage/
.tmp/
```

- [ ] **Step 7: Write package.json**

Create `package.json`:
```json
{
  "name": "core-mantra",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/**/*.test.mjs",
    "test:skills": "node --test tests/skills/**/*.test.mjs",
    "test:commands": "node --test tests/commands/**/*.test.mjs"
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "chore: scaffold plugin manifest, license, test harness"
```

---

### Task 2: Create the four artifact templates

**Files:**
- Create: `templates/spec.md`
- Create: `templates/plan.md`
- Create: `templates/progress.md`
- Create: `templates/learning.md`
- Create: `tests/templates/templates.test.mjs`

- [ ] **Step 1: Write failing test that each template exists and has a `## ` heading**

Create `tests/templates/templates.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

for (const f of ["spec", "plan", "progress", "learning"]) {
  test(`template ${f}.md has a level-2 heading`, () => {
    const src = readFileSync(`templates/${f}.md`, "utf8");
    assert.match(src, /^## /m);
  });
}
```

Run: `node --test tests/templates/templates.test.mjs`
Expected: FAIL (files missing).

- [ ] **Step 2: Create `templates/spec.md`**

```markdown
# {{Feature Name}} — Design Spec

**Date:** {{YYYY-MM-DD}}
**Status:** Draft
**Mode:** {{lite|standard|full}}

## 1. Purpose
{{One paragraph: what and why.}}

## 2. Success Criteria
- {{bullet}}

## 3. Architecture
{{Diagram or short prose.}}

## 4. Components
{{File structure or component list.}}

## 5. Data Flow
{{How the pieces interact.}}

## 6. Error Handling
{{Failure modes and responses.}}

## 7. Testing
{{How we prove it works.}}

## 8. Risks & Mitigations
| Risk | Mitigation |
|------|-----------|

## 9. Assumptions
- {{bullet}}

## 10. Open Questions
- {{bullet}}
```

- [ ] **Step 3: Create `templates/plan.md`**

```markdown
# {{Feature Name}} Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** {{one sentence}}
**Architecture:** {{2-3 sentences}}
**Tech Stack:** {{list}}
**Spec reference:** `{{path to spec}}`

## Phase 0 — {{name}}

### Task 1: {{name}}

**Files:**
- Create: `{{path}}`
- Modify: `{{path}}:{{lines}}`
- Test: `{{path}}`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run it and verify it fails**
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run tests and verify they pass**
- [ ] **Step 5: Commit**
```

- [ ] **Step 4: Create `templates/progress.md`**

```markdown
# {{Feature}} — Progress

**Plan:** `{{path to plan}}`
**Mode:** {{lite|standard|full}}
**Started:** {{YYYY-MM-DD}}

## Status

| Task | Status | Commit | Notes |
|------|--------|--------|-------|
| 1    | pending |       |       |

## Decisions

- {{date}} — {{decision}}

## Deviations from plan

- {{date}} — {{what and why}}
```

- [ ] **Step 5: Create `templates/learning.md`**

```markdown
# Learning — {{Feature}}

**Date:** {{YYYY-MM-DD}}
**Spec:** `{{path}}`
**Plan:** `{{path}}`

## What worked
- {{specific decision + why}}

## What didn't
- {{specific problem + root cause}}

## Surprises
- {{unexpected finding}}

## Skills to update
- `{{skill name}}` — {{what to add and why}}

## Reusable patterns
- {{pattern + where it applied}}
```

- [ ] **Step 6: Verify tests pass**

Run: `node --test tests/templates/templates.test.mjs`
Expected: PASS (4/4).

- [ ] **Step 7: Commit**

```bash
git add templates/ tests/templates/
git commit -m "feat: add spec, plan, progress, learning templates"
```

---

### Task 3: Add skill-frontmatter validator

**Files:**
- Create: `tests/harness/validate-skill.mjs`
- Create: `tests/harness/validate-skill.test.mjs`

The validator enforces that every `SKILL.md` has `name`, `description`, and `type` fields and a body with at least one `## ` heading. All later skill tasks depend on this.

- [ ] **Step 1: Write failing test**

Create `tests/harness/validate-skill.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSkill } from "./validate-skill.mjs";

test("accepts valid skill", () => {
  const src = `---\nname: foo\ndescription: bar\ntype: core\n---\n\n## Purpose\nhi`;
  assert.doesNotThrow(() => validateSkill(src, "foo"));
});

test("rejects missing description", () => {
  const src = `---\nname: foo\ntype: core\n---\n\n## Purpose\nhi`;
  assert.throws(() => validateSkill(src, "foo"), /description/);
});

test("rejects missing level-2 heading", () => {
  const src = `---\nname: foo\ndescription: bar\ntype: core\n---\n\nno heading`;
  assert.throws(() => validateSkill(src, "foo"), /heading/);
});
```

Run: `node --test tests/harness/validate-skill.test.mjs`
Expected: FAIL.

- [ ] **Step 2: Implement validator**

Create `tests/harness/validate-skill.mjs`:
```javascript
import { parseFrontmatter } from "./parse-frontmatter.mjs";

const REQUIRED = ["name", "description", "type"];
const TYPES = new Set(["core", "lifecycle", "discipline", "compound"]);

export function validateSkill(src, filename) {
  const { data, body } = parseFrontmatter(src);
  for (const field of REQUIRED) {
    if (!data[field]) throw new Error(`${filename}: missing frontmatter field "${field}"`);
  }
  if (!TYPES.has(data.type)) {
    throw new Error(`${filename}: type must be one of ${[...TYPES].join(", ")}`);
  }
  if (!/^## /m.test(body)) {
    throw new Error(`${filename}: body must contain at least one level-2 heading`);
  }
}
```

- [ ] **Step 3: Verify tests pass**

Run: `node --test tests/harness/validate-skill.test.mjs`
Expected: PASS (3/3).

- [ ] **Step 4: Commit**

```bash
git add tests/harness/
git commit -m "test: add skill frontmatter validator"
```

---

## Phase 1 — Core skills

Every core skill task follows the same pattern:
1. Write a fixture test that loads the `SKILL.md` and runs `validateSkill`.
2. Author the `SKILL.md`.
3. Run the test, verify pass, commit.

### Task 4: `skills/core/artifact-memory/SKILL.md`

**Files:**
- Create: `skills/core/artifact-memory/SKILL.md`
- Create: `tests/skills/core/artifact-memory.test.mjs`

- [ ] **Step 1: Write the failing test**

Create `tests/skills/core/artifact-memory.test.mjs`:
```javascript
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";

test("artifact-memory SKILL.md is valid", () => {
  const src = readFileSync("skills/core/artifact-memory/SKILL.md", "utf8");
  validateSkill(src, "artifact-memory");
});
```
Run: `node --test tests/skills/core/artifact-memory.test.mjs` → FAIL.

- [ ] **Step 2: Write the skill**

Create `skills/core/artifact-memory/SKILL.md`:
```markdown
---
name: artifact-memory
description: Use whenever a Core Mantra command needs to read or write an artifact under docs/core-mantra/ (specs, plans, progress, learnings). Enforces path conventions, avoids re-reading full files into context, and updates the INDEX.md.
type: core
---

## Purpose

Core Mantra persists everything meaningful to disk so main-thread context stays lean. This skill is the single place that knows where artifacts live and how they are named.

## Path conventions

All paths are relative to the **user project root** (not the plugin):

- `docs/core-mantra/.mantra-config.json` — per-project mode override and preferences
- `docs/core-mantra/specs/YYYY-MM-DD-<topic>-design.md`
- `docs/core-mantra/plans/YYYY-MM-DD-<topic>-plan.md`
- `docs/core-mantra/progress/<topic>-progress.md` (single live file per topic)
- `docs/core-mantra/learnings/YYYY-MM-DD-<topic>.md`
- `docs/core-mantra/INDEX.md` — generated list of all artifacts

`<topic>` is kebab-case, ≤40 chars. Date is the day the artifact was first created; it does not change on later edits.

## Reading rules

- Never read the full body of a spec or plan into context unless the current task requires producing or modifying that exact document.
- Prefer reading the `## Status` table from progress files over re-reading plan bodies.
- When a command needs just a subset (e.g. "has this topic been shipped?"), read `INDEX.md` first.

## Writing rules

- Always write through a template (`templates/spec.md`, etc.). Never generate from scratch.
- After writing or updating any artifact, update `INDEX.md` with a one-line entry: `- YYYY-MM-DD <type> <topic> <status> → <path>`.
- Progress files are updated *append-only* under `## Decisions` and `## Deviations`; the `## Status` table is edited in place.

## Failure modes

- If a target directory does not exist, create it.
- If an artifact with the same `<topic>` already exists for the same phase, do not overwrite — surface the conflict to the user with both paths.
```

- [ ] **Step 3: Run test, verify pass, commit**

```bash
node --test tests/skills/core/artifact-memory.test.mjs
git add skills/core/artifact-memory/ tests/skills/core/artifact-memory.test.mjs
git commit -m "feat(skills): add core/artifact-memory"
```

---

### Task 5: `skills/core/mode-detector/SKILL.md` + heuristic script

**Files:**
- Create: `skills/core/mode-detector/SKILL.md`
- Create: `skills/core/mode-detector/detect.mjs`
- Create: `tests/skills/core/mode-detector.test.mjs`

This skill has a deterministic helper script so the heuristic is testable.

- [ ] **Step 1: Write failing test**

Create `tests/skills/core/mode-detector.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectMode } from "../../../skills/core/mode-detector/detect.mjs";

test("one-file 10-line change → lite", () => {
  assert.equal(detectMode({ filesTouched: 1, locChanged: 10, newPublicApi: false, newDeps: 0 }), "lite");
});

test("two files, no API change → standard", () => {
  assert.equal(detectMode({ filesTouched: 2, locChanged: 80, newPublicApi: false, newDeps: 0 }), "standard");
});

test("new public API → full", () => {
  assert.equal(detectMode({ filesTouched: 1, locChanged: 5, newPublicApi: true, newDeps: 0 }), "full");
});

test("new dependency → full", () => {
  assert.equal(detectMode({ filesTouched: 1, locChanged: 5, newPublicApi: false, newDeps: 1 }), "full");
});

test("user override wins", () => {
  assert.equal(detectMode({ filesTouched: 1, locChanged: 5, override: "full" }), "full");
});
```
Run → FAIL.

- [ ] **Step 2: Implement `detect.mjs`**

```javascript
export function detectMode({
  filesTouched = 0,
  locChanged = 0,
  newPublicApi = false,
  newDeps = 0,
  override = null,
} = {}) {
  if (override && ["lite", "standard", "full"].includes(override)) return override;
  if (newPublicApi || newDeps > 0) return "full";
  if (filesTouched <= 1 && locChanged <= 30) return "lite";
  if (filesTouched <= 3 && locChanged <= 200) return "standard";
  return "full";
}
```

- [ ] **Step 3: Write the SKILL.md**

```markdown
---
name: mode-detector
description: Use at the start of any Core Mantra command to pick lite/standard/full. Inspects the stated intent and (when available) git diff signals; honors --lite / --standard / --full overrides and .mantra-config.json preferences. Can downgrade mid-run if a task turns out trivial.
type: core
---

## Purpose

Match ceremony to task size. A one-line bugfix should not trigger a full spec + plan + review cycle.

## Inputs

- User intent string (the argument to `/chant-mantra` or the current command).
- Optional git diff stats (if the user has already started editing).
- `docs/core-mantra/.mantra-config.json` (if present).
- Explicit flag: `--lite`, `--standard`, `--full`.

## Heuristic

Use `skills/core/mode-detector/detect.mjs`:

1. Explicit flag wins.
2. Introduces new public API or new dependency → `full`.
3. ≤1 file, ≤30 LOC, no API or dep changes → `lite`.
4. ≤3 files, ≤200 LOC, no API or dep changes → `standard`.
5. Otherwise → `full`.

## Mode behaviors

| Mode | Brainstorm | Spec | Plan | Build | Review |
|------|-----------|------|------|-------|--------|
| lite | skip | skip | skip | TDD single-agent | quick self-review |
| standard | yes | yes | yes | TDD single-agent | multi-agent review |
| full | yes | yes | yes | subagent-driven | multi-agent + debug gate |

## Mid-run downgrade

If during a `standard` build the executor discovers the change is actually trivial (e.g. one-line fix), it MUST log a deviation in `progress.md` and invoke this skill again with updated diff stats. If the result is `lite`, skip remaining gates.

## Logging

Write the chosen mode and the inputs that led to it into the `## Decisions` section of `progress.md`.
```

- [ ] **Step 4: Run test, verify pass, commit**

```bash
node --test tests/skills/core/mode-detector.test.mjs
git add skills/core/mode-detector/ tests/skills/core/mode-detector.test.mjs
git commit -m "feat(skills): add core/mode-detector with heuristic"
```

---

### Task 6: `skills/core/phase-router/SKILL.md` + routing script

**Files:**
- Create: `skills/core/phase-router/SKILL.md`
- Create: `skills/core/phase-router/route.mjs`
- Create: `tests/skills/core/phase-router.test.mjs`

- [ ] **Step 1: Write failing test**

Create `tests/skills/core/phase-router.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { nextPhase } from "../../../skills/core/phase-router/route.mjs";

test("nothing exists → brainstorm", () => {
  assert.equal(nextPhase({}), "brainstorm");
});

test("spec only → plan", () => {
  assert.equal(nextPhase({ hasSpec: true }), "plan");
});

test("plan but incomplete progress → build", () => {
  assert.equal(nextPhase({ hasSpec: true, hasPlan: true, progressComplete: false }), "build");
});

test("build done, no review → review", () => {
  assert.equal(nextPhase({ hasSpec: true, hasPlan: true, progressComplete: true, reviewed: false }), "review");
});

test("reviewed, not shipped → ship", () => {
  assert.equal(nextPhase({ hasSpec: true, hasPlan: true, progressComplete: true, reviewed: true, shipped: false }), "ship");
});

test("shipped → compound", () => {
  assert.equal(nextPhase({ hasSpec: true, hasPlan: true, progressComplete: true, reviewed: true, shipped: true }), "compound");
});
```
Run → FAIL.

- [ ] **Step 2: Implement `route.mjs`**

```javascript
export function nextPhase(s = {}) {
  if (!s.hasSpec) return "brainstorm";
  if (!s.hasPlan) return "plan";
  if (!s.progressComplete) return "build";
  if (!s.reviewed) return "review";
  if (!s.shipped) return "ship";
  return "compound";
}
```

- [ ] **Step 3: Write the SKILL.md**

```markdown
---
name: phase-router
description: Use from /chant-mantra to decide which lifecycle command to run next for a given topic. Inspects docs/core-mantra/ artifacts and returns the next phase name. Never advances past a gate the user has not approved.
type: core
---

## Purpose

Given an intent and a topic, determine whether the next step is brainstorm, spec, plan, build, review, ship, or compound.

## Inputs

- `topic` (kebab-case)
- Paths present under `docs/core-mantra/`

## Signals

| Signal | Source |
|--------|--------|
| `hasSpec` | file exists in `specs/` matching topic |
| `hasPlan` | file exists in `plans/` matching topic |
| `progressComplete` | `progress/<topic>-progress.md` Status table has no `pending` or `in_progress` rows |
| `reviewed` | progress file's Decisions section has a `reviewed:` entry |
| `shipped` | progress file's Decisions section has a `shipped:` entry |

## Algorithm

Use `skills/core/phase-router/route.mjs`.

## Approval gates

After `brainstorm`, `plan`, and `review`, the router MUST pause and ask the user to approve before continuing — even when `/chant-mantra` is running end-to-end.
```

- [ ] **Step 4: Run test, verify pass, commit**

```bash
node --test tests/skills/core/phase-router.test.mjs
git add skills/core/phase-router/ tests/skills/core/phase-router.test.mjs
git commit -m "feat(skills): add core/phase-router"
```

---

## Phase 2 — Lifecycle skills

Each lifecycle skill is a markdown file consumed by the matching command. Tests are frontmatter validation only (semantic behavior is tested end-to-end in Phase 8).

### Task 7: Lifecycle skill — `brainstorming`

**Files:**
- Create: `skills/lifecycle/brainstorming/SKILL.md`
- Create: `tests/skills/lifecycle/brainstorming.test.mjs`

- [ ] **Step 1: Write failing test**

```javascript
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("brainstorming SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/lifecycle/brainstorming/SKILL.md", "utf8"), "brainstorming");
});
```

- [ ] **Step 2: Write `skills/lifecycle/brainstorming/SKILL.md`**

```markdown
---
name: brainstorming
description: Use at the start of any new feature when requirements are fuzzy. One question at a time; propose 2-3 approaches with tradeoffs; present design in approval-gated sections; produce a written concept that /mantra:spec can turn into a spec.
type: lifecycle
---

## Purpose

Turn a vague idea into an aligned concept before any file is written.

## Process

1. Restate the idea in one sentence and confirm with the user.
2. If the idea spans multiple independent subsystems, flag and help decompose before proceeding.
3. Ask clarifying questions one at a time. Prefer multiple-choice. Purpose, constraints, success criteria.
4. Propose 2-3 approaches with trade-offs and a recommendation.
5. Present the agreed concept in sections (architecture, components, data flow, testing). Get approval after each.
6. Hand off: the next step is `/mantra:spec`, which writes the design file.

## Hard rules

- Never write code during brainstorming.
- Never skip the "2-3 approaches" step, even for "obvious" tasks.
- Respect `mode-detector`: in `lite` mode, collapse the Q&A and skip the approaches step.
```

- [ ] **Step 3: Run test, verify pass, commit**

```bash
node --test tests/skills/lifecycle/brainstorming.test.mjs
git add skills/lifecycle/brainstorming/ tests/skills/lifecycle/brainstorming.test.mjs
git commit -m "feat(skills): add lifecycle/brainstorming"
```

### Task 8: Lifecycle skill — `writing-specs`

**Files:**
- Create: `skills/lifecycle/writing-specs/SKILL.md`
- Create: `tests/skills/lifecycle/writing-specs.test.mjs`

- [ ] **Step 1: Failing test (same shape as Task 7)**

```javascript
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("writing-specs SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/lifecycle/writing-specs/SKILL.md", "utf8"), "writing-specs");
});
```

- [ ] **Step 2: Write `skills/lifecycle/writing-specs/SKILL.md`**

```markdown
---
name: writing-specs
description: Use after brainstorming to produce a design spec in docs/core-mantra/specs/. Uses templates/spec.md. Self-reviews for placeholders, internal consistency, ambiguity, and scope before asking the user to review.
type: lifecycle
---

## Purpose

Capture the agreed concept as a durable artifact so later phases don't re-derive it.

## Process

1. Invoke `artifact-memory` to resolve the target path `docs/core-mantra/specs/YYYY-MM-DD-<topic>-design.md`.
2. Load `templates/spec.md`.
3. Fill each section to the depth the feature warrants. Short for simple features; denser for nuanced ones.
4. Self-review: placeholder scan, contradiction check, scope check, ambiguity check. Fix inline.
5. Update `INDEX.md`.
6. Ask the user to review the written spec before proceeding to `/mantra:plan`.

## Hard rules

- No "TBD" or "TODO" in the committed spec.
- Architecture section must reference at least one concrete file path or module name.
- In `lite` mode, skip this skill entirely — jump to `/mantra:build`.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/lifecycle/writing-specs.test.mjs
git add skills/lifecycle/writing-specs/ tests/skills/lifecycle/writing-specs.test.mjs
git commit -m "feat(skills): add lifecycle/writing-specs"
```

### Task 9: Lifecycle skill — `writing-plans`

**Files:**
- Create: `skills/lifecycle/writing-plans/SKILL.md`
- Create: `tests/skills/lifecycle/writing-plans.test.mjs`

- [ ] **Step 1: Failing test** (same shape as Task 7; skill path `skills/lifecycle/writing-plans/SKILL.md`).

- [ ] **Step 2: Write the skill**

```markdown
---
name: writing-plans
description: Use after a spec is approved to produce a bite-sized TDD implementation plan in docs/core-mantra/plans/. Each task has exact file paths, complete code per step, exact commands with expected output, and a commit step. No placeholders.
type: lifecycle
---

## Purpose

Turn a spec into tasks an engineer with no context can execute.

## Process

1. Load the approved spec.
2. Map out every file that will be created or modified. Group into phases.
3. For each task, write:
   - **Files** list (create / modify with line ranges / test path)
   - Steps: write failing test → run it → implement → run passes → commit
   - Complete code in each code-producing step. Never "similar to Task N".
4. Self-review: spec coverage, placeholders, type consistency.
5. Save to `docs/core-mantra/plans/YYYY-MM-DD-<topic>-plan.md` via `artifact-memory`.

## Hard rules

- Every step that changes code must include the code.
- Every test step must include the exact test command and expected output.
- Never write "TBD", "fill in later", "add error handling" without concrete content.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/lifecycle/writing-plans.test.mjs
git add skills/lifecycle/writing-plans/ tests/skills/lifecycle/writing-plans.test.mjs
git commit -m "feat(skills): add lifecycle/writing-plans"
```

### Task 10: Lifecycle skill — `executing-plans`

**Files:**
- Create: `skills/lifecycle/executing-plans/SKILL.md`
- Create: `tests/skills/lifecycle/executing-plans.test.mjs`

- [ ] **Step 1: Failing test** (same shape).

- [ ] **Step 2: Write the skill**

```markdown
---
name: executing-plans
description: Use to execute an approved plan task-by-task in the current session. Reads one task at a time, runs each step, updates progress.md after every task, and pauses at checkpoints.
type: lifecycle
---

## Purpose

Turn a written plan into working code without drifting from it.

## Process

1. Load the plan via `artifact-memory`. Read the Working Conventions and Phase 0 only.
2. For each task in order:
   a. Read just that task's steps.
   b. Execute each step. Write failing test → confirm failure → implement → confirm pass → commit.
   c. Update the `## Status` table in `progress.md` with task number, status, commit SHA.
   d. If a step fails or a test keeps failing, invoke `systematic-debugging`.
3. At the end of each phase, pause and summarize for the user.

## Hard rules

- Do not skip steps. Do not combine steps. Do not write implementation before the failing test.
- If the plan is wrong, stop and log a deviation in `progress.md` before changing course.
- Never commit with failing tests.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/lifecycle/executing-plans.test.mjs
git add skills/lifecycle/executing-plans/ tests/skills/lifecycle/executing-plans.test.mjs
git commit -m "feat(skills): add lifecycle/executing-plans"
```

### Task 11: Lifecycle skill — `reviewing-code`

**Files:**
- Create: `skills/lifecycle/reviewing-code/SKILL.md`
- Create: `tests/skills/lifecycle/reviewing-code.test.mjs`

- [ ] **Step 1: Failing test** (same shape).

- [ ] **Step 2: Write the skill**

```markdown
---
name: reviewing-code
description: Use after build+test complete, before ship. Dispatches spec-reviewer, plan-reviewer, and code-reviewer subagents in parallel; aggregates their structured summaries; presents findings and required fixes to the user.
type: lifecycle
---

## Purpose

Three independent perspectives catch issues one cannot.

## Process

1. Confirm all tasks in `progress.md` are `completed`.
2. Dispatch in parallel:
   - `spec-reviewer` — does the implementation match the spec?
   - `plan-reviewer` — did we follow the plan? Flag any undocumented deviations.
   - `code-reviewer` — correctness, simplicity, obvious bugs.
3. Each subagent returns ≤300-word structured summary with: findings, severity (blocker/major/minor), and specific file:line references.
4. Aggregate: present blockers first, then majors, then minors.
5. If blockers exist, loop back through `/mantra:build` to address them.
6. On clean review, write `reviewed: YYYY-MM-DD` into progress.md Decisions.

## Hard rules

- Never skip any of the three reviewers in `standard` or `full` mode.
- In `lite` mode, run only `code-reviewer`.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/lifecycle/reviewing-code.test.mjs
git add skills/lifecycle/reviewing-code/ tests/skills/lifecycle/reviewing-code.test.mjs
git commit -m "feat(skills): add lifecycle/reviewing-code"
```

### Task 12: Lifecycle skill — `shipping`

**Files:**
- Create: `skills/lifecycle/shipping/SKILL.md`
- Create: `tests/skills/lifecycle/shipping.test.mjs`

- [ ] **Step 1: Failing test** (same shape).

- [ ] **Step 2: Write the skill**

```markdown
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
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/lifecycle/shipping.test.mjs
git add skills/lifecycle/shipping/ tests/skills/lifecycle/shipping.test.mjs
git commit -m "feat(skills): add lifecycle/shipping"
```

---

## Phase 3 — Discipline skills

### Task 13: `skills/discipline/tdd-red-green/SKILL.md`

**Files:**
- Create: `skills/discipline/tdd-red-green/SKILL.md`
- Create: `tests/skills/discipline/tdd-red-green.test.mjs`

- [ ] **Step 1: Failing validator test** (same shape as Task 7, path adjusted).

- [ ] **Step 2: Write the skill**

```markdown
---
name: tdd-red-green
description: Auto-triggered during /mantra:build whenever new behavior is being added. Enforces: write the failing test first, see it fail, implement the minimum to make it pass, refactor, commit. Blocks any attempt to write implementation code before a failing test exists.
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
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/discipline/tdd-red-green.test.mjs
git add skills/discipline/tdd-red-green/ tests/skills/discipline/tdd-red-green.test.mjs
git commit -m "feat(skills): add discipline/tdd-red-green"
```

### Task 14: `skills/discipline/yagni-check/SKILL.md`

**Files:**
- Create: `skills/discipline/yagni-check/SKILL.md`
- Create: `tests/skills/discipline/yagni-check.test.mjs`

- [ ] **Step 1: Failing validator test**.

- [ ] **Step 2: Write the skill**

```markdown
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
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/discipline/yagni-check.test.mjs
git add skills/discipline/yagni-check/ tests/skills/discipline/yagni-check.test.mjs
git commit -m "feat(skills): add discipline/yagni-check"
```

### Task 15: `skills/discipline/subagent-driven-dev/SKILL.md`

**Files:**
- Create: `skills/discipline/subagent-driven-dev/SKILL.md`
- Create: `tests/skills/discipline/subagent-driven-dev.test.mjs`

- [ ] **Step 1: Failing validator test**.

- [ ] **Step 2: Write the skill**

```markdown
---
name: subagent-driven-dev
description: Used in full mode during /mantra:build. Dispatches a fresh subagent per plan task, reviews the task's commit between dispatches, and keeps the main thread's context clean of task-internal details.
type: discipline
---

## Purpose

Context contamination is the main failure mode of long autonomous runs. A fresh subagent per task is the simplest fix.

## Process

For each task in the plan:

1. **Dispatch** a subagent with a self-contained brief: the task's full step list, the files it may touch, relevant invariants from the plan's Working Conventions, and the exact commit-message prefix to use.
2. The subagent executes all steps and commits.
3. **Review** the resulting commit in the main thread: does the diff match the task? Do tests pass? Was the commit message correct?
4. If review fails, dispatch a second subagent with the findings to correct. Do not retry silently.
5. Update `progress.md`.

## Hard rules

- Only dispatch tasks, never phases. Each subagent handles exactly one plan task.
- Subagents must return a ≤200-word summary of what they did; never paste the diff.
- Always review before the next dispatch — never chain without a review gate.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/discipline/subagent-driven-dev.test.mjs
git add skills/discipline/subagent-driven-dev/ tests/skills/discipline/subagent-driven-dev.test.mjs
git commit -m "feat(skills): add discipline/subagent-driven-dev"
```

### Task 16: `skills/discipline/systematic-debugging/SKILL.md`

**Files:**
- Create: `skills/discipline/systematic-debugging/SKILL.md`
- Create: `tests/skills/discipline/systematic-debugging.test.mjs`

- [ ] **Step 1: Failing validator test**.

- [ ] **Step 2: Write the skill**

```markdown
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
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/discipline/systematic-debugging.test.mjs
git add skills/discipline/systematic-debugging/ tests/skills/discipline/systematic-debugging.test.mjs
git commit -m "feat(skills): add discipline/systematic-debugging"
```

### Task 17: `skills/discipline/simplify/SKILL.md`

**Files:**
- Create: `skills/discipline/simplify/SKILL.md`
- Create: `tests/skills/discipline/simplify.test.mjs`

- [ ] **Step 1: Failing validator test**.

- [ ] **Step 2: Write the skill**

```markdown
---
name: simplify
description: Invoked by /mantra:simplify and auto-triggered by /mantra:review. Scans changed code for unused exports, dead branches, premature abstractions, over-general interfaces, and excess tests. Proposes and applies targeted removals.
type: discipline
---

## Purpose

Every line removed is a line that cannot break.

## Scan checklist

- Exports that nothing imports
- Parameters every caller sets identically
- Try/catch blocks that swallow errors they cannot cause
- Type parameters used once
- Config options with only one value
- Tests that pass without exercising new code paths
- Comments that repeat the code
- Helper functions with a single caller

## Process

1. Run the scan on files changed in this feature only.
2. Present findings grouped by category, each with file:line and a one-line justification.
3. For each, propose a removal or fold.
4. Apply approved changes. Run tests after each.
5. Commit per category: `refactor(simplify): remove unused X`.

## Hard rules

- Simplify only what this feature touched. No drive-by cleanup.
- Never remove anything a test depends on without removing the test too and understanding why.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/discipline/simplify.test.mjs
git add skills/discipline/simplify/ tests/skills/discipline/simplify.test.mjs
git commit -m "feat(skills): add discipline/simplify"
```

---

## Phase 4 — Compound skills

### Task 18: `skills/compound/extract-learnings/SKILL.md`

**Files:**
- Create: `skills/compound/extract-learnings/SKILL.md`
- Create: `tests/skills/compound/extract-learnings.test.mjs`

- [ ] **Step 1: Failing validator test**.

- [ ] **Step 2: Write the skill**

```markdown
---
name: extract-learnings
description: Invoked by /mantra:compound after shipping (usually via the semi-auto hook). Reads the shipped spec, plan, and progress; produces a learnings/<date>-<topic>.md file citing specific decisions, surprises, and skills to update. Rejects generic takeaways.
type: compound
---

## Purpose

Compounding only works if each learning is specific enough to change future behavior.

## Process

1. Read the spec, plan, and progress for the shipped topic via `artifact-memory`.
2. Load `templates/learning.md`.
3. Fill each section with citations. Every bullet must reference:
   - A specific decision (spec section, commit SHA, or progress entry), and
   - Why it mattered (what failed or succeeded because of it).
4. In "Skills to update", list concrete skills from the plugin with the exact sentence or rule to add.
5. Self-reject any bullet that could apply to any project (e.g. "write tests" is too generic).
6. Save to `docs/core-mantra/learnings/YYYY-MM-DD-<topic>.md`.

## Hard rules

- No generic bullets. Every item names a file, a decision, or a measurable outcome.
- If there are fewer than two non-generic items, write no learning file and say so.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/compound/extract-learnings.test.mjs
git add skills/compound/extract-learnings/ tests/skills/compound/extract-learnings.test.mjs
git commit -m "feat(skills): add compound/extract-learnings"
```

### Task 19: `skills/compound/codify-to-skill/SKILL.md`

**Files:**
- Create: `skills/compound/codify-to-skill/SKILL.md`
- Create: `tests/skills/compound/codify-to-skill.test.mjs`

- [ ] **Step 1: Failing validator test**.

- [ ] **Step 2: Write the skill**

```markdown
---
name: codify-to-skill
description: Invoked after extract-learnings. Offers to upgrade any Core Mantra skill whose "Skills to update" section of the learning file names it. Shows a diff to the user before writing; requires approval.
type: compound
---

## Purpose

Learnings that stay in a file don't compound. Codifying them into the skills that will be auto-triggered next time is how the loop closes.

## Process

1. Read the learning file's "Skills to update" section.
2. For each named skill:
   a. Load the current `SKILL.md`.
   b. Draft the addition in the appropriate section (usually "Hard rules" or a new "Learned" section).
   c. Present a diff to the user.
   d. On approval, write and commit as `compound(<skill>): codify learning from <topic>`.
3. If the skill is a user-project overlay candidate, ask whether to write into the plugin globally or into a per-project `docs/core-mantra/skills/` overlay.

## Hard rules

- Never write to a skill without a diff + approval.
- Never duplicate existing rules. If the new rule is already implied, say so and skip.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/skills/compound/codify-to-skill.test.mjs
git add skills/compound/codify-to-skill/ tests/skills/compound/codify-to-skill.test.mjs
git commit -m "feat(skills): add compound/codify-to-skill"
```

---

## Phase 5 — Agents

Each agent is a markdown file with frontmatter declaring its name and description. Tests verify frontmatter only.

### Task 20: Agent — `repo-scanner`

**Files:**
- Create: `agents/repo-scanner.md`
- Create: `tests/agents/repo-scanner.test.mjs`

- [ ] **Step 1: Failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";
test("repo-scanner frontmatter", () => {
  const { data } = parseFrontmatter(readFileSync("agents/repo-scanner.md", "utf8"));
  assert.ok(data.name && data.description);
});
```
Run → FAIL.

- [ ] **Step 2: Write `agents/repo-scanner.md`**

```markdown
---
name: repo-scanner
description: Dispatch to scan a user project's repo for structure, conventions, and existing patterns. Returns a ≤300-word summary with concrete file paths and observed conventions. Used by brainstorming and writing-specs.
---

You are a repo-scanner. Your job is to answer a specific question about the project without loading the whole project into the caller's context.

**Inputs you will receive:**
- A question (e.g. "what test framework is used?", "where are HTTP handlers defined?")
- The project root path

**How to work:**
1. Use `Glob` and `Grep` to answer the question. Read files only when you must.
2. Keep your scratch reasoning concise.
3. Return a structured summary:
   - **Answer:** 1-3 sentences
   - **Evidence:** up to 5 file:line citations
   - **Caveats:** anything you couldn't determine

**Limits:**
- Never return full file contents.
- Never recommend changes — only describe what exists.
- Cap at 300 words total.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/agents/repo-scanner.test.mjs
git add agents/repo-scanner.md tests/agents/repo-scanner.test.mjs
git commit -m "feat(agents): add repo-scanner"
```

### Task 21: Agent — `spec-reviewer`

**Files:**
- Create: `agents/spec-reviewer.md`
- Create: `tests/agents/spec-reviewer.test.mjs`

- [ ] **Step 1: Failing frontmatter test** (same shape, path adjusted).

- [ ] **Step 2: Write `agents/spec-reviewer.md`**

```markdown
---
name: spec-reviewer
description: Dispatch from /mantra:review with the path to a spec and the path to the implementation's progress.md. Returns a structured summary of how well the implementation matches the spec. Never reads unrelated files.
---

You are a spec-reviewer. Your job is to check whether the built code actually implements what the spec described.

**Inputs:**
- Spec file path
- Progress file path
- List of files changed in this feature (from git diff)

**How to work:**
1. Read the spec fully. Extract each numbered requirement.
2. For each requirement, find the change that implements it (from the file list, reading files as needed).
3. Classify each requirement: implemented / partial / missing / scope-drift (implemented something the spec didn't ask for).

**Return format (≤300 words):**
- **Coverage:** N of M requirements implemented.
- **Findings:** bulleted list. Each bullet: severity (blocker/major/minor), requirement id, what you found, file:line.
- **Scope drift:** any features built that weren't in the spec.

**Limits:**
- Do not comment on code style — that's `code-reviewer`'s job.
- Do not comment on plan adherence — that's `plan-reviewer`'s job.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/agents/spec-reviewer.test.mjs
git add agents/spec-reviewer.md tests/agents/spec-reviewer.test.mjs
git commit -m "feat(agents): add spec-reviewer"
```

### Task 22: Agent — `plan-reviewer`

**Files:**
- Create: `agents/plan-reviewer.md`
- Create: `tests/agents/plan-reviewer.test.mjs`

- [ ] **Step 1: Failing frontmatter test**.

- [ ] **Step 2: Write `agents/plan-reviewer.md`**

```markdown
---
name: plan-reviewer
description: Dispatch from /mantra:review with the plan path and progress path. Checks that every task was executed and every undocumented deviation from the plan is justified.
---

You are a plan-reviewer.

**Inputs:**
- Plan path
- Progress path
- git log range for this feature

**How to work:**
1. For each task in the plan, verify:
   - A commit exists matching its step-5 commit message pattern.
   - The progress Status table marks it completed.
2. Read the progress Decisions and Deviations sections.

**Return format (≤300 words):**
- **Adherence:** N of M tasks executed as planned.
- **Deviations:** each deviation with (task #, what changed, whether it was logged in progress).
- **Findings:** bulleted list with severity and task reference.

**Limits:**
- If a deviation improved the result, still flag it. The point is surfacing, not scoring.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/agents/plan-reviewer.test.mjs
git add agents/plan-reviewer.md tests/agents/plan-reviewer.test.mjs
git commit -m "feat(agents): add plan-reviewer"
```

### Task 23: Agent — `code-reviewer`

**Files:**
- Create: `agents/code-reviewer.md`
- Create: `tests/agents/code-reviewer.test.mjs`

- [ ] **Step 1: Failing frontmatter test**.

- [ ] **Step 2: Write `agents/code-reviewer.md`**

```markdown
---
name: code-reviewer
description: Dispatch with the list of files changed in this feature. Reviews correctness, simplicity, obvious bugs, and YAGNI violations. Returns structured findings with file:line.
---

You are a code-reviewer.

**Inputs:**
- List of files changed (with line ranges if available)
- Project root

**How to work:**
1. Read each changed file's diff context.
2. Look for:
   - Bugs: off-by-one, null/undefined paths, wrong comparisons, missed error cases at real boundaries
   - Simplicity: unused code, premature abstractions, over-general interfaces
   - YAGNI violations: speculative flexibility
   - Security: obvious injection, unsanitized inputs at boundaries
3. Do NOT review style, naming convention, or tests unless a test is clearly wrong.

**Return format (≤300 words):**
- **Findings:** bulleted list grouped by severity (blocker / major / minor). Each: file:line, one-sentence description, suggested fix.
- **Overall:** one-line verdict.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/agents/code-reviewer.test.mjs
git add agents/code-reviewer.md tests/agents/code-reviewer.test.mjs
git commit -m "feat(agents): add code-reviewer"
```

---

## Phase 6 — Lifecycle commands

Each command is a markdown file in `commands/` with frontmatter declaring name and description, and a body that tells Claude exactly which skills to invoke and in what order. Tests verify frontmatter + body mentions the expected skill names.

### Task 24: `commands/mantra-ideate.md`

**Files:**
- Create: `commands/mantra-ideate.md`
- Create: `tests/commands/mantra-ideate.test.mjs`

- [ ] **Step 1: Failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-ideate command", () => {
  const src = readFileSync("commands/mantra-ideate.md", "utf8");
  const { data, body } = parseFrontmatter(src);
  assert.equal(data.name, "mantra:ideate");
  assert.ok(body.includes("brainstorming") || body.includes("repo-scanner"));
});
```
Run → FAIL.

- [ ] **Step 2: Write `commands/mantra-ideate.md`**

```markdown
---
name: mantra:ideate
description: Divergent ideation — surface high-impact improvements for the current project. Dispatches repo-scanner, then proposes ranked ideas with tradeoffs.
---

When invoked:

1. Invoke `core/mode-detector` to pick a mode. In `lite` mode, skip to step 3.
2. Dispatch the `repo-scanner` agent with: "What are the most active areas of this project and what conventions are used?"
3. Based on the scan, propose 5-10 improvement ideas. For each: area, one-line summary, estimated impact, rough effort.
4. Ask the user to pick one or more to push into `/mantra:brainstorm`.

Do not write any code. Do not modify files.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-ideate.test.mjs
git add commands/mantra-ideate.md tests/commands/mantra-ideate.test.mjs
git commit -m "feat(commands): add /mantra:ideate"
```

### Task 25: `commands/mantra-brainstorm.md`

**Files:**
- Create: `commands/mantra-brainstorm.md`
- Create: `tests/commands/mantra-brainstorm.test.mjs`

- [ ] **Step 1: Failing test** (same shape; assert body mentions `brainstorming`).

- [ ] **Step 2: Write `commands/mantra-brainstorm.md`**

```markdown
---
name: mantra:brainstorm
description: Refine an idea into aligned requirements through one-question-at-a-time Q&A and 2-3 proposed approaches.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, reduce Q&A to ≤2 clarifying questions and skip the 2-3 approaches step.
2. Invoke the `lifecycle/brainstorming` skill and follow it exactly.
3. At the end, produce an inline concept summary and hand off: suggest running `/mantra:spec` next.

Do not write any code. Do not create artifacts — that's `/mantra:spec`'s job.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-brainstorm.test.mjs
git add commands/mantra-brainstorm.md tests/commands/mantra-brainstorm.test.mjs
git commit -m "feat(commands): add /mantra:brainstorm"
```

### Task 26: `commands/mantra-spec.md`

**Files:**
- Create: `commands/mantra-spec.md`
- Create: `tests/commands/mantra-spec.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `writing-specs` and `artifact-memory`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:spec
description: Produce a design spec in docs/core-mantra/specs/ from the aligned concept.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, halt and tell the user specs are skipped in lite — route them to `/mantra:build`.
2. Invoke `core/artifact-memory` to resolve the spec path.
3. Invoke the `lifecycle/writing-specs` skill and follow it exactly.
4. After writing, ask the user to review the file before `/mantra:plan`.

Commit the spec as `docs: add spec for <topic>`.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-spec.test.mjs
git add commands/mantra-spec.md tests/commands/mantra-spec.test.mjs
git commit -m "feat(commands): add /mantra:spec"
```

### Task 27: `commands/mantra-plan.md`

**Files:**
- Create: `commands/mantra-plan.md`
- Create: `tests/commands/mantra-plan.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `writing-plans`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:plan
description: Turn an approved spec into a bite-sized TDD plan in docs/core-mantra/plans/.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, halt and route to `/mantra:build`.
2. Require an approved spec path. If missing, route to `/mantra:spec`.
3. Invoke `lifecycle/writing-plans` and follow it exactly.
4. After writing, ask the user to review before `/mantra:build`.

Commit as `docs: add plan for <topic>`.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-plan.test.mjs
git add commands/mantra-plan.md tests/commands/mantra-plan.test.mjs
git commit -m "feat(commands): add /mantra:plan"
```

### Task 28: `commands/mantra-build.md`

**Files:**
- Create: `commands/mantra-build.md`
- Create: `tests/commands/mantra-build.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `executing-plans` and `tdd-red-green`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:build
description: Execute an approved plan task-by-task with TDD enforcement.
---

When invoked:

1. Invoke `core/mode-detector`.
2. In `full` mode, invoke `discipline/subagent-driven-dev` and follow it.
3. In `standard` or `lite` mode, invoke `lifecycle/executing-plans` and follow it.
4. In every mode, `discipline/tdd-red-green` is auto-triggered per task. Do not write implementation code before a failing test.
5. Update `progress.md` after every task.

On any test failure or unexpected behavior, invoke `discipline/systematic-debugging`.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-build.test.mjs
git add commands/mantra-build.md tests/commands/mantra-build.test.mjs
git commit -m "feat(commands): add /mantra:build"
```

### Task 29: `commands/mantra-test.md`

**Files:**
- Create: `commands/mantra-test.md`
- Create: `tests/commands/mantra-test.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `tdd-red-green`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:test
description: Run and expand tests for the current feature. Red-green enforced.
---

When invoked:

1. Detect the project's test runner (npm/pytest/cargo/go). If unclear, ask the user.
2. Run the full suite. Report pass/fail counts and any failures with file:line.
3. If new behavior exists without a matching test, invoke `discipline/tdd-red-green` and add the missing test(s).
4. If a test is flaky, invoke `discipline/systematic-debugging` rather than retrying.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-test.test.mjs
git add commands/mantra-test.md tests/commands/mantra-test.test.mjs
git commit -m "feat(commands): add /mantra:test"
```

### Task 30: `commands/mantra-debug.md`

**Files:**
- Create: `commands/mantra-debug.md`
- Create: `tests/commands/mantra-debug.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `systematic-debugging`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:debug
description: Systematic debugging for any failure or unexpected behavior.
---

When invoked:

1. Invoke `discipline/systematic-debugging` and follow it exactly.
2. Add a regression test as part of the fix.
3. Log every hypothesis + outcome in `progress.md` Decisions.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-debug.test.mjs
git add commands/mantra-debug.md tests/commands/mantra-debug.test.mjs
git commit -m "feat(commands): add /mantra:debug"
```

### Task 31: `commands/mantra-simplify.md`

**Files:**
- Create: `commands/mantra-simplify.md`
- Create: `tests/commands/mantra-simplify.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `simplify`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:simplify
description: Post-build code-health pass on files changed by this feature.
---

When invoked:

1. Identify files changed in this feature (git diff against the branch base or last ship tag).
2. Invoke `discipline/simplify` and follow it. Scope is limited to changed files.
3. Commit approved removals per category.
4. Re-run tests after each commit.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-simplify.test.mjs
git add commands/mantra-simplify.md tests/commands/mantra-simplify.test.mjs
git commit -m "feat(commands): add /mantra:simplify"
```

### Task 32: `commands/mantra-review.md`

**Files:**
- Create: `commands/mantra-review.md`
- Create: `tests/commands/mantra-review.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `reviewing-code`, `spec-reviewer`, `plan-reviewer`, `code-reviewer`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:review
description: Multi-agent review before ship. Dispatches spec-reviewer, plan-reviewer, code-reviewer in parallel.
---

When invoked:

1. Invoke `core/mode-detector`. In `lite` mode, dispatch only `code-reviewer`.
2. Otherwise invoke `lifecycle/reviewing-code` and follow it. It will dispatch `spec-reviewer`, `plan-reviewer`, `code-reviewer` in parallel.
3. Aggregate findings; present blockers first.
4. On blockers, route to `/mantra:build` or `/mantra:debug` as appropriate.
5. On clean, write `reviewed: YYYY-MM-DD` to progress.md Decisions.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-review.test.mjs
git add commands/mantra-review.md tests/commands/mantra-review.test.mjs
git commit -m "feat(commands): add /mantra:review"
```

### Task 33: `commands/mantra-ship.md`

**Files:**
- Create: `commands/mantra-ship.md`
- Create: `tests/commands/mantra-ship.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `shipping` and `post-ship-compound`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:ship
description: Final verification, commit/PR, and trigger the semi-auto compound hook.
---

When invoked:

1. Confirm `reviewed:` entry exists in progress.md. If not, route to `/mantra:review`.
2. Invoke `lifecycle/shipping` and follow it.
3. After a successful ship, fire `hooks/post-ship-compound.sh`. If it fails, log a warning but do not block the ship.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-ship.test.mjs
git add commands/mantra-ship.md tests/commands/mantra-ship.test.mjs
git commit -m "feat(commands): add /mantra:ship"
```

### Task 34: `commands/mantra-compound.md`

**Files:**
- Create: `commands/mantra-compound.md`
- Create: `tests/commands/mantra-compound.test.mjs`

- [ ] **Step 1: Failing test** (body mentions `extract-learnings` and `codify-to-skill`).

- [ ] **Step 2: Write the command**

```markdown
---
name: mantra:compound
description: Extract learnings from a shipped feature and optionally codify them into skills.
---

When invoked:

1. Identify the most recently shipped topic from `INDEX.md` unless the user names one.
2. Invoke `compound/extract-learnings` and follow it.
3. If the resulting learning file contains a "Skills to update" section with entries, offer `compound/codify-to-skill`.
4. Commit the learning as `docs: capture learnings for <topic>`.
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/mantra-compound.test.mjs
git add commands/mantra-compound.md tests/commands/mantra-compound.test.mjs
git commit -m "feat(commands): add /mantra:compound"
```

### Task 35: `commands/chant-mantra.md` — the auto-router

**Files:**
- Create: `commands/chant-mantra.md`
- Create: `tests/commands/chant-mantra.test.mjs`

- [ ] **Step 1: Failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("chant-mantra command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/chant-mantra.md", "utf8"));
  assert.equal(data.name, "chant-mantra");
  for (const needed of ["phase-router", "mode-detector", "mantra:brainstorm", "mantra:ship"]) {
    assert.ok(body.includes(needed), `body should mention ${needed}`);
  }
});
```
Run → FAIL.

- [ ] **Step 2: Write `commands/chant-mantra.md`**

```markdown
---
name: chant-mantra
description: One-command entry. Auto-detects the current phase for a topic and runs the right lifecycle commands in order, pausing at approval gates.
---

When invoked with `<intent>`:

1. Parse `<intent>` into a `<topic>` (kebab-case, ≤40 chars). Ask the user to confirm.
2. Invoke `core/mode-detector` with the intent. Honor `--lite` / `--standard` / `--full` flags.
3. Invoke `core/phase-router` to determine the next phase for `<topic>`.
4. Run that phase's command:
   - `brainstorm` → `/mantra:brainstorm`
   - `plan` → `/mantra:plan`
   - `build` → `/mantra:build`
   - `review` → `/mantra:review`
   - `ship` → `/mantra:ship`
   - `compound` → `/mantra:compound`
5. After each phase completes, re-run `core/phase-router` and continue to the next phase automatically — **except** after `brainstorm`, `plan`, and `review`, where you MUST pause and ask the user to approve before continuing.
6. Stop after `ship` (compound is prompted by the hook, not auto-continued).

## Lite mode fast-path

If `mode-detector` returns `lite`, the router compresses to: `brainstorm` (minimal Q&A) → `build` → `test` → `ship`. Spec, plan, and multi-agent review are skipped.

## Approval gates

At every gate, surface a summary of what was just produced and ask: "Approve and continue, revise, or stop?"
```

- [ ] **Step 3: Run test, commit**

```bash
node --test tests/commands/chant-mantra.test.mjs
git add commands/chant-mantra.md tests/commands/chant-mantra.test.mjs
git commit -m "feat(commands): add /chant-mantra auto-router"
```

---

## Phase 7 — Hooks

### Task 36: `hooks/post-ship-compound.sh`

**Files:**
- Create: `hooks/post-ship-compound.sh`
- Create: `tests/hooks/post-ship-compound.test.mjs`

- [ ] **Step 1: Write failing test**

Create `tests/hooks/post-ship-compound.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

test("exits 0 when user answers n", () => {
  const out = execFileSync("bash", ["hooks/post-ship-compound.sh", "my-topic"], {
    input: "n\n",
    env: { ...process.env, MANTRA_NONINTERACTIVE: "1", MANTRA_TEST_ANSWER: "n" },
  }).toString();
  assert.ok(out.includes("skipped"));
});

test("suggests /mantra:compound when user answers y", () => {
  const out = execFileSync("bash", ["hooks/post-ship-compound.sh", "my-topic"], {
    env: { ...process.env, MANTRA_NONINTERACTIVE: "1", MANTRA_TEST_ANSWER: "y" },
  }).toString();
  assert.ok(out.includes("/mantra:compound"));
});
```
Run → FAIL.

- [ ] **Step 2: Implement the hook**

Create `hooks/post-ship-compound.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail

topic="${1:-unknown}"

if [[ "${MANTRA_NONINTERACTIVE:-0}" == "1" ]]; then
  answer="${MANTRA_TEST_ANSWER:-n}"
else
  read -rp "Compound learnings from ${topic}? (y/n) " answer
fi

case "$answer" in
  y|Y|yes)
    echo "Run /mantra:compound ${topic} to capture learnings."
    ;;
  *)
    echo "Compound step skipped for ${topic}."
    ;;
esac
```

Make it executable:
```bash
chmod +x hooks/post-ship-compound.sh
```

- [ ] **Step 3: Run tests, verify pass**

Run: `node --test tests/hooks/post-ship-compound.test.mjs`
Expected: PASS (2/2).

- [ ] **Step 4: Commit**

```bash
git add hooks/post-ship-compound.sh tests/hooks/post-ship-compound.test.mjs
git commit -m "feat(hooks): add post-ship-compound prompt"
```

### Task 37: `hooks/session-start-context.sh`

**Files:**
- Create: `hooks/session-start-context.sh`
- Create: `tests/hooks/session-start-context.test.mjs`

- [ ] **Step 1: Write failing test**

```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";

test("reports mode from .mantra-config.json", () => {
  const dir = ".tmp/session-test";
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(`${dir}/docs/core-mantra`, { recursive: true });
  writeFileSync(`${dir}/docs/core-mantra/.mantra-config.json`, '{"mode":"full"}');
  const out = execFileSync("bash", ["hooks/session-start-context.sh", dir]).toString();
  assert.ok(out.includes("mode=full"));
});

test("reports no-config when file missing", () => {
  const dir = ".tmp/session-test-empty";
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const out = execFileSync("bash", ["hooks/session-start-context.sh", dir]).toString();
  assert.ok(out.includes("no-config"));
});
```
Run → FAIL.

- [ ] **Step 2: Implement the hook**

```bash
#!/usr/bin/env bash
set -euo pipefail

root="${1:-.}"
cfg="$root/docs/core-mantra/.mantra-config.json"

if [[ ! -f "$cfg" ]]; then
  echo "core-mantra: no-config"
  exit 0
fi

mode=$(grep -oE '"mode"[[:space:]]*:[[:space:]]*"[^"]+"' "$cfg" | sed -E 's/.*"([^"]+)"$/\1/' || echo "")
if [[ -z "$mode" ]]; then
  echo "core-mantra: config present, mode=unset"
else
  echo "core-mantra: mode=${mode}"
fi
```

Make executable: `chmod +x hooks/session-start-context.sh`

- [ ] **Step 3: Run tests, verify pass, commit**

```bash
node --test tests/hooks/session-start-context.test.mjs
git add hooks/session-start-context.sh tests/hooks/session-start-context.test.mjs
git commit -m "feat(hooks): add session-start-context loader"
```

---

## Phase 8 — Integration tests

### Task 38: End-to-end `/chant-mantra` smoke on a toy project

**Files:**
- Create: `tests/integration/chant-mantra-lite.test.mjs`
- Create: `tests/fixtures/toy-project/README.md`

This test does not invoke Claude; it validates the *contracts* — that all the pieces a `/chant-mantra` run would touch are present and wired correctly.

- [ ] **Step 1: Create the toy fixture**

Create `tests/fixtures/toy-project/README.md`:
```markdown
# Toy project
A fixture target used by Core Mantra integration tests.
```

- [ ] **Step 2: Write the failing test**

Create `tests/integration/chant-mantra-lite.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";
import { nextPhase } from "../../skills/core/phase-router/route.mjs";
import { detectMode } from "../../skills/core/mode-detector/detect.mjs";

test("chant-mantra wiring: command exists and references required skills", () => {
  const { body } = parseFrontmatter(readFileSync("commands/chant-mantra.md", "utf8"));
  for (const ref of ["phase-router", "mode-detector", "mantra:build", "mantra:ship"]) {
    assert.ok(body.includes(ref), `chant-mantra must reference ${ref}`);
  }
});

test("lite fast-path: trivial input routes to lite mode and brainstorm phase", () => {
  assert.equal(detectMode({ filesTouched: 1, locChanged: 10 }), "lite");
  assert.equal(nextPhase({}), "brainstorm");
});

test("full mode on reviewed, unshipped topic routes to ship", () => {
  assert.equal(nextPhase({
    hasSpec: true, hasPlan: true, progressComplete: true, reviewed: true, shipped: false,
  }), "ship");
});

test("all referenced skills exist on disk", () => {
  const required = [
    "skills/core/mode-detector/SKILL.md",
    "skills/core/phase-router/SKILL.md",
    "skills/core/artifact-memory/SKILL.md",
    "skills/lifecycle/brainstorming/SKILL.md",
    "skills/lifecycle/writing-specs/SKILL.md",
    "skills/lifecycle/writing-plans/SKILL.md",
    "skills/lifecycle/executing-plans/SKILL.md",
    "skills/lifecycle/reviewing-code/SKILL.md",
    "skills/lifecycle/shipping/SKILL.md",
    "skills/discipline/tdd-red-green/SKILL.md",
    "skills/discipline/yagni-check/SKILL.md",
    "skills/discipline/subagent-driven-dev/SKILL.md",
    "skills/discipline/systematic-debugging/SKILL.md",
    "skills/discipline/simplify/SKILL.md",
    "skills/compound/extract-learnings/SKILL.md",
    "skills/compound/codify-to-skill/SKILL.md",
  ];
  for (const p of required) assert.ok(existsSync(p), `missing ${p}`);
});

test("all lifecycle commands exist", () => {
  const cmds = [
    "ideate", "brainstorm", "spec", "plan", "build", "test",
    "debug", "simplify", "review", "ship", "compound",
  ];
  for (const c of cmds) {
    assert.ok(existsSync(`commands/mantra-${c}.md`), `missing commands/mantra-${c}.md`);
  }
  assert.ok(existsSync("commands/chant-mantra.md"));
});
```

Run → FAIL (at least one skill/command likely missing until Phase 6 is complete; if run after Phase 6, should pass).

- [ ] **Step 3: Run it, verify pass**

```bash
node --test tests/integration/chant-mantra-lite.test.mjs
```

- [ ] **Step 4: Commit**

```bash
git add tests/integration/ tests/fixtures/
git commit -m "test: end-to-end wiring check for chant-mantra"
```

### Task 39: GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm test
```

- [ ] **Step 2: Verify locally**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions test workflow"
```

### Task 40: Issue + PR templates

**Files:**
- Create: `.github/ISSUE_TEMPLATE/bug_report.md`
- Create: `.github/ISSUE_TEMPLATE/feature_request.md`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`

- [ ] **Step 1: Write `bug_report.md`**

```markdown
---
name: Bug report
about: Something isn't working
labels: bug
---

**What happened**
(one-line summary)

**Steps to reproduce**
1.
2.

**Expected**

**Actual**

**Version / platform**
- Core Mantra version:
- Claude Code version:
- OS:
```

- [ ] **Step 2: Write `feature_request.md`**

```markdown
---
name: Feature request
about: Propose a new capability or skill
labels: enhancement
---

**Problem**
(what can't you do today)

**Proposal**
(rough sketch)

**Alternatives considered**
```

- [ ] **Step 3: Write `PULL_REQUEST_TEMPLATE.md`**

```markdown
## Summary

-
-

## Linked spec / plan
- Spec: `docs/core-mantra/specs/...`
- Plan: `docs/core-mantra/plans/...`

## Test plan
- [ ]

## Checklist
- [ ] Tests added/updated
- [ ] Progress.md updated
- [ ] Reviewed via `/mantra:review`
```

- [ ] **Step 4: Commit**

```bash
git add .github/
git commit -m "chore: add issue and PR templates"
```

---

## Phase 9 — Docs

### Task 41: Top-level README

**Files:**
- Create: `README.md`
- Create: `CREDITS.md`

- [ ] **Step 1: Write `README.md`**

```markdown
# Core Mantra

A Claude Code plugin that layers a compounding outer loop over lifecycle commands over a discipline engine. Synthesis of [agent-skills](https://github.com/addyosmani/agent-skills), [compound-engineering](https://github.com/EveryInc/compound-engineering-plugin), and [superpowers](https://github.com/obra/superpowers).

## 60-second quickstart

```bash
/plugin marketplace add core-mantra/core-mantra
/plugin install core-mantra
```

Then in any project:

```
/chant-mantra "add dark mode toggle to settings page"
```

Core Mantra picks a mode (`lite` / `standard` / `full`), detects the phase (`brainstorm` → `spec` → `plan` → `build` → `review` → `ship`), and runs it — pausing at approval gates.

## Commands

| Command | Purpose |
|---------|---------|
| `/chant-mantra <intent>` | Auto-router. Runs the right phase(s). |
| `/mantra:ideate` | Surface improvement ideas |
| `/mantra:brainstorm` | Refine an idea |
| `/mantra:spec` | Write the design spec |
| `/mantra:plan` | Write the TDD plan |
| `/mantra:build` | Execute the plan |
| `/mantra:test` | Run and expand tests |
| `/mantra:debug` | Systematic debugging |
| `/mantra:simplify` | Code-health pass |
| `/mantra:review` | Multi-agent review |
| `/mantra:ship` | Final gate + PR |
| `/mantra:compound` | Capture learnings |

## Docs

- [INSTALL](docs/INSTALL.md)
- [USAGE](docs/USAGE.md)
- [ARCHITECTURE](docs/ARCHITECTURE.md)
- [CONTRIBUTING](docs/CONTRIBUTING.md)
- [CREDITS](CREDITS.md)

## License

MIT.
```

- [ ] **Step 2: Write `CREDITS.md`**

```markdown
# Credits

Core Mantra synthesizes ideas and patterns from three prior projects:

- **[agent-skills](https://github.com/addyosmani/agent-skills)** — lifecycle command UX and auto-triggering skills.
- **[compound-engineering](https://github.com/EveryInc/compound-engineering-plugin)** — the compounding loop and `/compound` concept.
- **[superpowers](https://github.com/obra/superpowers)** — process discipline: TDD red/green, YAGNI, subagent-driven development, spec gates.

All three are MIT-licensed. Thanks to their authors.
```

- [ ] **Step 3: Commit**

```bash
git add README.md CREDITS.md
git commit -m "docs: add README and CREDITS"
```

### Task 42: INSTALL, USAGE, ARCHITECTURE

**Files:**
- Create: `docs/INSTALL.md`
- Create: `docs/USAGE.md`
- Create: `docs/ARCHITECTURE.md`

- [ ] **Step 1: Write `docs/INSTALL.md`**

```markdown
# Install

## Claude Code (marketplace)

```bash
/plugin marketplace add core-mantra/core-mantra
/plugin install core-mantra
```

## Claude Code (local dev)

```bash
git clone https://github.com/C0DERAI/core-mantra.git
claude --plugin-dir /path/to/core-mantra
```

## Requirements

- Claude Code ≥ 1.0
- Node.js ≥ 20 (for running plugin tests)
- Bash (for hooks)
- `git` on PATH

## Post-install

Run `/mantra:ideate` in any project to verify the plugin loaded. Core Mantra creates `docs/core-mantra/` in the project on first use.

## Platform support

v1 targets Claude Code only. Cursor, OpenCode, Gemini, and Antigravity adapters are on the v2+ roadmap.
```

- [ ] **Step 2: Write `docs/USAGE.md`**

```markdown
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
```

- [ ] **Step 3: Write `docs/ARCHITECTURE.md`**

```markdown
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
```

- [ ] **Step 4: Commit**

```bash
git add docs/INSTALL.md docs/USAGE.md docs/ARCHITECTURE.md
git commit -m "docs: add INSTALL, USAGE, ARCHITECTURE"
```

### Task 43: CONTRIBUTING + CHANGELOG

**Files:**
- Create: `docs/CONTRIBUTING.md`
- Create: `CHANGELOG.md`

- [ ] **Step 1: Write `docs/CONTRIBUTING.md`**

```markdown
# Contributing

## Quick rules

- Every skill, command, and agent has a matching test under `tests/`.
- All tests pass before merge: `npm test`.
- Use `/chant-mantra` or manual `/mantra:*` commands when developing Core Mantra itself — we dogfood.

## Adding a skill

1. Pick the layer: `core`, `lifecycle`, `discipline`, or `compound`.
2. Create `skills/<layer>/<name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: <name>
   description: <when to use; what it does>
   type: <layer>
   ---
   ```
3. Body must include at least one `## ` heading. Prefer sections: Purpose, Process, Hard rules.
4. Add a frontmatter-validator test under `tests/skills/<layer>/<name>.test.mjs`.
5. Run `npm test`. Commit as `feat(skills): add <layer>/<name>`.

## Adding a command

1. Create `commands/<name>.md` with frontmatter `name:` and `description:`.
2. Body lists the skills it invokes and the order.
3. Add a test under `tests/commands/<name>.test.mjs` that asserts frontmatter + required skill mentions.
4. Commit as `feat(commands): add /<name>`.

## Adding an agent

Same pattern. Cap return format at 300 words.

## PR process

- Link the spec and plan in your PR description.
- Fill the checklist in `.github/PULL_REQUEST_TEMPLATE.md`.
- Run `/mantra:review` before requesting human review.
```

- [ ] **Step 2: Write `CHANGELOG.md`**

```markdown
# Changelog

All notable changes to this project will be documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Initial v0.1.0 scaffolding: plugin manifest, 11 lifecycle commands + /chant-mantra auto-router, 16 skills (core/lifecycle/discipline/compound), 4 subagents, 2 hooks, 4 templates, test harness, CI workflow, and docs.
```

- [ ] **Step 3: Commit**

```bash
git add docs/CONTRIBUTING.md CHANGELOG.md
git commit -m "docs: add CONTRIBUTING and CHANGELOG"
```

---

## Self-review notes (already applied)

- **Spec coverage:** every numbered section of the spec maps to tasks — architecture (Phase 0/1), components (all phases), data flow (core skills + commands), error handling (shipping, systematic-debugging, hooks), testing (Phase 8), OSS readiness (Phase 9), risks (covered via mode-detector override, semi-auto compound gate, subagent summary rules, INDEX.md).
- **Placeholder scan:** no "TBD"/"TODO"/"fill in" — skill bodies are complete; group-tasks show all files' full content.
- **Type/name consistency:** skill type values (`core`/`lifecycle`/`discipline`/`compound`) match `tests/harness/validate-skill.mjs`. Skill names used in command bodies match the directories created in Phases 1–4. Phase-router state keys (`hasSpec`, `hasPlan`, `progressComplete`, `reviewed`, `shipped`) are consistent between `route.mjs`, its test, and the `phase-router` SKILL.md.
- **Dependency order:** Task 3 (validator) gates all skill tasks. Task 5 and 6 scripts are consumed by the integration test in Task 38. Commands (Phase 6) reference skills written in Phases 1–4 — all present before Task 38.
