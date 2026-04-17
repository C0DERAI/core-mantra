import { test } from "node:test";
import assert from "node:assert/strict";
import { readUtf8 } from "../_helpers/fs.js";

for (const f of ["spec", "plan", "progress", "learning"] as const) {
  test(`template ${f}.md has a level-2 heading`, () => {
    const src = readUtf8(`templates/${f}.md`);
    assert.match(src, /^## /m);
  });
}
