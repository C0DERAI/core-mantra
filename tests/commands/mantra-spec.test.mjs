import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-spec command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-spec.md", "utf8"));
  assert.equal(data.name, "mantra:spec");
  assert.ok(body.includes("writing-specs"));
  assert.ok(body.includes("artifact-memory"));
});
