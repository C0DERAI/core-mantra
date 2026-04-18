import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("extract-learnings SKILL.md is valid", () => {
  validateSkill(
    readUtf8("plugins/core-mantra/skills/compound/extract-learnings/SKILL.md"),
    "extract-learnings",
  );
});
