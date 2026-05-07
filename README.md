# eVisa

Online visa application platform — React + Vite frontend, Express + Prisma + PostgreSQL backend.

## Local development

**Backend** (`server/`):
```bash
cd server
cp .env.example .env          # edit DATABASE_URL etc.
npm install
npx prisma migrate dev
npm run db:seed
npm run dev                   # http://localhost:4000
```

**Frontend** (root):
```bash
npm install
npm run dev                   # http://localhost:5173
```

## Deploy

### Backend → Render (free tier)
1. Push this repo to GitHub.
2. https://dashboard.render.com/blueprints → **New Blueprint** → pick this repo.
3. Render reads [`render.yaml`](render.yaml) and creates an `evisa-api` web service + `evisa-db` Postgres. It will prompt you for these env vars (others auto-generated):
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `GOOGLE_CLIENT_ID` (optional)
   - `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET` (sandbox or live)
4. After first deploy succeeds, open the **Shell** tab and run **one** of:
   - `npm run db:seed:prod` — admin user + countries + service tiers (recommended for production)
   - `npm run db:seed` — also includes 8 demo customers and 9 sample orders (good for showcasing the UI)
5. Copy your service URL (e.g. `https://evisa-api.onrender.com`).

Alternative: backend has a [`Dockerfile`](server/Dockerfile) that runs anywhere (Fly, Railway, Cloud Run, …).

### Frontend → GitHub Pages
The static frontend reads its API URL from `VITE_API_URL` **at build time**, so it must be set before `npm run build`.

```bash
cp .env.production.example .env.production
# edit .env.production:
#   VITE_API_URL=https://evisa-api.onrender.com
#   VITE_PAYPAL_CLIENT_ID=...

npm run deploy                # builds + pushes dist/ to gh-pages branch
```

The site lives at `https://lehoainhan.github.io/app/`.

> ⚠️ If you see "Network Error" on the deployed site, you likely forgot to set `VITE_API_URL` before building — the bundle then falls back to `http://localhost:4000`, which the visitor's browser can't reach.

## Adding real data

Once deployed, log in as admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) and use these tabs in the admin dashboard:

- **🌍 Countries** — add, edit, hide destinations. Anything you add appears immediately on `/destinations` and `/pricing`.
- **💰 Service tiers** — set the fee for normal/fast/express processing.
- **📋 Orders** — review, approve, reject, send manual messages, export CSV.

Customer accounts are created automatically when someone signs in with Google. Orders flow in from the public application form.

If you ran `db:seed:prod` (admin + catalog only) the database starts clean with no fake users or orders.

## Project layout

```
app/
├── src/                  React + Vite frontend (deployed on GitHub Pages)
├── public/               sitemap.xml, robots.txt, 404.html
├── server/               Express + Prisma backend (deploy separately)
│   ├── prisma/schema.prisma
│   ├── src/routes/       auth, orders, payments (PayPal), support, admin, …
│   └── Dockerfile
├── render.yaml           one-click Render deploy
└── .env.production.example
```
