import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSkill } from "../../src/harness/validate-skill.js";

test("accepts valid skill", () => {
  const src = `---\nname: foo\ndescription: bar\ntype: core\n---\n\n## Purpose\nhi`;
  assert.doesNotThrow(() => validateSkill(src, "foo"));
});

test("rejects missing description", () => {
  const src = `---\nname: foo\ntype: core\n---\n\n## Purpose\nhi`;
  assert.throws(() => validateSkill(src, "foo"), /description/);
});

test("rejects missing level-2 heading", () => {
  const src = `---\nname: foo\ndescription: bar\ntype: core\n---\n\nno heading`;
  assert.throws(() => validateSkill(src, "foo"), /heading/);
});
