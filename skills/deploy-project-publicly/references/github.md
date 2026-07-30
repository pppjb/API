# GitHub Workflow

## Prepare

1. Resolve the intended project directory to an absolute path. List its immediate files and inspect parent directories for `.git`.
2. Run `git rev-parse --show-toplevel` when Git is already active. If it resolves to a parent workspace and this project needs a separate remote, initialize a repository only in the exact project directory.
3. Initialize with the intended default branch, normally `git init -b main`, only after the project boundary is confirmed. Immediately verify the new repository root.
4. Inspect `git status`, remotes, active branch, and recent commits.
5. Create or review `.gitignore` before staging. Choose exclusions from the actual stack and include, when applicable: `.env*` except explicit templates, dependency directories, build and coverage output, logs, caches, IDE metadata, OS metadata, local databases, uploads, and temporary files.
6. Use `git check-ignore -v` on representative excluded files when they exist.
7. Run a focused sensitive-data scan before staging. Search filenames and contents, but never print discovered secret values.
8. Review untracked files and large binaries. Ask before committing datasets or binary assets whose purpose is unclear.

## Commit

1. Show the files that will be staged.
2. Stage only project files. Never use a parent workspace as the staging root.
3. Inspect `git diff --cached --stat` and `git diff --cached` before committing. If a staged secret, runtime database, upload, log, cache, or unrelated file appears, unstage it and fix `.gitignore`.
4. Create a clear initial or incremental commit.
5. Do not amend unrelated user commits.

## Connect And Push

1. Verify the exact remote URL supplied by the user.
2. Add `origin` only when absent; do not replace it silently.
3. Inspect whether the remote already has commits before the first push.
4. Push the intended branch and set upstream tracking.
5. If Git reports dubious ownership on Windows, explain the repository trust check and have the user add only the exact repository path to `safe.directory`. Do not configure broad wildcard trust.
6. If authentication is required, use the operating system or GitHub browser flow. Never ask the user to paste a token into chat.

## Final Checks

- Confirm the branch exists on GitHub.
- Confirm sensitive and generated files are absent.
- Provide the public repository URL.
