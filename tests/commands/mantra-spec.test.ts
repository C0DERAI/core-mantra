import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("mantra-spec command", () => {
  const { data, body } = parseFrontmatter(readUtf8("commands/mantra-spec.md"));
  assert.equal(data["name"], "mantra:spec");
  assert.ok(body.includes("writing-specs"));
  assert.ok(body.includes("artifact-memory"));
});
