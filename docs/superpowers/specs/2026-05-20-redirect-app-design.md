# Redirect App — Design Spec

**Date:** 2026-05-20

## Overview

A NestJS application with a single public endpoint that accepts a URL via query parameter and redirects the client to it. Deployed on Vercel as a Serverless Function using `@vercel/node`.

## Endpoint

```
GET /redirect?url=<target-url>
→ HTTP 302, Location: <target-url>
```

- No URL validation — any value passed in `url` is used as-is.
- No authentication.

## Architecture

Standard NestJS project with one module. Vercel runs it via a serverless wrapper:

- `api/index.ts` — exports a Vercel-compatible handler that bootstraps the Nest app and delegates requests to it.
- `vercel.json` — routes all incoming traffic to `api/index.ts`.
- `src/main.ts` — standard Nest bootstrap for local development (`npm run start:dev`).

## File Structure

```
src/
  app.module.ts        — root module, imports AppController
  app.controller.ts    — GET /redirect handler
  main.ts              — local dev entry point
api/
  index.ts             — Vercel serverless handler
vercel.json            — routes all requests to api/index
package.json
tsconfig.json
```

## Key Implementation Details

- **Framework:** NestJS with default Express adapter.
- **Vercel adapter:** `@vercel/node` — wraps the Express instance as a serverless function.
- **Redirect status:** 302 (temporary) — browsers won't cache, easy to migrate to a custom domain later.
- **Controller:** uses `@Res() res: Response` and calls `res.redirect(302, url)` where `url = @Query('url')`.

## Local Development

```bash
npm run start:dev
# GET http://localhost:3000/redirect?url=https://example.com
```

## Deployment

```bash
npx vercel deploy
```

Vercel auto-assigns a `*.vercel.app` domain. Custom domain can be added later via Vercel dashboard.
