import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-compound command", () => {
  const { data, body } = parseFrontmatter(readUtf8("commands/mantra-compound.md"));
  assert.equal(data["name"], "mantra:compound");
  assert.ok(body.includes("extract-learnings"));
  assert.ok(body.includes("codify-to-skill"));
});
