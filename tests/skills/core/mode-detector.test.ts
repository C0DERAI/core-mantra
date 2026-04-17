import { test } from "node:test";
import assert from "node:assert/strict";
import { detectMode } from "../../../src/skills/core/mode-detector.js";

test("one-file 10-line change → lite", () => {
  assert.equal(
    detectMode({ filesTouched: 1, locChanged: 10, newPublicApi: false, newDeps: 0 }),
    "lite",
  );
});

test("two files, no API change → standard", () => {
  assert.equal(
    detectMode({ filesTouched: 2, locChanged: 80, newPublicApi: false, newDeps: 0 }),
    "standard",
  );
});

test("new public API → full", () => {
  assert.equal(
    detectMode({ filesTouched: 1, locChanged: 5, newPublicApi: true, newDeps: 0 }),
    "full",
  );
});

test("new dependency → full", () => {
  assert.equal(
    detectMode({ filesTouched: 1, locChanged: 5, newPublicApi: false, newDeps: 1 }),
    "full",
  );
});

test("user override wins", () => {
  assert.equal(detectMode({ filesTouched: 1, locChanged: 5, override: "full" }), "full");
});
