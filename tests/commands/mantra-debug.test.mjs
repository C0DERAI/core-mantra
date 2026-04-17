import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-debug command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-debug.md", "utf8"));
  assert.equal(data.name, "mantra:debug");
  assert.ok(body.includes("systematic-debugging"));
});
