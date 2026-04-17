#!/usr/bin/env bash
# Core Mantra release helper.
# Bumps the version in package.json and .claude-plugin/plugin.json, commits,
# and creates an annotated git tag. Does NOT push — review first.
#
# Usage:  scripts/release.sh 0.2.0

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <new-version>" >&2
  exit 2
fi

NEW_VERSION="$1"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! "$NEW_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.-]+)?$ ]]; then
  echo "error: version must be semver (e.g. 0.2.0 or 0.2.0-rc.1)" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree is dirty — commit or stash first" >&2
  exit 1
fi

bump() {
  local file="$1"
  python - "$file" "$NEW_VERSION" <<'PY'
import json, sys
path, version = sys.argv[1], sys.argv[2]
with open(path) as f:
    data = json.load(f)
data["version"] = version
with open(path, "w") as f:
    json.dump(data, f, indent=2)
    f.write("\n")
PY
}

bump package.json
bump .claude-plugin/plugin.json

git add package.json .claude-plugin/plugin.json
git commit -m "release: v${NEW_VERSION}"
git tag -a "v${NEW_VERSION}" -m "v${NEW_VERSION}"

echo ""
echo "Tagged v${NEW_VERSION}. Push with:"
echo "    git push origin main --follow-tags"
