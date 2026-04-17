---
name: mantra:compound
description: Extract learnings from a shipped feature and optionally codify them into skills.
---

When invoked:

1. Identify the most recently shipped topic from `INDEX.md` unless the user names one.
2. Invoke `compound/extract-learnings` and follow it.
3. If the resulting learning file contains a "Skills to update" section with entries, offer `compound/codify-to-skill`.
4. Commit the learning as `docs: capture learnings for <topic>`.
