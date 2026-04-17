#!/usr/bin/env python3
"""
Authoritative Core Mantra skill validator.

Validates one or more SKILL.md files against the project schema:
    - frontmatter must parse as YAML
    - required fields: name, description, type
    - type must be one of: core, lifecycle, discipline, compound
    - body must contain at least one level-2 heading

Exit code 0 on success, 1 on any validation error. Emits a JSON report to
stdout describing each file's status — CI and the TS bridge test both consume
this output.

Usage:
    python tools/validate_skill.py skills/**/SKILL.md
"""

from __future__ import annotations

import glob
import json
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

import yaml

REQUIRED_FIELDS = ("name", "description", "type")
VALID_TYPES = frozenset({"core", "lifecycle", "discipline", "compound"})
FENCE = "---\n"


@dataclass
class Report:
    path: str
    ok: bool
    errors: list[str]


def split_frontmatter(src: str) -> tuple[dict[str, object], str]:
    if not src.startswith(FENCE):
        return {}, src
    end = src.find("\n" + FENCE, len(FENCE))
    if end == -1:
        raise ValueError("unclosed frontmatter fence")
    head = src[len(FENCE):end]
    body = src[end + len("\n" + FENCE):]
    data = yaml.safe_load(head) or {}
    if not isinstance(data, dict):
        raise ValueError("frontmatter must be a YAML mapping")
    return data, body


def validate_source(src: str) -> list[str]:
    errors: list[str] = []
    try:
        data, body = split_frontmatter(src)
    except (ValueError, yaml.YAMLError) as exc:
        return [f"frontmatter parse error: {exc}"]

    for field in REQUIRED_FIELDS:
        if not data.get(field):
            errors.append(f'missing frontmatter field "{field}"')

    skill_type = data.get("type")
    if skill_type is not None and skill_type not in VALID_TYPES:
        errors.append(
            f'type must be one of {sorted(VALID_TYPES)}, got {skill_type!r}'
        )

    has_h2 = any(line.startswith("## ") for line in body.splitlines())
    if not has_h2:
        errors.append("body must contain at least one level-2 heading")

    return errors


def expand(patterns: list[str]) -> list[Path]:
    seen: list[Path] = []
    for pattern in patterns:
        for match in glob.glob(pattern, recursive=True):
            path = Path(match)
            if path.is_file():
                seen.append(path)
    return seen


def main(argv: list[str]) -> int:
    if not argv:
        print("usage: validate_skill.py <path-or-glob>...", file=sys.stderr)
        return 2

    paths = expand(argv)
    if not paths:
        print(json.dumps({"ok": False, "error": "no files matched"}))
        return 1

    reports = [
        Report(path=str(p), errors=validate_source(p.read_text(encoding="utf-8")), ok=False)
        for p in paths
    ]
    for r in reports:
        r.ok = not r.errors

    all_ok = all(r.ok for r in reports)
    print(json.dumps({"ok": all_ok, "files": [asdict(r) for r in reports]}, indent=2))
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
