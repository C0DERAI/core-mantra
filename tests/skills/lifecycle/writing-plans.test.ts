import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("writing-plans SKILL.md is valid", () => {
  validateSkill(readUtf8("plugins/core-mantra/skills/lifecycle/writing-plans/SKILL.md"), "writing-plans");
});
