#!/usr/bin/env bash
# standards-lint.sh — enforce the _diagnostics repository standard.
#
# Pure bash + git, no dependencies. Checks the rules in docs/repository-standards.md
# against the tracked tree. Exit 0 = clean, 1 = violations, 2 = not a git repo.
# Runs identically on demand and in CI.
set -uo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || { echo "not a git repository"; exit 2; }

fail=0
note() { printf '  \xe2\x9c\x97 %s\n' "$*"; fail=1; }

# Rule 1 — minimal root: only these top-level entries are allowed.
allowed='|README.md|LICENSE|.gitignore|.github|assessments|captures|docs|inquiry|tools|'
echo "→ minimal root (allowlist)"
while IFS= read -r top; do
  [ -z "$top" ] && continue
  case "$allowed" in
    *"|$top|"*) : ;;
    *) note "stray root entry: '$top' — move it into a pillar directory" ;;
  esac
done < <(git ls-files | awk -F/ '{print $1}' | sort -u)

# Rule 2 — no spaces in tracked paths.
echo "→ no spaces in tracked paths"
while IFS= read -r f; do
  [ -n "$f" ] && note "path contains a space: '$f'"
done < <(git ls-files | grep ' ' || true)

# Rule 4 — no capture blobs tracked.
echo "→ no capture blobs tracked"
while IFS= read -r f; do
  [ -n "$f" ] && note "binary capture is tracked: '$f' (belongs in captures/raw/)"
done < <(git ls-files | grep -iE '\.(heapsnapshot|pcap|diag|db|db-wal|zip)$' || true)

# Rule 4 — no .DS_Store tracked.
echo "→ no .DS_Store tracked"
while IFS= read -r f; do
  [ -n "$f" ] && note ".DS_Store is tracked: '$f'"
done < <(git ls-files | grep -iE '(^|/)\.DS_Store$' || true)

# Rule 2 — assessments are date-prefixed YYYY-MM-DD-.
echo "→ assessments date-prefixed (YYYY-MM-DD-)"
while IFS= read -r f; do
  [ -z "$f" ] && continue
  base=$(basename "$f")
  [[ "$base" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}-.+\.md$ ]] || \
    note "assessment is not date-prefixed: '$f'"
done < <(git ls-files assessments/ 2>/dev/null | grep -i '\.md$' || true)

# Rule 1 — README present.
echo "→ README present"
[ -f README.md ] || note "missing README.md"

echo
if [ "$fail" -eq 0 ]; then
  printf '\xe2\x9c\x93 standards: clean\n'
else
  printf '\xe2\x9c\x97 standards: VIOLATIONS (see above)\n'
fi
exit "$fail"
