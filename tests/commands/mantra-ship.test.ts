import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-ship command", () => {
  const { data, body } = parseFrontmatter(readUtf8("commands/mantra-ship.md"));
  assert.equal(data["name"], "mantra:ship");
  assert.ok(body.includes("shipping"));
  assert.ok(body.includes("post-ship-compound"));
});
