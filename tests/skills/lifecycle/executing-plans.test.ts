import { test } from "node:test";
import { validateSkill } from "../../../src/harness/validate-skill.js";
import { readUtf8 } from "../../_helpers/fs.js";

test("executing-plans SKILL.md is valid", () => {
  validateSkill(
    readUtf8("skills/lifecycle/executing-plans/SKILL.md"),
    "executing-plans",
  );
});
