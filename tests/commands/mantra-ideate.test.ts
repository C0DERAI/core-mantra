import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-ideate command", () => {
  const { data, body } = parseFrontmatter(readUtf8("plugins/core-mantra/commands/mantra-ideate.md"));
  assert.equal(data["name"], "mantra:ideate");
  assert.ok(body.includes("brainstorming") || body.includes("repo-scanner"));
});
