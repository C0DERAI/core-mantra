import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";

test("yagni-check SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/discipline/yagni-check/SKILL.md", "utf8"), "yagni-check");
});
