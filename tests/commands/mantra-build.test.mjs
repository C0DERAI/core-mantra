import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-build command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-build.md", "utf8"));
  assert.equal(data.name, "mantra:build");
  assert.ok(body.includes("executing-plans"));
  assert.ok(body.includes("tdd-red-green"));
});
