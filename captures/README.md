# `captures/`

Raw diagnostic data the reports and inquiry were derived from.

- **`captures/<capture-id>/`** — curated, text-only captures that are small and
  worth keeping under version control (e.g. a Claude diagnostic export's `.txt`
  manifest set). These are tracked.
- **`captures/raw/`** — the **gitignored** landing zone for blobs: heapsnapshots,
  `sysdiagnose` trees, netlogs, `.zip` archives, web/console logs. Drop raw exports
  here. Nothing in `raw/` is tracked; it exists only so the repo root stays clean.

If a capture is large, binary, or regenerable, it belongs in `raw/`. If it is small,
textual, and evidentiary, give it its own `captures/<capture-id>/` directory.
