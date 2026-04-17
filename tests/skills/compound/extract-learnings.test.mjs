import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("extract-learnings SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/compound/extract-learnings/SKILL.md", "utf8"), "extract-learnings");
});
