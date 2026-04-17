import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-brainstorm command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-brainstorm.md", "utf8"));
  assert.equal(data.name, "mantra:brainstorm");
  assert.ok(body.includes("brainstorming"));
});
