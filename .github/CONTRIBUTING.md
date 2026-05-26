# Contributing to `_diagnostics`

A private, single-maintainer repository. These conventions keep it coherent and
machine-checkable.

## Before you commit

- Run the standard check: `bash tools/standards-lint.sh` — exit `0` is required, and
  CI enforces it on every push.
- Follow [`docs/repository-standards.md`](../docs/repository-standards.md): minimal
  root, `kebab-case`, date-prefixed assessments, no capture blobs in git.
- Never commit secrets or raw capture blobs — see [`SECURITY.md`](SECURITY.md).

## Branch model

| Branch | Role |
|---|---|
| `main` | Stable. Changes arrive only via pull request. |
| `develop` | Integration branch — day-to-day work merges here first. |
| `feature/<slug>` | New work, branched from `develop`. |
| `fix/<slug>` | Bug fixes, branched from `develop`. |

Routine PRs target `develop`. Periodic `develop` → `main` PRs cut a stable point;
`main` also takes direct hotfix PRs when warranted.

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/): `feat:` `fix:`
  `docs:` `chore:` `refactor:` `test:`.
- Imperative mood, subject < 72 chars. Atomic and focused.

## Pull requests

- Fill in the PR template.
- Ensure the `standards` check is green before merging.
