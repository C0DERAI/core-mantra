export type FrontmatterData = Record<string, string>;

export interface ParsedMarkdown {
  data: FrontmatterData;
  body: string;
}

/**
 * Minimal YAML-frontmatter parser for the common single-line `key: value` case
 * used across Core Mantra skills, commands, and agents. The authoritative
 * validator (`tools/validate_skill.py`) uses PyYAML for full spec compliance;
 * this helper exists only to keep in-process test reads fast.
 */
export function parseFrontmatter(src: string): ParsedMarkdown {
  if (!src.startsWith("---\n")) return { data: {}, body: src };
  const end = src.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("Unclosed frontmatter fence");
  const head = src.slice(4, end);
  const body = src.slice(end + 5);
  const data: FrontmatterData = {};
  for (const line of head.split("\n")) {
    const m = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (m && m[1] !== undefined && m[2] !== undefined) {
      data[m[1]] = m[2].trim();
    }
  }
  return { data, body };
}
