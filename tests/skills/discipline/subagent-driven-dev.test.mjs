import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";

test("subagent-driven-dev SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/discipline/subagent-driven-dev/SKILL.md", "utf8"), "subagent-driven-dev");
});
