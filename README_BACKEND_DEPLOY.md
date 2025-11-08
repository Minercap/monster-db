Deploy backend (Render example) and frontend (Vercel)

Overview
- Backend: Node Express app listening on process.env.PORT (default 3000). Use a provider like Render, Railway, or Heroku.
- Frontend: static `public/` folder — deploy to Vercel.

Backend (Render) - Quick steps
1) Create an account on Render and create a new Web Service.
2) Connect your GitHub repository (push the code first).
3) In the Render service settings set:
   - Build Command: npm install
   - Start Command: npm start
4) Environment variables (add to Render):
   - DATABASE_URL = postgres://user:pass@host:port/dbname  (or DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT)
   - JWT_SECRET = <a strong secret>
   - DB_SSL = 'true' (if required)
5) Deploy: Render will build and run the service. Note the public URL (e.g., https://mi-backend.onrender.com)

Frontend (Vercel) - Quick steps
1) Go to vercel.com and import your GitHub repo.
2) Vercel will detect static site & API; configure Environment Variables if you want the frontend to know the backend URL at build time:
   - NEXT_PUBLIC_API_URL = https://mi-backend.onrender.com (optional)
3) Deploy. Your site will be available at https://<project>.vercel.app

Notes
- If you prefer, you can deploy backend on Railway/Heroku; the important parts are env vars and `npm start` as the startup command.
- Ensure DB allows connections from your provider (some providers allow adding IP allowlist; prefer managed DBs like Neon/Supabase for serverless compatibility).

PowerShell commands (local preparation)
```powershell
# initialize git repo and push (run from project root)
git init
git add .
git commit -m "prepare for deploy"
# create remote on GitHub via web, then:
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```

If you want, I can:
- Prepare a sample `.github/workflows` CI that deploys to Render or runs basic tests.
- Help you create the database on a provider and generate the DATABASE_URL.
