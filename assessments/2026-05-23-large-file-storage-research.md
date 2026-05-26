# Large-File Remote Storage — Research & Recommendation

**Date:** 2026-05-23 · **Context:** preservation/reboot — the large unique files can't go in plain git (GitHub 100 MB/file cap, the data-exfiltration block, secret-scanner). Need a durable, **encrypted**, reboot-friendly remote method.

## The data to store (classed by need)
| Class | Files | Size | Needs |
|---|---|---|---|
| **Sensitive + regenerating** | `prompt-atoms.json` | 70 MB | client-side **encryption**; dedup (regenerates periodically) |
| **Sensitive + static** | intake clipboard exports, voice-governance plans | ~3 MB | **redact/rotate secrets first** (flagged: probable `aws_access_key_id`), then encrypt |
| **Bulk re-exportable** | ChatGPT history/export | ~1 GB | low priority — re-exportable from ChatGPT; Backblaze Computer Backup likely already covers |
| **Regenerable binaries** | heap snapshots (350 MB), sysdiagnose extract (850 MB) | ~1.2 GB | **don't preserve** — regenerable; let age out |

Net: the data that actually *needs* a new method is small (~75 MB sensitive), with ~1 GB optional bulk. Cost at any provider is pennies/month.

## Options compared (current 2026 pricing/limits)
| Method | Encryption | Versioning/dedup | Cost | Fit |
|---|---|---|---|---|
| **Kopia → Backblaze B2** | client-side ✓ | snapshots + dedup + compression ✓ | B2 $0.006/GB‑mo, egress $0.01/GB (free via Cloudflare alliance) | **Best for sensitive+regenerating** — dedup means prompt-atoms re-snapshots are cheap |
| **restic → B2** | client-side ✓ | snapshots + dedup ✓ | same B2 | Equivalent; bigger community, CLI-only, simpler model, slightly faster base backup |
| **rclone crypt → B2/R2** | client-side ✓ | ✗ (sync, not versioned) | same | Simplest; good if you only want an encrypted mirror, no history |
| **Cloudflare R2** (as backend) | via the above tools | n/a | $0.015/GB‑mo, **zero egress** | Use as backend if frequent restores; pricier storage |
| **Git LFS (private repo)** | ✗ at rest (GitHub holds it) | git-versioned | 1 GB free, then metered (~$0.25/GB‑mo) | Only if you want the file *versioned alongside a repo*; grows per version; **not encrypted** → wrong for secrets |

## Recommendation: **Kopia → Backblaze B2, client-side encrypted**
**Why this fits you specifically:**
1. **Encryption is the unlock.** prompt-atoms + clipboard exports are private/secret-bearing — the exact reason plain-git push was hard-blocked as "data exfiltration." Client-side encryption (Kopia/restic encrypt *before* upload) means only opaque blobs land in your own B2 bucket → safe to store, and it's *your* account. (Still redact/rotate any real secret first — encryption protects at-rest, not against a key leak.)
2. **You already run Backblaze** — B2 is one product step away, familiar vendor, cheapest storage ($0.006/GB‑mo), and egress is free through Cloudflare (you have Cloudflare access) for the rare reboot-restore.
3. **Dedup/snapshots suit prompt-atoms**, which regenerates: Kopia stores only the delta each time, not a fresh 70 MB. You get point-in-time history for free.
4. **Reboot-friendly = canonical-off-local.** The Kopia repo in B2 *is* the canonical store; local is a disposable cache. Restore on a fresh machine with one `kopia restore`. This operationalizes your `REMOTE_IS_CANONICAL / CACHE_IS_DISPOSABLE` goal.

**restic** is an equally fine substitute (pick it for the larger ecosystem / simpler model); **rclone crypt** if you want a plain encrypted mirror with no history.

## Setup runbook (you run — needs your Backblaze + key material)
```bash
brew install kopia                                  # or: brew install restic rclone
# 1. Backblaze: create a B2 bucket (e.g. 4jp-archive) + an application key (keyID + appKey)
# 2. Point Kopia at it (prompts for a repository password = your encryption key — store in 1Password):  # allow-secret (prose + placeholders, no real credential)
kopia repository create b2 --bucket=4jp-archive --key-id=<KEYID> --key=<APPKEY>
# 3. Snapshot the sensitive stores:
kopia snapshot create ~/Code/prompt-registry-archive        # the 70MB atoms (already staged)
kopia snapshot create ~/Code/intake                          # AFTER redacting the AWS key etc.
# 4. Verify + restore-test:
kopia snapshot list && kopia restore <snapshot-id> /tmp/restore-test
```
Make it repeatable as an **on-demand CLI** (`~/.local/bin/archive-snapshot`) invoked manually — **not a LaunchAgent** (Rule #9).

## Decisions for you
- **Provider:** B2 (recommended, cheapest/archive) vs R2 (zero-egress, if frequent restores).
- **Tool:** Kopia (UI+dedup, recommended) vs restic (community) vs rclone-crypt (simplest mirror).
- **Scope:** sensitive-only (~75 MB) vs also freeze the ~1 GB ChatGPT bulk.
- **Prereq:** redact/rotate the flagged secrets in intake before snapshotting that dir.

## Sources
- [GitHub Docs — Git LFS billing](https://docs.github.com/billing/managing-billing-for-git-large-file-storage/about-billing-for-git-large-file-storage) · [GitHub file size limits 2026](https://filesize.org/limits/github/)
- [Backblaze B2 pricing 2026](https://leanopstech.com/blog/backblaze-b2-pricing-2026/) · [Cloudflare R2 pricing 2026](https://leanopstech.com/blog/cloudflare-r2-pricing-2026/) · [R2 vs B2](https://themedev.net/blog/cloudflare-r2-vs-backblaze-b2/)
- [Backblaze — rclone with B2](https://www.backblaze.com/docs/cloud-storage-integrate-rclone-with-backblaze-b2) · [rclone B2 docs](https://rclone.org/b2/)
- [Kopia vs restic (selfhosting.sh)](https://selfhosting.sh/compare/kopia-vs-restic/) · [Borg vs restic vs Kopia benchmarked](https://computingforgeeks.com/borg-restic-kopia-comparison/)
