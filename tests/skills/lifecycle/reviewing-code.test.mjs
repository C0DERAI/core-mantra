import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("reviewing-code SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/lifecycle/reviewing-code/SKILL.md", "utf8"), "reviewing-code");
});
