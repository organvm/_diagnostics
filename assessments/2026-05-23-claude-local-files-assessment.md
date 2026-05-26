# Cowork + All Local Claude Files — Assessment

**Date:** 2026-05-23 · **Frame:** the resolution cascade — standard = *reboot-readiness*, classify every file **preserve / cache / dispose**.

## Total footprint: ~18.7 GB across 4 homes
| Home | Size | Role |
|---|---|---|
| `~/Library/Application Support/Claude` | **13 GB** | Claude Desktop (incl. all cowork state) |
| `~/.claude` | 3.4 GB | Claude Code CLI (sessions, memory, plans, plugins) |
| `~/.local/share/claude` | 2.0 GB | CLI version binaries |
| `~/Library/Logs/Claude` | 344 MB | Desktop logs |

**The headline: ~16 of the 18.7 GB is cache/regenerable. Only ~2.3 GB is unique-and-local-only; everything else unique is already on your private remote.**

## Classification

### ✅ PRESERVE — and already remote (safe to lose locally)
- `~/.claude/projects/*/memory/` — **1,036 memory files, chezmoi-synced** ✓
- `~/.claude/plans/` (110 MB) — chezmoi-synced (984 in remote) ✓
- `settings.json`, `CLAUDE.md`, `hooks/`, `PROMPT-LEDGER.md` — chezmoi ✓
- `claude_desktop_config.json` — **chezmoi-tracked** ✓ (`private_Library/.../claude_desktop_config.json.tmpl`; drifts — re-apply from source)
- `extensions-installations.json` (100 K) — the *list* of installed Desktop extensions → re-derivable

### ⚠️ PRESERVE — but LOCAL-ONLY (the one real gap)
- **`~/.claude/projects/` session transcripts — 9,646 `.jsonl`, 2.3 GB, NOT synced.** Only the `memory/` subdirs are in chezmoi; the raw transcripts are not. This is the raw record the prompt-atom registry is distilled from. Largely *re-derivable into* `prompt-atoms.json` (already snapshotted, push pending), so the **distilled** form is covered; the **raw** 2.3 GB is local-only. Decision: archive raw to the encrypted B2 store (the large-file method) **or** accept distilled-only + Backblaze.

### 🗑️ CACHE / REGENERABLE — safe to lose on reboot (reinstall / re-download)
| Item | Size | Why disposable |
|---|---|---|
| **`vm_bundles/claudevm.bundle`** | **9.8 GB** | the cowork Linux VM image — re-downloaded on next cowork launch |
| `Claude Extensions/` | 2.0 GB | reinstallable (list preserved in `extensions-installations.json`) |
| `~/.local/share/claude/versions/` | 608 MB | reinstall via `claude install`; only `2.1.150` is current (148/149 stale) |
| `plugins/` | 617 MB | reinstallable |
| `file-history/` `telemetry/` `paste-cache/` `sessions/` `prompts/` `debug/` | ~390 MB | local cache/telemetry |
| Desktop `claude-code-vm` `claude-code` `local-agent-mode-sessions` (non-skills) | ~700 MB | cowork runtime caches |
| Desktop browser caches (Cache, Code Cache, GPUCache, Local Storage…) | ~40 MB | Electron caches |
| `Logs/Claude` | 344 MB | logs |

## Cowork-specific verdict
**Cowork is the single largest *and* most troublesome local Claude consumer: ~10.5 GB** (`vm_bundles` 9.8 G + `claude-code-vm` 227 M + `claude-code` 203 M + `local-agent-mode-sessions` 288 M). It is also the subsystem that:
- destroyed the canonical skills repo **5× in 11 days** (mitigated; mitigation degraded — D/F/G drift),
- **churns** (SDK install loop — `claude-code-vm v2.1.148` reinstalled 6× in 2 min),
- has a **broken skills mount** (the mitigation; the safe decoupled-copy swap is staged, awaiting your authorization).

**Ideal-form resolution:** cowork's 10.5 GB is ~entirely disposable. Two clean paths:
- **If you want cowork** (your stated choice): authorize the decoupled-copy swap → skills mount safely; keep `vm_bundles` (it's the working VM).
- **If you don't**: clearing cowork reclaims ~10.5 GB *and* removes the recurring death-spiral source in one move.

## Reclaim opportunity (disk is 85% full — a death-spiral driver)
**~10.7 GB reclaimable immediately, touching nothing unique:**
- stale version dirs `2.1.148` + `2.1.149` (~405 MB)
- `Logs/Claude` (344 MB) + `telemetry` + `paste-cache` (~128 MB)
- `vm_bundles` (9.8 GB) — **only if cowork is cleared/not-in-active-use** (else it re-downloads)

(All are `rm`-safe regenerables, but I'd surface each for your go — deletion is the one operation that warrants confirmation even within reboot scope.)

## Net for reboot-readiness
Local Claude state is **overwhelmingly cache**. After the already-synced memory/plans/config, the **only** unique local-only Claude data is the **2.3 GB of raw session transcripts** — fold those into the encrypted B2 archive (or accept distilled-via-prompt-atoms + Backblaze), and the entire Claude footprint becomes reconstitutable: `claude install` + `chezmoi apply` + extension reinstall + (optional) transcript restore. Cowork's 10.5 GB regenerates on first launch and need not be preserved at all.
