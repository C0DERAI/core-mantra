import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("writing-specs SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/lifecycle/writing-specs/SKILL.md", "utf8"), "writing-specs");
});
