import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-debug command", () => {
  const { data, body } = parseFrontmatter(readUtf8("commands/mantra-debug.md"));
  assert.equal(data["name"], "mantra:debug");
  assert.ok(body.includes("systematic-debugging"));
});
