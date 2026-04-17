#!/usr/bin/env bash
set -euo pipefail

root="${1:-.}"
cfg="$root/docs/core-mantra/.mantra-config.json"

if [[ ! -f "$cfg" ]]; then
  echo "core-mantra: no-config"
  exit 0
fi

mode=$(grep -oE '"mode"[[:space:]]*:[[:space:]]*"[^"]+"' "$cfg" | sed -E 's/.*"([^"]+)"$/\1/' || echo "")
if [[ -z "$mode" ]]; then
  echo "core-mantra: config present, mode=unset"
else
  echo "core-mantra: mode=${mode}"
fi
