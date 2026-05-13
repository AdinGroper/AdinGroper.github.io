---
name: readtime
description: Estimate the reading time for a travel page on this site
allowed-tools:
  - Bash(python *)
---

Estimate the reading time for a travel page on this site.

The argument is a page name or partial match (e.g. "singapore", "colombia-medellin"). $ARGUMENTS

Run this command and report the output:

```
python "${CLAUDE_SKILL_DIR}/readtime.py" $ARGUMENTS
```

If no argument was given, run without arguments to list available pages, then ask the user which one they'd like.
