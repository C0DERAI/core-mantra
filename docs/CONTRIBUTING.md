# Contributing

## Quick rules

- Every skill, command, and agent has a matching test under `tests/`.
- All tests pass before merge: `npm test`.
- Use `/chant-mantra` or manual `/mantra:*` commands when developing Core Mantra itself — we dogfood.

## Adding a skill

1. Pick the layer: `core`, `lifecycle`, `discipline`, or `compound`.
2. Create `skills/<layer>/<name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: <name>
   description: <when to use; what it does>
   type: <layer>
   ---
   ```
3. Body must include at least one `## ` heading. Prefer sections: Purpose, Process, Hard rules.
4. Add a frontmatter-validator test under `tests/skills/<layer>/<name>.test.mjs`.
5. Run `npm test`. Commit as `feat(skills): add <layer>/<name>`.

## Adding a command

1. Create `commands/<name>.md` with frontmatter `name:` and `description:`.
2. Body lists the skills it invokes and the order.
3. Add a test under `tests/commands/<name>.test.mjs` that asserts frontmatter + required skill mentions.
4. Commit as `feat(commands): add /<name>`.

## Adding an agent

Same pattern. Cap return format at 300 words.

## PR process

- Link the spec and plan in your PR description.
- Fill the checklist in `.github/PULL_REQUEST_TEMPLATE.md`.
- Run `/mantra:review` before requesting human review.
