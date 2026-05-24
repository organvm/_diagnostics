# 72-Hour Cross-Agent Session Review — Synthesis

**Window:** 2026-05-20 20:00 → 2026-05-23 20:00 (local) · **Generated:** 2026-05-23
**Companion:** `session-review-72h-2026-05-23-raw.md` (every session, per-agent, with first real prompt)
**Method:** direct extraction from each agent's session store (Codex jsonl, OpenCode sqlite, Gemini jsonl, Claude Code jsonl). Explore subagents not used — they confabulate a "text-only" constraint on cold-start (documented bug).

## Raw artifacts → distinct logical sessions

| Agent | Raw artifacts | Distinct logical sessions | What inflates the raw count |
|---|---|---|---|
| **Claude Code** | 109 | ~55–60 | compact-continuations of the same thread; background-job children; command-only stubs (`/closeout`, `/debug`) |
| **Codex** | 63 | **~8** | **two fan-out batches**: 05-21T18:06 `019e4c93` spawned **54 children** (replayed the day's whole prompt corpus); 05-22T05:42 `019e4f1x` spawned **5** (domus parity audit) |
| **Gemini** | 34 | **4 human** | **30 are automated `a2a-server` sessions** with no human prompt (agent-to-agent server churn) |
| **OpenCode** | 23 (parents) | 23 | child subagent sessions already excluded |
| **Total** | **229** | **~90** | |

## Cross-agent workstreams (the real structure)

The 72h splits into ~7 workstreams, several spanning multiple agents:

### 1. System diagnostics / performance / health  ← *the active throughline*
- **OpenCode:** `ses_1b234f61` "diagnostic system wide review" (05-21 23:46); `ses_1a987299` the sysdiagnose **REPORT.md** forensic (05-23 16:13); `ses_1a9e58ca` "report all disturbances: brewup" (05-23 14:30); `ses_1b49712f` npm debug-log review; `ses_1b45be05` npm audit fix across 11 projects; `ses_1b2fab86` claude-versions review; `ses_1b23d022` Dock killall.
- **Claude:** `9a8a5589` "Execute forensic audit per .bg-audit-brief.md" (05-22 03:49); `e922224d` "brewup > errors; debug" (05-22 13:30); `d06b537e` "the disaster that is /private /bin /opt /usr; packages, shells" (05-22 19:25); `79665c40`+`5b55b159` the perf-audit goal (05-23 19:09/19:34); **this session `18240952`** (05-23 19:57).
- **Codex:** `019e4c8b` "review `~/Library/Application Support/Claude`" (05-21 17:57); brewup/`brew doctor` prompts inside the fan-out.
- **Verdict:** the forensic audit (OpenCode REPORT.md, 10 FINDs) is the canonical output; Claude + this session continue it. Acute claims in that report (87% swap, kill-list PIDs) are **already stale** — see the debug-plan reconciliation.

### 2. Terminal / shell / config (kitty · ghostty · warp · XDG)
- **Claude:** kitty config investigation (`ab818a73`, `917a0f5b`, `b2ff7279`); "powerup ghostty to full power" (`9a9cfcdd`); warp settings compare (`d85f9fc8`); recurring "config → ~/.config XDG" prompt (`10b96878`, `d6b123b4`, `8937a3a8` — appears ~6× = a relay/fan-out).
- **Codex:** `019e46ed` slash-command-as-agent-summon design (05-20); ghostty settings inside the fan-out.

### 3. Session management / closeout / hall-monitor / cross-agent handoff  ← *largest meta-overhead*
- **Claude:** many `/closeout`; **hall-monitor "double check all work" ran ~6×** (`da61bcc9`, `f7e580d0`, `da158d99`, `7c167e17`, `2efbf641`, `b12c3c81`); `/session-lifecycle-patterns`; nudger of open threads (`892ddafc`); teleport-spawn forensics ("what was the prompt to spawn this session" `91b6daaf`).
- **Codex:** the 54-child fan-out `019e4c93` is itself a `/session-lifecycle-patterns codex,gemini,opencode` orchestration.
- **Finding:** heavy redundant session bookkeeping — the hall-monitor passes re-discovered overlapping facts (a known IRF-OPS candidate: no shared audit register).

### 4. Skills / plugins infrastructure  ← *directly feeds the cowork task*
- **Claude:** `6b0296ea` "skills are missing again............." (05-22 21:30); `52d2e6f7` skill-workstream "this repo is trouble; plugins/skills/tools infra… need to be brought together" (05-22 22:46); `0a347f8f` skills-marketplace-unification handoff (05-22 23:19).
- **Connection:** the recurring "skills missing" pain is the same subsystem behind the cowork-vm mount work in the active debug plan.

### 5. Intake / memory export-import  ← *same task across 3 agents*
- **Gemini:** `5b147219` "Export all of my stored memories…" (05-23 08:53).
- **OpenCode:** `ses_1ac21cc9` + `ses_1abd2878` chatgpt-export memory matching (05-23).
- **Claude:** `cf6df3ea` intake 1Password+chatgpt (05-22 02:37); `34183e4f` "import context from one AI assistant to another" (05-23 16:09).

### 6. Git parity / governance audits
- **OpenCode:** "Audit git parity for this lane" ×4 (`~/Code`, 05-22); hall-monitor recovery routing (`ses_1ad6220d`, `ses_1ad61b5b` — INDEX.md regenerator hunt).
- **Codex:** the 5-child domus/chezmoi parity audit batch (05-22 05:42, read-only).

### 7. Generative-abstract-environments / Antigravity IDE
- **Claude:** `8d948d76` review Antigravity-ide sessions/artifacts; worktree sessions under `generative-abstract-environments-studies`.
- **Gemini:** `19ddda11` antigravity vscode-resource debugging (05-22 00:36).

## Findings surfaced *by the review itself*

1. **Gemini is 88% automated churn.** 30 of 34 Gemini sessions are `a2a-server/main` with no human turn — an agent-to-agent server respawning across slugs (`bound`, `agent`, `project`, `claude-1`, `generative-…`). Paired with the 05-21 "address mcp issues" session and repeated "MCP issues detected" info events, this points to **Gemini MCP / a2a-server instability** generating process + session churn — a plausible contributor to the process-bloat finding in the perf audit.
2. **Two Codex fan-out batches account for 59 of 63 rollouts.** The "571 total Codex rollouts" volume is dominated by orchestrated multi-agent replays, not 571 distinct human tasks.
3. **Session-management is the single largest Claude workstream** — more sessions spent on closeout/hall-monitor/handoff bookkeeping than on any single substantive build. The hall-monitor double-check ran ~6× with documented redundancy.
4. **The diagnostics thread is continuous and multi-agent** (OpenCode forensic → Claude debugs → this session) — it is the spine of the 72h, consistent with the user's "review re: system-diagnostics, health, packages, logs" intent.
5. **Recurring relayed prompts** (the "config → XDG" block, the "double check all work" block, "Read-only audit task for domus parity") appear verbatim across agents — evidence of the cross-agent relay/fan-out pattern working as designed.

## Pointers
- Per-session detail (every row, first real prompt, session ID): `session-review-72h-2026-05-23-raw.md`
- Canonical perf forensic: `sysdiagnose-2026-05-21/REPORT.md` (+ 10 FIND files) — acute numbers stale per `~/.claude/plans/debug-claude-desktop-and-zesty-scroll.md`.
