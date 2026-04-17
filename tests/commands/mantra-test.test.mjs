import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-test command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-test.md", "utf8"));
  assert.equal(data.name, "mantra:test");
  assert.ok(body.includes("tdd-red-green"));
});
