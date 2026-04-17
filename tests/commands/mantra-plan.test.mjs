import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-plan command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-plan.md", "utf8"));
  assert.equal(data.name, "mantra:plan");
  assert.ok(body.includes("writing-plans"));
});
