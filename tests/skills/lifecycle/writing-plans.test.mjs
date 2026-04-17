import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("writing-plans SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/lifecycle/writing-plans/SKILL.md", "utf8"), "writing-plans");
});
