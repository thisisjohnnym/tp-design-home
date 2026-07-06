---
name: run-dev-servers
description: >-
  Start and verify local dev servers for design-team-landing-page. Use when the
  user asks to run, start, or restart the dev server, preview the site locally,
  open localhost, or work on the app in the browser.
---

# Run Dev Servers

## Project

Next.js 15 app at the repo root. One dev server on port **3000**.

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server with Turbopack + hot reload |
| `npm run build && npm run start` | Production preview (no hot reload) |
| `npm install` | Install deps (run once if `node_modules` is missing) |

Local URL: **http://localhost:3000**

## Before starting

1. **Check existing terminals** in the project's `terminals/` folder for an already-running `npm run dev` in this repo.
2. If one is running and healthy (shows `Local: http://localhost:3000`), **do not start another**. Tell the user the URL and which terminal is serving it, then **open the browser** (see below).
3. If `node_modules` is missing, run `npm install` first and wait for it to finish.

## Start dev server

From the repo root:

```bash
npm run dev
```

1. Run in a **background shell** (`block_until_ms: 0`).
2. Poll the terminal output until you see `Local: http://localhost:3000` or `Ready`, or until a clear error appears.
3. **Open the browser** to the local URL (see below).
4. Confirm to the user: URL, that hot reload is active, that the browser was opened, and any startup warnings worth noting.

Title the shell command: `Dev server: design-team-landing-page`.

## Open in browser

After the server is ready (or when reusing an already-running server), open **http://localhost:3000** automatically.

Skip auto-open only if the user explicitly asks not to (e.g. "don't open the browser").

**Preferred:** `open_resource` MCP (`cursor-app-control`) with the URL — respects the Glass browser setting.

**Fallback (macOS):**

```bash
open http://localhost:3000
```

On Linux use `xdg-open`; on Windows use `start`.

Do not open before the server responds — wait for readiness first.

## Port already in use

If startup fails with `EADDRINUSE` on port 3000:

1. Check terminals again — another dev instance is likely already running.
2. If found, share **http://localhost:3000**, **open the browser**, and skip starting a duplicate.
3. Only kill the process on port 3000 if the user **explicitly** asks to restart or stop the server.

To find what holds the port (macOS):

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

## Production preview

Use when the user wants to test a production build, not while actively editing UI.

1. Stop any running dev server first (both use port 3000).
2. Run sequentially:

```bash
npm run build && npm run start
```

3. Poll until the server is listening, **open the browser**, then share **http://localhost:3000**.

Remind the user: code changes need a new `npm run build` before they appear in this mode.

## Restart

When the user asks to restart:

1. Stop the existing background dev shell (or kill the PID from `lsof`).
2. Wait until port 3000 is free.
3. Start `npm run dev` again using the workflow above (including browser auto-open).

## After starting

When continuing UI or code work, assume the dev server stays running in the background unless the user asks to stop it.
