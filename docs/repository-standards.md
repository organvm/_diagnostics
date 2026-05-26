# Repository standard — `_diagnostics`

The standard this repo enforces on itself. Minimal by design: every rule below is
mechanically checked by [`tools/standards-lint.sh`](../tools/standards-lint.sh)
(and in CI). A rule that cannot be checked does not belong in this file.

## 1. Minimal root (progressive disclosure)

The root directory is a lobby. It contains **only** architectural pillars and the
files a stranger needs first:

- `README.md`, `.gitignore` (and `LICENSE` if the repo is ever licensed)
- the pillar directories: `docs/  inquiry/  assessments/  captures/  tools/  .github/`

No loose implementation files, no scratch output, no captures in the root. Anything
else at top level is a violation. Detail lives one level down.

## 2. Naming

| Kind | Convention | Example |
|---|---|---|
| Files & directories | `kebab-case`, lowercase | `diagnostics-loop.md` |
| Dated reports (`assessments/`) | **date-prefixed** `YYYY-MM-DD-{slug}.md` | `2026-05-23-reboot-readiness.md` |
| Ordered sequences | **number-prefixed** `NN-{slug}.md` | `00-scope.md` |
| Conventional exceptions | as the ecosystem dictates | `README.md`, `LICENSE`, `package.json` |

Never: spaces, capitals (outside the exceptions), or date-*suffixes*. A date-prefix
sorts chronologically in a plain `ls` and is checkable with one regex; a date-suffix
is neither.

## 3. Storage — where each kind of thing lives

| Content | Destination |
|---|---|
| Evergreen documentation | `docs/` |
| Dated analysis reports | `assessments/YYYY-MM-DD-*.md` |
| The design inquiry | `inquiry/lenses/` (corpus) + `inquiry/report/` (visualization) |
| Curated, text diagnostic captures | `captures/<capture-id>/` (tracked) |
| Raw / binary / huge captures | `captures/raw/` (gitignored) |
| Enforcement tooling | `tools/` |
| CI | `.github/workflows/` |

## 4. Never tracked

Capture blobs are regenerable and frequently enormous (a single heapsnapshot here is
~170 MB; one `sysdiagnose` tree is ~845 MB). They are gitignored by **type**
(`*.heapsnapshot`, `*.pcap`, `*.db`, the netlog/console/web logs, `*.zip` capture
archives, `sysdiagnose-*/`) and by **location** (`captures/raw/`). `.DS_Store` and
`node_modules/` are never tracked.

## 5. Enforcement

[`tools/standards-lint.sh`](../tools/standards-lint.sh) checks every rule above
against `git ls-files`: the minimal-root allowlist, no spaces in paths, no tracked
blobs, no `.DS_Store`, date-prefixed assessments, and a present `README.md`. It is
pure `bash` + `git` — no dependencies — and exits non-zero on any violation. The
`standards` GitHub Actions workflow runs it on push and pull request, so the standard
is enforced at the boundary, not merely documented.

Run locally before committing:

```sh
bash tools/standards-lint.sh
```
