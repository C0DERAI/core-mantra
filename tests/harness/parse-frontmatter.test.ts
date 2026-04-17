import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFrontmatter } from "../../src/harness/parse-frontmatter.js";

test("parses valid frontmatter", () => {
  const src = `---\nname: foo\ndescription: bar\ntype: skill\n---\n\nbody`;
  const { data, body } = parseFrontmatter(src);
  assert.equal(data["name"], "foo");
  assert.equal(data["description"], "bar");
  assert.equal(data["type"], "skill");
  assert.equal(body.trim(), "body");
});

test("throws on missing closing fence", () => {
  assert.throws(() => parseFrontmatter("---\nname: foo\nbody"));
});
