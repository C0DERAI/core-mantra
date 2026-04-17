from validate_skill import validate_source


VALID = (
    "---\n"
    "name: foo\n"
    "description: bar\n"
    "type: core\n"
    "---\n"
    "\n"
    "## Purpose\n"
    "hi\n"
)


def test_accepts_valid_skill():
    assert validate_source(VALID) == []


def test_rejects_missing_description():
    src = VALID.replace("description: bar\n", "")
    errors = validate_source(src)
    assert any("description" in e for e in errors)


def test_rejects_invalid_type():
    src = VALID.replace("type: core", "type: bogus")
    errors = validate_source(src)
    assert any("type must be one of" in e for e in errors)


def test_rejects_missing_h2():
    src = VALID.replace("## Purpose\nhi\n", "no heading here\n")
    errors = validate_source(src)
    assert any("level-2 heading" in e for e in errors)


def test_rejects_unclosed_fence():
    src = "---\nname: foo\nno closing fence"
    errors = validate_source(src)
    assert any("frontmatter parse error" in e for e in errors)


def test_handles_multiline_description_via_yaml():
    """Regression: the regex-based JS parser truncated multi-line YAML values."""
    src = (
        "---\n"
        'name: foo\n'
        'description: |\n'
        '  line one\n'
        '  line two\n'
        "type: core\n"
        "---\n"
        "\n"
        "## Purpose\n"
    )
    assert validate_source(src) == []
