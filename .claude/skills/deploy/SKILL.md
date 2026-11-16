---
name: deploy
description: Deploy the app to staging. Runs all tests, builds the production bundle, and pushes to the staging branch. Use when the user asks to deploy, ship, or release to staging.
disable-model-invocation: true
allowed-tools: Bash(npm test:*), Bash(npm run lint:*), Bash(npm run build:*), Bash(git status:*), Bash(git fetch:*), Bash(git log:*), Bash(git push:*)
---

# Deploy to staging

Deploy the current `HEAD` to staging. Stop on the first failure, report the failing output, and do not go on to the next step.

## 1. Pre-flight checks

- Run `git status --porcelain`. If the working tree has uncommitted changes, stop and ask the user to commit or stash them. A deploy must match a commit.
- Run `node --version`. Vite 7 needs Node 20.19+ or 22.12+. If it is older, stop and tell the user.

## 2. Run all tests

- If `package.json` has a `test` script, run `npm test`. On Vitest/Jest, run it non-interactively (for example `npm test -- --run` for Vitest) so it does not wait in watch mode.
- Always run `npm run lint` as well.
- If there is no `test` script, tell the user that no tests exist yet and that only lint was checked. Do not claim tests passed.
- If any test or lint error fails, stop here and show the failures.

## 3. Build the production bundle

- Run `npm run build`.
- Confirm that `dist/` was produced and has an `index.html`. If the build fails or `dist/` is missing, stop and show the error.

## 4. Push to staging

- Staging is the `staging` branch on the `origin` remote.
- Show the user what will be pushed: the current branch, the commit (`git log -1 --oneline`), and the target `origin/staging`. Ask them to confirm before pushing.
- After confirmation, run `git push origin HEAD:staging`.
- Never use `--force`. If the push is rejected (non-fast-forward, permissions, missing remote), stop and report the error. Do not try to work around it.

## 5. Report

Summarize briefly:
- Tests: passed / no tests found (lint only) / failed
- Build: success, with the bundle size from the Vite output
- Push: commit hash pushed to `origin/staging`, or why it did not happen
