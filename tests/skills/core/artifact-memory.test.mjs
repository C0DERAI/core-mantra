import { test } from "node:test";
import { readFileSync } from "node:fs";
import { validateSkill } from "../../harness/validate-skill.mjs";

test("artifact-memory SKILL.md is valid", () => {
  const src = readFileSync("skills/core/artifact-memory/SKILL.md", "utf8");
  validateSkill(src, "artifact-memory");
});
