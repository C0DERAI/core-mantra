import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";

test("systematic-debugging SKILL.md is valid", () => {
  validateSkill(readFileSync("skills/discipline/systematic-debugging/SKILL.md", "utf8"), "systematic-debugging");
});
