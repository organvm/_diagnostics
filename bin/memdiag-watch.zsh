# memdiag-watch.zsh — opt-in, NON-RESIDENT memory-pressure nudge.
#
# This is the "middle path" between a manual snapshot and a forbidden daemon
# (Rule #9). It hooks zsh's precmd, which runs once per prompt render — i.e.
# only when YOU press enter. It spawns nothing that outlives that instant; there
# is no LaunchAgent, no background loop, no resident process.
#
# Each render it samples `memory_pressure` once (sub-millisecond) and prints a
# one-line nudge ONLY if free% has crossed below the threshold. Healthy = silent.
#
# Install (opt-in): add to ~/.zshrc
#     source ~/.local/bin/memdiag-watch.zsh
# Tune the threshold (default 25):
#     export MEMDIAG_WATCH_THRESHOLD=20
# Disable for the current shell:
#     add-zsh-hook -d precmd _memdiag_watch_precmd

autoload -Uz add-zsh-hook 2>/dev/null

_memdiag_watch_precmd() {
  local thresh="${MEMDIAG_WATCH_THRESHOLD:-25}"
  # Throttle: at most once per 60s, so a fast prompt loop never spams.
  local now=$EPOCHSECONDS
  if [[ -n "${_MEMDIAG_LAST:-}" ]] && (( now - _MEMDIAG_LAST < 60 )); then
    return 0
  fi
  local free
  free="$(memory_pressure 2>/dev/null | awk -F': ' '/free percentage/{gsub(/[^0-9]/,"",$2); print $2+0}')"
  [[ -z "$free" ]] && return 0
  if (( free < thresh )); then
    print -P "%F{yellow}⚠ memory free ${free}%% (< ${thresh}%%) — \`memdiag snap\` to freeze this episode%f"
    _MEMDIAG_LAST=$now
  fi
}

# EPOCHSECONDS needs zsh/datetime; load it if absent.
zmodload zsh/datetime 2>/dev/null
add-zsh-hook precmd _memdiag_watch_precmd 2>/dev/null
