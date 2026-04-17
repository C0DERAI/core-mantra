---
name: mantra:ideate
description: Divergent ideation — surface high-impact improvements for the current project. Dispatches repo-scanner, then proposes ranked ideas with tradeoffs.
---

When invoked:

1. Invoke `core/mode-detector` to pick a mode. In `lite` mode, skip to step 3.
2. Dispatch the `repo-scanner` agent with: "What are the most active areas of this project and what conventions are used?"
3. Based on the scan, propose 5-10 improvement ideas. For each: area, one-line summary, estimated impact, rough effort.
4. Ask the user to pick one or more to push into `/mantra:brainstorm`.

Do not write any code. Do not modify files.
