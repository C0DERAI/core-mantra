import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("subagent-driven-dev SKILL.md is valid", () => {
  validateSkill(
    readUtf8("plugins/core-mantra/skills/discipline/subagent-driven-dev/SKILL.md"),
    "subagent-driven-dev",
  );
});
