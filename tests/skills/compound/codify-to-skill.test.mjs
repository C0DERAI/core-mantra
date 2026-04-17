import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("codify-to-skill SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/compound/codify-to-skill/SKILL.md", "utf8"), "codify-to-skill");
});
