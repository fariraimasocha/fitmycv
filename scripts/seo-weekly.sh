#!/bin/zsh
# Weekly SEO run. launchd starts it every Monday (~/Library/LaunchAgents/link.fitmycv.seo-weekly.plist).
# Works in a throwaway worktree from origin/main, so your checkout is never touched.
set -euo pipefail
export PATH="/opt/homebrew/bin:$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin"

REPO="${0:A:h:h}"
DATE=$(date +%Y-%m-%d)
WT="/tmp/fitmycv-seo-$DATE"

cd "$REPO"
git fetch -q origin main
git worktree remove --force "$WT" 2>/dev/null || true
git worktree add -q --detach "$WT" origin/main
trap 'cd "$REPO" && git worktree remove --force "$WT"' EXIT

cp .env gsc-key.json "$WT/"
cd "$WT"
pnpm install --frozen-lockfile --prefer-offline --silent

claude -p "/seo-weekly" \
  --permission-mode acceptEdits \
  --allowedTools "mcp__posthog__exec Read Edit Write Glob Grep Skill Bash(pnpm:*) Bash(node:*) Bash(git:*) Bash(gh pr:*) Bash(ls:*) Bash(date:*)"
