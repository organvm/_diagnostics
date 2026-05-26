# Security & capture hygiene

This repository stores machine-diagnostic data. Diagnostics inherently touch
sensitive state — filesystem paths, process lists, network configuration, and
tokens that appear in logs. These rules keep that exposure out of version control.

## Never commit

- **Secrets** — credentials, API keys, tokens — in any file. A pre-commit secret
  scanner blocks these. Do not bypass it without verifying a false positive; only
  then annotate the specific line with `allow-secret`, after confirming there is no
  real credential.
- **Raw diagnostic captures** — heapsnapshots, `sysdiagnose` trees, netlogs,
  console/web logs, pcaps. These belong in `captures/raw/`, which is gitignored.

## Before archiving captures off-host

`bin/archive-snapshot` encrypts client-side before upload. Even so, **redact or
rotate** any real credential in a capture before snapshotting — encryption protects
data at rest, not against a leaked key.

## Curated captures

Only small, textual, evidentiary captures belong under version control, at
`captures/<capture-id>/`. Scrub them before committing.

## Reporting

Private repo, single maintainer. On any accidental secret exposure: rotate the
credential immediately, and rewrite history if it was already pushed.
