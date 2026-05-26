# `bin/` — the diagnostic CLIs

The product: read-only, on-demand diagnostic and preservation tools. No daemons, no
LaunchAgents (Rule #9) — every tool runs once when invoked and exits.

| Tool | What it does | Entry |
|---|---|---|
| `sysdiag` | Full 8-domain machine diagnostic (mem/cpu/disk/net/proc/power/logs/hw) with a `doctor` verdict dashboard, full-state `snap`, and `reconcile`. | `sysdiag doctor` |
| `memdiag` | Memory-focused diagnostic loop — `snap · verdict · reconcile · loop · watch · close`. | `memdiag loop` |
| `mem-pressure-snapshot` | SENSE primitive: capture live memory state to markdown + JSON sidecar. | `mem-pressure-snapshot` |
| `memdiag-watch.zsh` | Opt-in, non-resident zsh prompt hook that nudges only when memory is low. Sourced, not executed. | `source memdiag-watch.zsh` |
| `archive-snapshot` | On-demand encrypted snapshot of local-only data to a remote (Kopia/B2), per `REMOTE_IS_CANONICAL`. | `archive-snapshot` |

See [`../docs/diagnostics-loop.md`](../docs/diagnostics-loop.md) for the design law
these tools share (the SENSE→STRATIFY→RECONCILE→LOCATE→CLOSE loop).

## Source of record vs. deployed runtime

This directory is the **source of record** for the diagnostic CLIs. They are *run*
from `~/.local/bin/<tool>` (on `PATH`). Today that runtime copy is materialized by
the chezmoi dotfiles repo; consolidating it to deploy *from this directory* (so there
is exactly one canonical copy) is the open follow-up — deferred only because the
chezmoi source tree is currently lock-held by another session. Until then, treat
`bin/` here as canonical and re-sync the runtime from it after edits.
