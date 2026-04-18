import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-build command", () => {
  const { data, body } = parseFrontmatter(readUtf8("plugins/core-mantra/commands/mantra-build.md"));
  assert.equal(data["name"], "mantra:build");
  assert.ok(body.includes("executing-plans"));
  assert.ok(body.includes("tdd-red-green"));
});
