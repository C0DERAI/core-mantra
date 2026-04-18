import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("artifact-memory SKILL.md is valid", () => {
  validateSkill(readUtf8("plugins/core-mantra/skills/core/artifact-memory/SKILL.md"), "artifact-memory");
});
