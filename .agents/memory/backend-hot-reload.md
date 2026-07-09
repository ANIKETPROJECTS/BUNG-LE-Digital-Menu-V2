---
name: Backend hot-reload behavior
description: tsx server does NOT auto-restart on file changes; manual workflow restart required for backend code changes to take effect.
---

## Rule
After editing any `server/` TypeScript file, the "Start application" workflow must be manually restarted for changes to take effect.

**Why:** `npm run dev` runs `NODE_ENV=development tsx server/index.ts` — plain `tsx` without `--watch`. Vite HMR handles frontend (`client/src/`) changes automatically, but backend changes are invisible to Vite. The Express server keeps serving the old compiled code until the process is restarted.

**How to apply:** Whenever a backend edit (routes, storage, middleware) doesn't seem to take effect despite looking correct, restart the workflow before investigating further. Symptoms of stale server: console.log added to a route never appears, new routes return 404/HTML, schema changes don't reflect at runtime.
