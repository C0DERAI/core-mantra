#!/usr/bin/env bash
set -euo pipefail

topic="${1:-unknown}"

if [[ "${MANTRA_NONINTERACTIVE:-0}" == "1" ]]; then
  answer="${MANTRA_TEST_ANSWER:-n}"
else
  read -rp "Compound learnings from ${topic}? (y/n) " answer
fi

case "$answer" in
  y|Y|yes)
    echo "Run /mantra:compound ${topic} to capture learnings."
    ;;
  *)
    echo "Compound step skipped for ${topic}."
    ;;
esac
