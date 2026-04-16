import { test } from "node:test";
import assert from "node:assert/strict";
import { nextPhase } from "../../../skills/core/phase-router/route.mjs";

test("nothing exists → brainstorm", () => {
  assert.equal(nextPhase({}), "brainstorm");
});

test("spec only → plan", () => {
  assert.equal(nextPhase({ hasSpec: true }), "plan");
});

test("plan but incomplete progress → build", () => {
  assert.equal(nextPhase({ hasSpec: true, hasPlan: true, progressComplete: false }), "build");
});

test("build done, no review → review", () => {
  assert.equal(nextPhase({ hasSpec: true, hasPlan: true, progressComplete: true, reviewed: false }), "review");
});

test("reviewed, not shipped → ship", () => {
  assert.equal(nextPhase({ hasSpec: true, hasPlan: true, progressComplete: true, reviewed: true, shipped: false }), "ship");
});

test("shipped → compound", () => {
  assert.equal(nextPhase({ hasSpec: true, hasPlan: true, progressComplete: true, reviewed: true, shipped: true }), "compound");
});
