# `_diagnostics`

Complete home for the machine-diagnostics system: the **tools** themselves, the
design inquiry behind them, the analysis reports, and the raw captures they were
derived from. The diagnostic CLIs (`sysdiag`, `memdiag`, …) have their source of
record in [`bin/`](bin/) and are deployed onto `PATH` at `~/.local/bin/`. See
[`docs/diagnostics-loop.md`](docs/diagnostics-loop.md) for the toolkit's design law.

## Repository map

| Path | Holds |
|---|---|
| `bin/` | The diagnostic CLIs — the product (`sysdiag`, `memdiag`, `mem-pressure-snapshot`, `archive-snapshot`, …). |
| `docs/` | Evergreen documentation — the toolkit doc and the [repository standard](docs/repository-standards.md). |
| `inquiry/lenses/` | The six-lens "ideal diagnostics system" inquiry (`00-scope` … `06-synthesis`). |
| `inquiry/report/` | The React visualization of that inquiry (source; the bundle is regenerable). |
| `assessments/` | Dated session-analysis reports — `YYYY-MM-DD-{slug}.md`. |
| `captures/` | Raw diagnostic data. Curated text captures are tracked; `captures/raw/` is the gitignored landing zone for blobs. |
| `tools/` | `standards-lint.sh` — the on-demand convention checker. |
| `.github/workflows/` | CI that runs the lint on every push. |

## Conventions

This repo governs itself with one explicit standard:
**[`docs/repository-standards.md`](docs/repository-standards.md)**. In a line:
*minimal root, kebab-case, date-prefixed reports, no capture blobs in git.*

Check compliance at any time:

```sh
bash tools/standards-lint.sh
```

Exit `0` = clean. The same script runs in CI, so a violation fails the push.
