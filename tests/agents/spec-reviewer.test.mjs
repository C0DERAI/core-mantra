import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("spec-reviewer frontmatter", () => {
  const { data } = parseFrontmatter(readFileSync("agents/spec-reviewer.md", "utf8"));
  assert.ok(data.name && data.description);
});
