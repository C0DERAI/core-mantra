import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";

test("brainstorming SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/lifecycle/brainstorming/SKILL.md", "utf8"), "brainstorming");
});
