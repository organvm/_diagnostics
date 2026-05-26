---
name: Diagnostic finding
about: Record something sysdiag / memdiag surfaced that needs action
title: "[finding] "
labels: finding
---

## Signal

<!-- which domain + the headline metric, e.g. "disk 86% △" or "bztransmit >80% CPU" -->

## Trust / stratification

<!-- is this the trustworthy headline metric, or a noisy secondary (swap %, vm_stat free)? -->

## Localized vs cumulative

<!-- does one process dominate, or is it cumulative co-residency (no single PID is "the bug")? -->

## Reconciliation

<!-- snapshot ids compared and the delta — the delta is the finding -->

## Action / close

<!-- the loop-forward: fix the base, or a behavioral mitigation. Never a terminal report. -->
