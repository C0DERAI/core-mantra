import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-test command", () => {
  const { data, body } = parseFrontmatter(readUtf8("commands/mantra-test.md"));
  assert.equal(data["name"], "mantra:test");
  assert.ok(body.includes("tdd-red-green"));
});
