import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("executing-plans SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/lifecycle/executing-plans/SKILL.md", "utf8"), "executing-plans");
});
