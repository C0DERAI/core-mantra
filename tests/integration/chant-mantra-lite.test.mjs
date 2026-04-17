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
