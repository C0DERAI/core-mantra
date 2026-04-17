import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseFrontmatter } from "../harness/parse-frontmatter.mjs";

test("chant-mantra command", () => {
  const { data, body } = parseFrontmatter(readFileSync("commands/chant-mantra.md", "utf8"));
  assert.equal(data.name, "chant-mantra");
  for (const needed of ["phase-router", "mode-detector", "mantra:brainstorm", "mantra:ship"]) {
    assert.ok(body.includes(needed), `body should mention ${needed}`);
  }
});
