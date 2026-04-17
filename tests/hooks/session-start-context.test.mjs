import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";

test("reports mode from .mantra-config.json", () => {
  const dir = ".tmp/session-test";
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(`${dir}/docs/core-mantra`, { recursive: true });
  writeFileSync(`${dir}/docs/core-mantra/.mantra-config.json`, '{"mode":"full"}');
  const out = execFileSync("bash", ["hooks/session-start-context.sh", dir]).toString();
  assert.ok(out.includes("mode=full"));
});

test("reports no-config when file missing", () => {
  const dir = ".tmp/session-test-empty";
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const out = execFileSync("bash", ["hooks/session-start-context.sh", dir]).toString();
  assert.ok(out.includes("no-config"));
});
