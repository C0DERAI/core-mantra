import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("code-reviewer frontmatter", () => {
  const { data } = parseFrontmatter(readUtf8("plugins/core-mantra/agents/code-reviewer.md"));
  assert.ok(data["name"] && data["description"]);
});
