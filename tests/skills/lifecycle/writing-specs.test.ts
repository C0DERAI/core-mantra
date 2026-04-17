import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("writing-specs SKILL.md is valid", () => {
  validateSkill(readUtf8("skills/lifecycle/writing-specs/SKILL.md"), "writing-specs");
});
