export function parseFrontmatter(src) {
  if (!src.startsWith("---\n")) return { data: {}, body: src };
  const end = src.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("Unclosed frontmatter fence");
  const head = src.slice(4, end);
  const body = src.slice(end + 5);
  const data = {};
  for (const line of head.split("\n")) {
    const m = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (m) data[m[1]] = m[2].trim();
  }
  return { data, body };
}
