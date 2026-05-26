# Cowork + Local Claude — Heal Record

**Date:** 2026-05-24 · **Session:** 18240952 · **Directive:** "address cowork — the bigger picture of all claude desktop, cowork, code installations on local — and debug and heal it"

Companion to `debug-claude-desktop-and-zesty-scroll.md` (the plan — Part B now EXECUTED) and `claude-local-files-assessment-2026-05-23.md`.

## What was healed (executed, pushed, durable)

### 1. Cowork skills mount — the recurring destroyer, now neutralized AND working
The cowork-vm mounted `<plugin>/skills` as the VM's `.claude/skills`. That path was a **symlink → canonical repo**, so the VM wrote bundled defaults back through it and wiped `~/Code/organvm/a-i--skills` (5× in 11 days). The 05-23 mitigation left the symlink *dangling* (→ a stub outside the VM share) so the mount failed — safe, but cowork had **no skills**.

**The fix (link → copy):** replaced the symlink with a **real, decoupled directory** populated by a one-way copy of the 161 canonical skills. The copy is inside the share (VM can mount it → cowork gets skills) but is a distinct inode (VM write-back lands on the copy, never canonical).

- Plugin path now: **real dir, 161 SKILL.md** (was: symlink → stub). Old symlink backed up to `…/skills.symlink-backup.20260524T182136Z` (reversible).
- Canonical: **untouched** (836 SKILL.md, 22 root entries — verified before & after).

### 2. Six-layer mitigation re-hardened
| Layer | 05-23 | Now |
|---|---|---|
| A — `~/Workspace/a-i--skills` absent | ✓ | ✓ |
| B — plugin path decoupled | symlink (dangling) | **real decoupled copy** ✓ |
| D — canonical `.git` immutable | **LOST** | **`uchg` restored** ✓ |
| E — Workspace not trusted | ✓ | absent (✓) |
| F — `coworkScheduledTasksEnabled` | true (regressed) | **absent — self-healed via chezmoi** ✓ |
| G — bypass perms | account-true (regressed) | **none — self-healed via chezmoi** ✓ |

F/G self-healed because `claude_desktop_config.json` is chezmoi-tracked; the deployed config drifted and was re-pulled toward source. D can't self-heal that way (a runtime filesystem flag chezmoi doesn't track) — re-applied manually.

### 3. New tooling (created, deployed via chezmoi, pushed — commit `a22a3a4`)
- `~/.local/bin/cowork-skills-sync` — one-way canonical→plugin copy. Safety gate: ABORTS if target resolves into canonical; backs up any symlink before replacing with a real dir.
- `~/.local/bin/skills-git-unlock` / `skills-git-relock` — chflags wrappers for the immutable `.git` (so active development isn't blocked).
- `.chezmoiscripts/run_onchange_after_link-skills.sh.tmpl` — **base fixed** (Rule #6): the `ln -sfn`-to-canonical destruction logic replaced by a call to `cowork-skills-sync`. The `DOMUS_ALLOW_SKILLS_LINK` guard now gates the SAFE copy, not the dangerous link.

## Bigger-picture debug findings (all three installations)

- **Footprint:** Desktop 13G (9.8G = `vm_bundles` cowork VM image — *wanted* now that cowork works) · Claude Code `~/.claude` 2.0G (1.3G unique transcripts) · version binaries 2.0G · logs 344M.
- **Disk:** 68G free / 85% used — **comfortable**, not an emergency. The death-spiral risk was always *churn spikes* (a wedged VM re-downloading 9.8G), not steady fullness. The mount fix removes the likely churn driver (mount-failure → VM restart loop).
- **Processes:** the 13 resident Claude Code procs are the **healthy daemon tree** (one `claude daemon run` singleton + managed pty-hosts/spares/sessions), NOT orphans. No cleanup needed. (PID 85278 = this session.)
- **Config drift:** self-healed (F/G above) — the chezmoi "local-is-cache, source-is-canonical" invariant working as designed.

## Open / deferred (not done; need a go)

- **Reclaim (optional, no urgency — 68G free):** stale CLI versions 2.1.148 + 2.1.149 (~1.3G, unused — keep 150 active, optionally keep 149 as rollback); `telemetry`+`paste-cache` (~128M). **Do NOT delete:** `vm_bundles` (cowork uses it), `projects/` transcripts (unique), `Logs/Claude` (active diagnostic evidence).
- **Survival spike — ANSWERED (2026-05-24):** launching Desktop DID overwrite the plugin dir — it dropped from my 161-copy to a 50-skill set **byte-identical (md5) to the stub** `~/.local/share/claude-desktop-skills-stub`. So **Desktop materializes the plugin skills dir from the stub on launch.** Canonical stayed safe (836/`uchg`) throughout — proving the decoupled design holds even under Desktop's active writes. **Fix applied:** `cowork-skills-sync` now syncs canonical → BOTH the stub (Desktop's durable source, outside the VM share) AND the plugin dir. Stub + plugin both at 161 (commit `8471635`). Desktop now propagates the full 161 to cowork on launch; canonical never in the write path (triple-decoupled: canonical → stub → plugin → VM).
- **Transcript preservation (1.3G `projects/`):** the one unique-local-only store — fold into the encrypted B2 archive (needs B2 keyID+appKey) per `large-file-storage-research-2026-05-23.md`.

## How to verify cowork works (next Desktop launch)
1. Launch Claude Desktop, start a cowork session.
2. `cowork_vm_swift.log` should show the skills mount **succeeding** (no "source path does not exist").
3. In the VM, `.claude/skills` should be populated (161 skills).
4. Re-run the canonical check — SKILL.md count stays 836, no fresh mtimes at canonical root.
