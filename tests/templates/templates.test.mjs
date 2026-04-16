import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

for (const f of ["spec", "plan", "progress", "learning"]) {
  test(`template ${f}.md has a level-2 heading`, () => {
    const src = readFileSync(`templates/${f}.md`, "utf8");
    assert.match(src, /^## /m);
  });
}
