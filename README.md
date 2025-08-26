# Project

## Local development

- Node 20+
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start (Node server): `npm start`

## Deploying to Vercel

This repo is configured for Vercel:
- Static client output: `dist/public`
- Serverless API: `api/index.ts` (Express wrapped)
- Config: `vercel.json` (routes, headers, runtime)

Steps:
1. Push this repo to GitHub.
2. In Vercel, Import Project -> select repo.
3. Build command: `npm run build` (auto-detected)
4. Output directory: `dist/public` (auto from vercel.json)
5. Environment Variables (optional for auth):
   - `REPLIT_DOMAINS`
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `REPL_ID`
   - `ISSUER_URL` (optional, defaults to Replit OIDC)
6. Deploy. Static files are cached with immutable headers; HTML is no-cache.

Auto-redeploys: Every push to the default branch triggers a new Vercel deployment. Pull requests get Preview deployments.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs type-check and build on every push/PR with Node 20.