# Install

## Claude Code (marketplace)

```bash
/plugin marketplace add core-mantra/core-mantra
/plugin install core-mantra
```

## Claude Code (local dev)

```bash
git clone https://github.com/core-mantra/core-mantra.git
claude --plugin-dir /path/to/core-mantra
```

## Requirements

- Claude Code ≥ 1.0
- Node.js ≥ 20 (for running plugin tests)
- Bash (for hooks)
- `git` on PATH

## Post-install

Run `/mantra:ideate` in any project to verify the plugin loaded. Core Mantra creates `docs/core-mantra/` in the project on first use.

## Platform support

v1 targets Claude Code only. Cursor, OpenCode, Gemini, and Antigravity adapters are on the v2+ roadmap.
