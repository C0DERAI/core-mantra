import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { nextPhase } from "../../src/skills/core/phase-router.js";
import { detectMode } from "../../src/skills/core/mode-detector.js";
import { readUtf8 } from "../_helpers/fs.js";

test("chant-mantra wiring: command exists and references required skills", () => {
  const { body } = parseFrontmatter(readUtf8("plugins/core-mantra/commands/chant-mantra.md"));
  for (const ref of ["phase-router", "mode-detector", "mantra:build", "mantra:ship"]) {
    assert.ok(body.includes(ref), `chant-mantra must reference ${ref}`);
  }
});

test("lite fast-path: trivial input routes to lite mode and brainstorm phase", () => {
  assert.equal(detectMode({ filesTouched: 1, locChanged: 10 }), "lite");
  assert.equal(nextPhase({}), "brainstorm");
});

test("full mode on reviewed, unshipped topic routes to ship", () => {
  assert.equal(
    nextPhase({
      hasSpec: true,
      hasPlan: true,
      progressComplete: true,
      reviewed: true,
      shipped: false,
    }),
    "ship",
  );
});

test("all referenced skills exist on disk", () => {
  const required = [
    "plugins/core-mantra/skills/core/mode-detector/SKILL.md",
    "plugins/core-mantra/skills/core/phase-router/SKILL.md",
    "plugins/core-mantra/skills/core/artifact-memory/SKILL.md",
    "plugins/core-mantra/skills/lifecycle/brainstorming/SKILL.md",
    "plugins/core-mantra/skills/lifecycle/writing-specs/SKILL.md",
    "plugins/core-mantra/skills/lifecycle/writing-plans/SKILL.md",
    "plugins/core-mantra/skills/lifecycle/executing-plans/SKILL.md",
    "plugins/core-mantra/skills/lifecycle/reviewing-code/SKILL.md",
    "plugins/core-mantra/skills/lifecycle/shipping/SKILL.md",
    "plugins/core-mantra/skills/discipline/tdd-red-green/SKILL.md",
    "plugins/core-mantra/skills/discipline/yagni-check/SKILL.md",
    "plugins/core-mantra/skills/discipline/subagent-driven-dev/SKILL.md",
    "plugins/core-mantra/skills/discipline/systematic-debugging/SKILL.md",
    "plugins/core-mantra/skills/discipline/simplify/SKILL.md",
    "plugins/core-mantra/skills/compound/extract-learnings/SKILL.md",
    "plugins/core-mantra/skills/compound/codify-to-skill/SKILL.md",
  ];
  for (const p of required) assert.ok(existsSync(p), `missing ${p}`);
});

test("all lifecycle commands exist", () => {
  const cmds = [
    "ideate",
    "brainstorm",
    "spec",
    "plan",
    "build",
    "test",
    "debug",
    "simplify",
    "review",
    "ship",
    "compound",
  ];
  for (const c of cmds) {
    assert.ok(
      existsSync(`plugins/core-mantra/commands/mantra-${c}.md`),
      `missing plugins/core-mantra/commands/mantra-${c}.md`,
    );
  }
  assert.ok(existsSync("plugins/core-mantra/commands/chant-mantra.md"));
});
