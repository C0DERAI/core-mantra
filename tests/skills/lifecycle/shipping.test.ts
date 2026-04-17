import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("shipping SKILL.md is valid", () => {
  validateSkill(readUtf8("skills/lifecycle/shipping/SKILL.md"), "shipping");
});
