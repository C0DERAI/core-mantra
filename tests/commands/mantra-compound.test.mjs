import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-compound command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-compound.md", "utf8"));
  assert.equal(data.name, "mantra:compound");
  assert.ok(body.includes("extract-learnings"));
  assert.ok(body.includes("codify-to-skill"));
});
