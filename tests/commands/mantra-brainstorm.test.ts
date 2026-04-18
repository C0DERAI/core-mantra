import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-brainstorm command", () => {
  const { data, body } = parseFrontmatter(readUtf8("plugins/core-mantra/commands/mantra-brainstorm.md"));
  assert.equal(data["name"], "mantra:brainstorm");
  assert.ok(body.includes("brainstorming"));
});
