import { parseFrontmatter } from "./parse-frontmatter.mjs";

const REQUIRED = ["name", "description", "type"];
const TYPES = new Set(["core", "lifecycle", "discipline", "compound"]);

export function validateSkill(src, filename) {
  const { data, body } = parseFrontmatter(src);
  for (const field of REQUIRED) {
    if (!data[field]) throw new Error(`${filename}: missing frontmatter field "${field}"`);
  }
  if (!TYPES.has(data.type)) {
    throw new Error(`${filename}: type must be one of ${[...TYPES].join(", ")}`);
  }
  if (!/^## /m.test(body)) {
    throw new Error(`${filename}: body must contain at least one level-2 heading`);
  }
}
