# The diagnostics loop — `memdiag`

**Built:** 2026-05-25 · **Author:** Claude Code (diagnostics session)
**Derives from:** `sysdiagnose-2026-05-21/SYNTHESIS-2026-05-23.md`
**Constraint:** read-only, on-demand, **no LaunchAgent** (Rule #9 HARD)

This is the executable form of the ideal articulated in the synthesis: a diagnostics
system is not a report — it is a **closed, read-only, constraint-fitted loop** whose
primary act is *reconciliation against live state*, not the reading of stale reports.

```
   SENSE ──► STRATIFY ──► RECONCILE ──► LOCATE ──► CLOSE ──┐
   snap      verdict      reconcile     verdict    close    │
     ▲────────────────────────────────────────────────────-┘
              each pass shortens the next autopsy gap toward zero
```

## Why it exists

The 2026-05-21 crisis had to be reconstructed 48h late from stale logs. By then every
"critical" number was a ghost — acting on the autopsy would have killed processes reaped
two days earlier. The loop's job is to make the *next* episode recorded-live, not
re-autopsied, and to make verification-against-now the load-bearing step.

## Commands

| Phase | Command | Does |
|---|---|---|
| **SENSE** | `memdiag snap` | Capture live state → `mem-<ISO>.md` (human) + `.json` (machine). Read-only. |
| **STRATIFY+LOCATE** | `memdiag verdict [json]` | Classify health off the **trustworthy** metric (`mem_free_pct`); decide *localized vs cumulative*; flag standing findings (Jupyter/Ollama/AI-co-residency/disk). Defaults to newest snapshot. |
| **RECONCILE** | `memdiag reconcile [old new]` | Auto delta table between two captures — **the delta is the finding**. Defaults to the two newest. |
| **full pass** | `memdiag loop` | `snap` then `verdict` in one move. |
| **trigger** | `memdiag watch [thresh]` | Sub-ms sample; prints a nudge *only* if free% < thresh (default 25). Silent when healthy. For shell-prompt hooks. |
| **CLOSE** | `memdiag close [IRF-id]` | Emit the loop-forward artifacts: an IRF row stub + the behavioral forcing function. |
| — | `memdiag list` | One-line-per-capture inventory. |

## Design invariants (each maps to a synthesis finding)

1. **Capture at incident-time, not analysis-time** → `snap` / `watch`.
2. **Stratify signals by trust; lead with `mem_free_pct`** — swap-% is unstable (dynamic
   resize), `vm_stat` "free" is misleading (inactive pages reclaimable). `verdict` reads
   the headline; swap is recorded but labeled informational.
3. **Verify-against-now is the primary act** (memory rule #12) → `reconcile`.
4. **The reconciliation delta IS a finding**, not discarded noise → `reconcile` verdict column.
5. **Contributor ≠ root cause** → `verdict` shape line: *localized* (one process dominates)
   vs *cumulative co-residency* (the 05-21 mode; no single PID is "the bug").
6. **Observe without perturbing** → every subcommand is read-only; mutation is out of scope.
7. **Fit the host's constraints or become the disease** → on-demand CLI; `watch` is a
   non-resident prompt sampler, never a daemon (Rule #9).
8. **Close the loop** → `close` forwards into IRF + behavioral mitigation, so a diagnosis
   never dies as a terminal report (Rule #7, everything is a loop).

## Opt-in prompt trigger (the non-resident "middle path")

`watch` is meant to fire on shell-prompt render — once when you press enter, spawning
nothing resident. To enable (opt-in; not auto-installed):

```sh
echo 'source ~/.local/bin/memdiag-watch.zsh' >> ~/.zshrc
# optional: export MEMDIAG_WATCH_THRESHOLD=20
```

It throttles to at most once per 60s and stays silent while healthy.

## Files

| Path | Role |
|---|---|
| `~/.local/bin/mem-pressure-snapshot` | SENSE primitive — dual-emits markdown + JSON sidecar |
| `~/.local/bin/memdiag` | the loop orchestrator (verdict / reconcile / loop / watch / close / list) |
| `~/.local/bin/memdiag-watch.zsh` | opt-in non-resident prompt-hook sampler |
| `~/.claude/projects/-Users-4jp-Workspace--diagnostics/snapshots/` | capture series (`.md` + `.json`) |

## Suggested alias

```sh
alias mps='memdiag loop'   # snap + verdict the moment it feels slow
```
