import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-ideate command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-ideate.md", "utf8"));
  assert.equal(data.name, "mantra:ideate");
  assert.ok(body.includes("brainstorming") || body.includes("repo-scanner"));
});
