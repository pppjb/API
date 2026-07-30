# Render Workflow

## Select Service Type

| Project | Render service | Typical settings |
| --- | --- | --- |
| Plain HTML/CSS/JS | Static Site | Build command blank; publish directory `.` or the output directory |
| Bundled frontend | Static Site | Framework build command; publish directory such as `dist` or `build` |
| Node.js API/server | Web Service | Build/test command plus `npm start` |

Do not choose Static Site for an API. Do not choose Web Service for plain HTML unless server behavior is genuinely required.

## Web Service

1. Connect the exact GitHub repository and branch.
2. Select Node when applicable.
3. Leave Root Directory blank when the app is at repository root; otherwise use the precise subdirectory.
4. Use the repository's tested build and start commands.
5. Select the Free instance only when acceptable to the user.
6. Set only required non-secret environment variables in declarative config. Add secrets in the Render dashboard, never in Git.
7. Configure a health check route such as `/health`.
8. Deploy and inspect logs until the service reports that it is live.

## Static Site

1. Connect the exact GitHub repository and branch.
2. Use a blank build command for a plain HTML project.
3. Set Publish Directory to `.` when `index.html` is at repository root, or to the generated output directory for built frontends.
4. Add rewrite rules only when client-side routing requires them.
5. Deploy and verify that HTML, CSS, JavaScript, images, and navigation load from the public URL.

## Verification And Handoff

- Verify the root public URL from a non-authenticated request.
- For APIs, verify `/health`, one GET collection route, and a representative error response. Do not mutate production data merely to prove deployment unless the user authorizes it.
- For sites, verify the first viewport and at least one key interaction on desktop and mobile when browser tooling is available.
- Explain that signing out of GitHub or shutting down the local computer does not stop Render.
- Explain that free Web Services may sleep after inactivity and wake on the next request; the URL remains valid while the Render service exists.
- Explain whether data is persistent. In-memory data resets on restart or redeploy.
