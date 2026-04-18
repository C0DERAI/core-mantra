import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

/**
 * Bridge test: runs the canonical Python validator against every SKILL.md
 * and asserts success. Skipped automatically when Python + PyYAML aren't
 * available (e.g. contributor hasn't run `pip install -r tools/requirements.txt`
 * yet). CI always has them installed, so this test is strict there.
 */
function pythonAvailable(): boolean {
  try {
    execFileSync("python", ["-c", "import yaml"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

test("python validator accepts all shipped skills", (t) => {
  if (!pythonAvailable()) {
    t.skip("python+pyyaml not available on this machine");
    return;
  }
  if (!existsSync("tools/validate_skill.py")) {
    t.skip("validator script missing");
    return;
  }
  const out = execFileSync(
    "python",
    ["tools/validate_skill.py", "plugins/core-mantra/skills/**/SKILL.md"],
    { encoding: "utf8" },
  );
  const report = JSON.parse(out) as {
    ok: boolean;
    files: Array<{ path: string; ok: boolean; errors: string[] }>;
  };
  assert.equal(report.ok, true, `validator reported failures: ${out}`);
  assert.ok(report.files.length > 0, "expected at least one skill file");
});
