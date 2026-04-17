import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

test("exits 0 when user answers n", () => {
  const out = execFileSync("bash", ["hooks/post-ship-compound.sh", "my-topic"], {
    input: "n\n",
    env: { ...process.env, MANTRA_NONINTERACTIVE: "1", MANTRA_TEST_ANSWER: "n" },
  }).toString();
  assert.ok(out.includes("skipped"));
});

test("suggests /mantra:compound when user answers y", () => {
  const out = execFileSync("bash", ["hooks/post-ship-compound.sh", "my-topic"], {
    env: { ...process.env, MANTRA_NONINTERACTIVE: "1", MANTRA_TEST_ANSWER: "y" },
  }).toString();
  assert.ok(out.includes("/mantra:compound"));
});
