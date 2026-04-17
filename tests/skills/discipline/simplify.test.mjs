import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";

test("simplify SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/discipline/simplify/SKILL.md", "utf8"), "simplify");
});
