import { parseFrontmatter } from "./parse-frontmatter.js";

export type SkillType = "core" | "lifecycle" | "discipline" | "compound";

const REQUIRED_FIELDS = ["name", "description", "type"] as const;
const VALID_TYPES: ReadonlySet<SkillType> = new Set<SkillType>([
  "core",
  "lifecycle",
  "discipline",
  "compound",
]);

function isSkillType(value: string): value is SkillType {
  return VALID_TYPES.has(value as SkillType);
}

/**
 * In-process validator kept for fast Node test assertions. The canonical,
 * strict YAML-aware validator is `tools/validate_skill.py` — invoked by CI
 * and by `tests/harness/validator-bridge.test.ts`.
 */
export function validateSkill(src: string, filename: string): void {
  const { data, body } = parseFrontmatter(src);
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      throw new Error(`${filename}: missing frontmatter field "${field}"`);
    }
  }
  const type = data["type"];
  if (type === undefined || !isSkillType(type)) {
    throw new Error(
      `${filename}: type must be one of ${[...VALID_TYPES].join(", ")}`,
    );
  }
  if (!/^## /m.test(body)) {
    throw new Error(`${filename}: body must contain at least one level-2 heading`);
  }
}
