Deploy to Vercel (All-in-one, Serverless API + Frontend)

This repository now includes serverless API routes under `/api/*` suitable for Vercel.

What to configure in Vercel dashboard:
- Environment Variables (Project > Settings > Environment Variables):
  - DATABASE_URL (preferred) or DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT
  - DB_SSL = 'true' (if your provider requires SSL)
  - JWT_SECRET = <strong secret>

How Vercel will serve this project:
- Static files (frontend) are the `public/` folder.
- API routes are the files under `api/` (e.g. `api/clientes/index.js`, `api/clientes/[id].js`, `api/auth/login.js`).

Quick steps:
1) Push this repo to GitHub.
2) Import project into Vercel and connect to the repo.
3) In Vercel dashboard set the Environment Variables listed above.
4) Deploy — Vercel will detect the Node serverless functions in `api/` and build the static site from `public/`.

Notes & caveats:
- Serverless functions are ephemeral. Use DATABASE_URL and consider a serverless-friendly Postgres provider (Neon, Supabase, or configure PgBouncer).
- The app uses JWT and stores tokens in localStorage; consider switching to HttpOnly cookies for added security.
- Update `JWT_SECRET` in Vercel to avoid using the default value in code.

If you want, I can:
- Convert the hardcoded users to a `users` table and provide SQL + migration code.
- Add a Vercel `vercel.json` config to customize routes or build steps.

