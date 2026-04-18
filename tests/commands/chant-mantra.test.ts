import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";
import { readUtf8 } from "../_helpers/fs.js";

test("chant-mantra command", () => {
  const { data, body } = parseFrontmatter(readUtf8("plugins/core-mantra/commands/chant-mantra.md"));
  assert.equal(data["name"], "chant-mantra");
  for (const needed of [
    "phase-router",
    "mode-detector",
    "mantra:brainstorm",
    "mantra:ship",
  ]) {
    assert.ok(body.includes(needed), `body should mention ${needed}`);
  }
});
