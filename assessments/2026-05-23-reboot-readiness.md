# Clean-Local-Reboot Readiness Assessment

**Date:** 2026-05-23 · **Author:** Claude (session 18240952) · **Goal context:** "all my work in repos + unique data preserved remotely; assess a complete local reboot with disciplined off-local refactoring to avoid death spirals"

**Companions:** `session-review-72h-2026-05-23-SYNTHESIS.md` · `prompt-ledger-72h-2026-05-23.md` · `plans-timeline-parity-2026-05-23.md`

---

## 1. Verdict

**A clean local reboot is FEASIBLE and the data risk is low — but NOT YET, because four unique-data stores are still local-only.** Once those four are preserved remotely (all are small and quick), the machine can be wiped and rebuilt with high confidence that nothing irreplaceable is lost.

**Reboot-readiness gate:** `READY ⟺ (prompt-atoms preserved) ∧ (2 no-remote repos pushed) ∧ (intake triaged) ∧ (1 unpushed plan synced)`. Everything else is already remote.

## 2. Preservation ledger (verified 2026-05-23)

### ✅ Already preserved remotely (safe to lose locally)
| Store | Status |
|---|---|
| `~/.claude` memory + plans | chezmoi → **PRIVATE** `4444J99/domus-semper-palingenesis`, `master` **0/0**, 0 uncommitted. 975/977 plans in remote. |
| All 134 git repos (committed work) | **0 ahead-of-remote** — every commit is pushed. corpvs `main` 0/0. |
| `~/_dot-config`, `~/_memory` | git-tracked + pushed. |
| The 05-20 SSH push wall (IRF-OPS-058) | **resolved** — chezmoi pushes over HTTPS, remote reachable. |

### ⚠️ Local-only — MUST preserve before reboot
| # | Store | Size | Risk | Preservation action |
|---|---|---|---|---|
| 1 | **`prompt-atoms.json`** (24,599 atoms — every prompt ever) | 70 MB | gitignored, **not in any git**, stale since May 10. Backblaze-only. **Cannot go to corpvs (PUBLIC) — contains private prompt content.** | Push to a **PRIVATE** archive repo (or git-LFS in a private repo). NOT public corpvs. |
| 2 | **`session-meta`** repo (27 files) | 868 K | no remote | `gh repo create 4444J99/session-meta --private --source --push` |
| 3 | **`speculum-opencode`** repo (11 files) | 284 K | no remote | `gh repo create 4444J99/speculum-opencode --private --source --push` |
| 4 | **`~/Code/intake`** (clipboard prompt exports, session transcripts, becka follow-up) | 1.2 G | non-git; unprocessed unique content mixed with bulk | Triage: archive the unique text (prompt exports, transcripts) to a private remote; the rest is bulk. |
| 5 | `2026-05-23-md-summoning-full-scale-plan.md` | tiny | runtime-only, not in chezmoi source | `chezmoi add` (→ private remote). |
| 6 | `_diagnostics/` text reports (this assessment, the 72h review, ledger, OpenCode REPORT.md) | ~MB | non-git workspace | git-init + private remote, **excluding** the heap snapshots / zips / 850 MB extract. |

### ⏸️ Local-only BY DESIGN (accepted, not a gap)
- `~/CLAUDE.md` — deliberately local-only (chezmoi-root collision); reproducible via session-transcript registry + Backblaze (IRF-CRP-011, DONE).
- `~/bound` (208 K) — cross-agent scratch ceremony; substantive content already migrated.
- Heap snapshots (167 + 179 MB), the 850 MB sysdiagnose extract — regenerable diagnostic binaries; do not preserve.

### The two empty repos (no action — no content)
`organvmhub` and `organvmhub-org` are empty `git init`s (0 commits). `coliseum-…archived-vendored` is an archive (2 commits) — preserve only if wanted.

## 3. Why the "death spirals" happen (root causes from the 72h review + diagnostics)

The recurring local crises share a structural signature: **frequently-churning local state that no remote pins.**

1. **Skills repo destruction (×5 in 11 days):** Claude Desktop cowork-vm wrote bundled defaults through a symlink chain into `~/Code/organvm/a-i--skills`. Mitigated, but the mitigation degrades (Option D/F/G drift back). → *off-local fix: the canonical skills live in a remote; local is a disposable materialization.*
2. **TCC "access data from other apps" re-prompts** (today's screenshot): macOS gates cross-container reads; the grant can't persist because **Ghostty is quarantined→translocated** (randomized path each launch) and the OS is a **Tahoe beta** that re-authorizes this class aggressively. → *off-local fix: de-quarantine apps; stable launcher identities.*
3. **Memory/swap pressure + orphan MCP fleets:** no lifecycle cleanup on session exit → orphan accumulation (self-resolves, recurs). 5 AI desktop apps + CLI fleet on 16 GB. → *off-local fix: fewer resident apps; on-demand MCP, reaper CLI (NOT a LaunchAgent — Rule #9).*
4. **Config drift:** deployed dotfiles (`settings.json`, `claude_desktop_config.json`) get rewritten by the apps, diverging from chezmoi source. → *off-local fix: source-of-truth is the private chezmoi remote; deployed copies are disposable, re-applied.*
5. **Gemini a2a-server churn:** 30/34 Gemini sessions in 72h are automated server respawns tied to MCP instability.

**Common cure:** treat **local as a cache, remote as canonical** — exactly the user's own `/goal REMOTE_IS_CANONICAL / LOCAL_IS_WORKSPACE / CACHE_IS_DISPOSABLE` from the 05-22 sessions.

## 4. Disciplined off-local refactoring (the reboot protocol)

**Principle: REMOTE_IS_CANONICAL · LOCAL_IS_DISPOSABLE.** A correct reboot is one where `chezmoi apply` + `git clone` + a documented install list reconstitutes the machine, and *nothing* unique is lost.

**Pre-reboot (preserve — items 1-6 above):**
1. Push prompt-atoms to a private archive repo.
2. Push the 2 no-remote repos (private).
3. Triage + archive `~/Code/intake` unique text.
4. `chezmoi add` the unpushed plan.
5. git-init + private-remote `_diagnostics` text reports.
6. Snapshot the install inventory: `brew bundle dump`, `~/.local/bin` list, the version-pinned toolchain (Node/Python/Rust/Go), the MCP server configs (already in chezmoi).

**Reboot:** erase + reinstall macOS (off the Tahoe beta if stability is the goal — the beta is implicated in #2 and the sysdiagnose collection failures), or a clean user-account rebuild.

**Post-reboot (reconstitute, disciplined):**
1. Install Homebrew + `brew bundle` from the dumped Brewfile.
2. `chezmoi init --apply` from the private remote → all dotfiles, `~/.local/bin`, memory, plans.
3. `git clone` the repo fleet (script from registry-v2.json).
4. Restore prompt-atoms from its private archive.
5. **Stop re-introducing the death-spiral causes:** de-quarantine any downloaded apps immediately (`xattr -dr com.apple.quarantine`); don't run 5 AI desktop apps simultaneously on 16 GB; keep the cowork skills mount decoupled (the parked Part B); don't re-enable the `DOMUS_ALLOW_SKILLS_LINK` symlink-to-canonical.

**Ongoing discipline (avoid re-spiraling):**
- **Atomize prompt-atoms on a cadence** (it's stale 13 days) + push to private archive — so the prompt ledger is never 70 MB of local-only risk.
- **Periodic preservation audit** (this doc's §2 as a checklist): the invariant is "0 local-only unique stores, 0 unpushed commits."
- **Config drift reconciliation**: deployed configs are disposable; re-apply from chezmoi, never hand-patch.

## 5. Required user actions (gated — I cannot do these autonomously)
- **Ghostty de-quarantine** — needs admin: `sudo xattr -dr com.apple.quarantine /Applications/Ghostty.app` (my shell got "Operation not permitted").
- **Approve the outward preservation pushes** (the permission classifier blocked them under a general goal) — the exact commands are in §2 / §4. Approve, or add a Bash permission rule, and I'll run them.

## 6. Bottom line
The reboot is **safe to do once the four local-only stores (§2) are pushed** — none is large; the work is ~30 min, mostly gated on your approval of outward pushes. The discipline that prevents the next death spiral is the `REMOTE_IS_CANONICAL / LOCAL_IS_DISPOSABLE` invariant you already articulated — this assessment operationalizes it into a pre/post-reboot checklist.
