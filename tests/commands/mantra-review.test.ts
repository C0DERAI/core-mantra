import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-review command", () => {
  const { data, body } = parseFrontmatter(readUtf8("commands/mantra-review.md"));
  assert.equal(data["name"], "mantra:review");
  for (const needed of [
    "reviewing-code",
    "spec-reviewer",
    "plan-reviewer",
    "code-reviewer",
  ]) {
    assert.ok(body.includes(needed), `body should mention ${needed}`);
  }
});
