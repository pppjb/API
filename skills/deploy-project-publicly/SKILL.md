---
name: deploy-project-publicly
description: Prepare a local Node.js API, HTML/CSS/JavaScript site, restaurant website, or similar small project for public sharing; safely publish source code to GitHub; deploy it to Render as either a Static Site or Web Service; and verify the resulting public URL. Use when the user asks to upload project code or selected data to GitHub, put a project online, create a resume/demo URL, repeat the GitHub-and-Render workflow, or troubleshoot a related deployment.
---

# Deploy Project Publicly

Publish a project with a clean Git history and a verified public URL. Keep the user informed in beginner-friendly language and perform all non-account actions autonomously.

## Workflow

1. Resolve the exact project root before touching Git. Inspect parent directories for an existing `.git`, confirm which files belong to the requested project, and never initialize at a broad workspace or parent directory by accident.
2. Inspect the framework, start/build commands, tests, existing Git state, and local instructions such as `AGENTS.md`.
3. Classify the project:
   - Choose a Render **Static Site** for HTML/CSS/client-side JavaScript that does not run a server.
   - Choose a Render **Web Service** for Node.js APIs, server-rendered apps, or any project that listens on a port.
4. Create or update `.gitignore` before the first `git add`. Audit `.env*`, tokens, passwords, private keys, credentials, personal information, generated output, dependencies, databases, uploads, logs, caches, editor files, and large binaries. Never commit secrets or private/user-generated data.
5. Initialize Git only inside the confirmed project root when the project does not already have its own repository. Re-check `git rev-parse --show-toplevel` immediately after initialization.
6. Make the smallest deployment changes needed. Preserve existing project patterns and user changes.
7. Run the repository's required tests or build. Follow local instructions exactly.
8. Prepare and publish Git history by following [GitHub workflow](references/github.md).
9. Guide the user through account login or authorization only when required. Never request passwords, OTPs, access tokens, or recovery codes in chat.
10. Deploy by following [Render workflow](references/render.md).
11. Verify the public root URL and at least one meaningful route. For APIs, verify the health and primary collection routes. For sites, verify the landing page and critical assets.
12. Return the public URL, GitHub source URL, verification result, free-tier limitations, and any persistence limitations.

## Deployment Requirements

For a Node.js Web Service:

- Read `PORT` from the environment.
- Listen on `0.0.0.0` in hosted environments.
- Provide a stable start command in `package.json`.
- Add a lightweight health endpoint when practical.
- Do not hard-code production secrets or URLs.

For a Static Site:

- Confirm the publish directory contains `index.html`.
- Use relative or deploy-safe asset paths.
- Set the build command to blank when no build is needed.
- Test navigation and asset loading from the publish directory.

## Data Policy

Distinguish source/demo data from runtime data:

- Commit small, clearly fictional seed or sample data when it is part of the project and contains no sensitive information.
- Do not commit production databases, customer records, form submissions, uploaded files, logs, session data, or local runtime state.
- Explain that in-memory data disappears when a free Web Service restarts or sleeps. Add persistent storage only when the user asks and understands the hosting tradeoff.
- If persistent data is needed, prefer a managed database and migrations or seed scripts rather than committing a live database file.

## Safety And Handoff

- Ask before adding production dependencies.
- Do not overwrite an existing remote or force-push without explicit approval.
- If the remote repository is not empty, inspect and reconcile histories before pushing.
- Treat deployment creation, GitHub App installation, and OAuth authorization as external side effects. Explain the scope and let the user complete authentication or approve the final action when required.
- On a free Render plan, warn that the first request after inactivity can take tens of seconds. Do not describe this as URL expiration.
- Never claim success until the deployed URL returns the expected content.
