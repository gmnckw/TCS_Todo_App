#!/bin/bash
# Exit 0 with a JSON "deny" decision so Claude gets a structured reason.
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS=('rm -rf /' 'rm -rf ~' 'git push --force' 'git reset --hard' 'DROP DATABASE' 'DROP TABLE' 'TRUNCATE')

COMMAND_LC=$(printf '%s' "$COMMAND" | tr '[:upper:]' '[:lower:]')

for pattern in "${DANGEROUS[@]}"; do
  pattern_lc=$(printf '%s' "$pattern" | tr '[:upper:]' '[:lower:]')
  if [[ "$COMMAND_LC" == *"$pattern_lc"* ]]; then
    jq -n --arg p "$pattern" '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: ("Blocked by project hook: command matches \($p). Ask the user to run it manually if genuinely required.")
      }
    }'
    exit 0
  fi
done
exit 0