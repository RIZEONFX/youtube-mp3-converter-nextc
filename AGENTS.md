<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Architecture

Wavecut is an Indonesian-language, frontend-only Next.js App Router application. Netlify hosts the UI; an external Oracle Cloud API owns audio processing and files. Never add a local API route or proxy just to work around CORS; configure CORS upstream. Public build-time settings are documented in `.env.example`.

- `app/` holds the server-rendered shell, route, metadata, icons, and Tailwind/custom CSS tokens.
- `components/wizard/` owns step views, keyboard focus, and transitions. Keep wizard state in `lib/store.ts`; preserve metadata on retried jobs, and reset it on a new conversion.
- `hooks/` owns TanStack Query cache keys, mutations, and polling. Stop automatic polling at terminal statuses or after 10 minutes. Do not automatically retry job creation.
- `lib/api.ts` validates API responses and centralizes URL, timeout, and error handling. Download links are relative to the configured backend and receive their real attachment filename from the server.
- `components/ui/` contains shadcn/ui primitives; the app styles them in `app/globals.css`. Prefer meaningful names, `@/` imports, and Indonesian user-facing copy. Use accessible labels and preserve reduced-motion support.

Wizard data is intentionally in memory and cleared on refresh. Only theme preference persists locally. Next.js uses default output mode; Netlify provides the share image without an `og:image` tag in the app.
