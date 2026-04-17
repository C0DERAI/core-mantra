import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("codify-to-skill SKILL.md is valid", () => {
  validateSkill(readUtf8("skills/compound/codify-to-skill/SKILL.md"), "codify-to-skill");
});
