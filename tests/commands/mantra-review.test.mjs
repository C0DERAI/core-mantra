import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-review command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-review.md", "utf8"));
  assert.equal(data.name, "mantra:review");
  for (const needed of ["reviewing-code", "spec-reviewer", "plan-reviewer", "code-reviewer"]) {
    assert.ok(body.includes(needed), `body should mention ${needed}`);
  }
});
