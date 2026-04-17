import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";

test("tdd-red-green SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/discipline/tdd-red-green/SKILL.md", "utf8"), "tdd-red-green");
});
