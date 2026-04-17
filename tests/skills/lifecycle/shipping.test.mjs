import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";
test("shipping SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/lifecycle/shipping/SKILL.md", "utf8"), "shipping");
});
