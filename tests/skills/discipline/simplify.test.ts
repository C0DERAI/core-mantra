import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("simplify SKILL.md is valid", () => {
  validateSkill(readUtf8("skills/discipline/simplify/SKILL.md"), "simplify");
});
