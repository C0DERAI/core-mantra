import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-plan command", () => {
  const { data, body } = parseFrontmatter(readUtf8("commands/mantra-plan.md"));
  assert.equal(data["name"], "mantra:plan");
  assert.ok(body.includes("writing-plans"));
});
