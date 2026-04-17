import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("repo-scanner frontmatter", () => {
  const { data } = parseFrontmatter(readFileSync("agents/repo-scanner.md", "utf8"));
  assert.ok(data.name && data.description);
});
