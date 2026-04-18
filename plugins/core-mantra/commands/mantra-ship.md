---
name: mantra:ship
description: Final verification, commit/PR, and trigger the semi-auto compound hook.
---

When invoked:

1. Confirm `reviewed:` entry exists in progress.md. If not, route to `/mantra:review`.
2. Invoke `lifecycle/shipping` and follow it.
3. After a successful ship, fire `hooks/post-ship-compound.sh`. If it fails, log a warning but do not block the ship.
