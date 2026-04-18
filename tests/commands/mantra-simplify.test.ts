import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-simplify command", () => {
  const { data, body } = parseFrontmatter(readUtf8("plugins/core-mantra/commands/mantra-simplify.md"));
  assert.equal(data["name"], "mantra:simplify");
  assert.ok(body.includes("simplify"));
});
