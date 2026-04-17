import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-simplify command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-simplify.md", "utf8"));
  assert.equal(data.name, "mantra:simplify");
  assert.ok(body.includes("simplify"));
});
