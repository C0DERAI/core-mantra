import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("mantra-ship command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/mantra-ship.md", "utf8"));
  assert.equal(data.name, "mantra:ship");
  assert.ok(body.includes("shipping"));
  assert.ok(body.includes("post-ship-compound"));
});
