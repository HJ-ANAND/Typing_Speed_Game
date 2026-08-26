# Typing Speed Game --- Deployment Guide

A full-stack typing speed game built with **Next.js**, **GraphQL**,
**Prisma**, and **PostgreSQL**.

## Recommended production architecture

``` text
Browser
   |
   v
Vercel
Next.js frontend
   |
   | GraphQL / HTTPS
   v
Render
GraphQL backend
   |
   v
Hosted PostgreSQL
```

The repository contains two applications:

``` text
typing_speed_game/
├── frontend/     # Next.js frontend
└── backend/      # GraphQL API + Prisma
```

------------------------------------------------------------------------

## 1. Pre-deployment checklist

Before deploying, verify:

-   Authentication works: register, login, logout.
-   Protected routes redirect unauthenticated users.
-   The game generates exactly 20 random alphabets.
-   A wrong key does not advance the current letter.
-   A correct key advances to the next letter.
-   Timer, wrong attempts, and penalty time work.
-   Completed games are saved through Prisma.
-   Game history works.
-   Personal best works.
-   Leaderboard works.
-   Test users/data that should not be public have been removed.
-   `.env` files and secrets are not committed.
-   There are no hardcoded `localhost` API URLs in production code.

Run your project checks locally using the scripts defined by your
`package.json` files. For example:

``` bash
cd frontend
bun run lint
bunx tsc --noEmit

cd ../backend
bunx tsc --noEmit
```

------------------------------------------------------------------------

## 2. Push the project to GitHub

From the project root:

``` bash
git status
git add .
git commit -m "Prepare project for deployment"
git push origin main
```

Make sure `.gitignore` excludes secret files such as:

``` text
.env
.env.local
.env.production
```

Never commit values such as:

``` text
DATABASE_URL=...
JWT_SECRET=...
```

------------------------------------------------------------------------

# 3. Create a production PostgreSQL database

Create a hosted PostgreSQL database using a provider such as:

-   Neon
-   Supabase
-   Render PostgreSQL
-   Railway PostgreSQL

Copy the production connection string. It will look approximately like:

``` text
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Keep this value private.

**Do not deploy your local development database.**

------------------------------------------------------------------------

# 4. Prepare Prisma

Your migration history must be committed:

``` text
backend/
└── prisma/
    ├── schema.prisma
    └── migrations/
```

Development uses:

``` bash
bunx prisma migrate dev
```

Production uses:

``` bash
bunx prisma migrate deploy
```

Do **not** use `prisma migrate dev` against the production database.

------------------------------------------------------------------------

# 5. Deploy the backend

Recommended platform: **Render**.

Create a new Web Service and connect the GitHub repository.

Because this is a monorepo, set:

``` text
Root Directory: backend
```

Use the production install/build/start commands appropriate for your
existing `package.json`.

A typical Bun/Prisma deployment sequence is:

``` bash
bun install
bunx prisma generate
bunx prisma migrate deploy
```

Your actual start command should be the production command already
defined by your backend. For example, if your project uses the server
entry directly:

``` bash
bun run src/server.ts
```

## Backend environment variables

In Render, add the variables required by your backend configuration.

At minimum, this commonly includes:

``` text
DATABASE_URL=your-production-postgresql-url
JWT_SECRET=your-production-secret
```

Also add any other variables your existing backend configuration
requires.

Do not put secrets in source code.

------------------------------------------------------------------------

# 6. Backend production port

Your backend must listen on the port provided by the hosting platform.

Prefer something equivalent to:

``` ts
const port = Number(process.env.PORT) || 4000;
```

This allows:

``` text
Local development -> 4000
Production        -> provider-assigned PORT
```

If the server currently hardcodes port `4000`, change that before
deployment.

------------------------------------------------------------------------

# 7. Test the deployed backend

After Render deploys, you will receive a URL similar to:

``` text
https://your-backend-name.onrender.com
```

Your GraphQL endpoint should be similar to:

``` text
https://your-backend-name.onrender.com/graphql
```

Test the endpoint with your GraphQL client.

For example:

``` graphql
query {
  health
}
```

Then test authentication and game queries/mutations against the
production database.

------------------------------------------------------------------------

# 8. Configure the frontend GraphQL URL

Your local frontend currently uses a localhost backend URL. Production
must use the deployed backend.

For example:

``` text
Local:
http://localhost:4000/graphql

Production:
https://your-backend-name.onrender.com/graphql
```

Find the GraphQL client configuration in the frontend and use an
environment variable instead of hardcoding the production URL.

For example:

``` env
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-name.onrender.com/graphql
```

Use the exact variable name already expected by your code.

Only values intentionally exposed to browser-side Next.js code should
use `NEXT_PUBLIC_`. Never expose secrets such as `JWT_SECRET` to the
browser.

------------------------------------------------------------------------

# 9. Deploy the frontend

Recommended platform: **Vercel**.

Import the GitHub repository into Vercel.

Because the repository contains both applications, set:

``` text
Root Directory: frontend
```

Vercel should detect Next.js automatically.

Add the frontend environment variable:

``` text
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend-name.onrender.com/graphql
```

Use the exact variable name expected by your project.

Deploy the application.

You should receive a URL similar to:

``` text
https://typing-speed-game.vercel.app
```

------------------------------------------------------------------------

# 10. Configure CORS

The deployed frontend and backend have different origins.

For example:

``` text
Frontend:
https://typing-speed-game.vercel.app

Backend:
https://typing-speed-game-api.onrender.com
```

Configure the backend CORS settings to allow the production frontend
origin.

You may also keep your local development origin:

``` text
http://localhost:3000
```

Avoid using a completely open `*` CORS policy for an authenticated
production application.

------------------------------------------------------------------------

# 11. Production JWT configuration

The backend must use a strong production JWT secret.

Example:

``` text
JWT_SECRET=<long-random-production-secret>
```

Do not:

-   commit it to GitHub
-   put it in frontend code
-   use a weak development secret

After deployment, test:

1.  Register.
2.  Login.
3.  Refresh.
4.  Open the game.
5.  Complete a game.
6.  Open dashboard.
7.  Open leaderboard.
8.  Logout.
9.  Try opening a protected page again.

------------------------------------------------------------------------

# 12. Production Prisma migrations

Production migrations should be applied with:

``` bash
bunx prisma migrate deploy
```

Prefer running this during the backend deployment/release process.

Do not change your local `.env` to point at production just to run
migrations unless you have a specific reason and understand the risk.

Make sure the migration directory is committed:

``` text
backend/prisma/migrations/
```

------------------------------------------------------------------------

# 13. Final production test

## Authentication

-   [ ] Register
-   [ ] Login
-   [ ] Invalid password
-   [ ] Logout
-   [ ] Protected route without authentication
-   [ ] Refresh while logged in

## Typing game

-   [ ] Exactly 20 letters are generated
-   [ ] One letter is displayed at a time
-   [ ] Correct key advances
-   [ ] Wrong key does not advance
-   [ ] Wrong attempts increase
-   [ ] Penalty increases
-   [ ] Timer works
-   [ ] Game finishes after 20 correct letters
-   [ ] Result is displayed
-   [ ] Result is saved

## Dashboard

-   [ ] User information appears
-   [ ] Personal best appears
-   [ ] Game history appears
-   [ ] Newly completed game appears
-   [ ] Start Game button works

## Leaderboard

-   [ ] Multiple users appear
-   [ ] Ranking is correct
-   [ ] Completion times are correct
-   [ ] Statistics are correct
-   [ ] Empty state works
-   [ ] Unauthenticated access is protected

## Multi-user test

Create two or more accounts and complete games with each.

Verify:

``` text
User A -> sees User A's history
User B -> sees User B's history
Leaderboard -> sees both users
```

------------------------------------------------------------------------

# 14. Common deployment problems

### `localhost:4000` appears in production

Search the frontend:

``` bash
grep -R "localhost:4000" frontend/
```

Replace hardcoded API URLs with the production environment variable.

### CORS error

Check:

1.  Backend CORS configuration.
2.  Exact Vercel production URL.
3.  Allowed origins.
4.  Backend redeployment after changing CORS.

### Prisma cannot connect

Check:

``` text
DATABASE_URL
```

Make sure it points to the production PostgreSQL database.

### Prisma tables do not exist

Run:

``` bash
bunx prisma migrate deploy
```

### Frontend shows a network/API error

Check the frontend GraphQL environment variable:

``` text
NEXT_PUBLIC_GRAPHQL_URL
```

Then verify that:

``` text
https://your-backend-url/graphql
```

is reachable.

After changing a Vercel environment variable, redeploy the frontend.

### Backend works locally but fails on Render

Check:

-   `PORT`
-   production start command
-   environment variables
-   Prisma Client generation
-   Prisma migrations
-   runtime/version configuration
-   Render deployment logs

------------------------------------------------------------------------

# 15. Deployment order

Follow this order:

``` text
1. Run local checks
        |
2. Push to GitHub
        |
3. Create production PostgreSQL
        |
4. Configure backend environment variables
        |
5. Deploy backend
        |
6. Apply Prisma migrations
        |
7. Test /graphql
        |
8. Configure frontend GraphQL URL
        |
9. Deploy frontend
        |
10. Configure backend CORS
        |
11. Test frontend
        |
12. Test authentication
        |
13. Test game
        |
14. Test history / best score
        |
15. Test leaderboard
```

------------------------------------------------------------------------

# 16. Official deployment references

-   Vercel --- Next.js deployment:
    https://vercel.com/docs/frameworks/full-stack/nextjs
-   Vercel --- Git deployments: https://vercel.com/docs/git
-   Vercel --- Environment variables:
    https://vercel.com/docs/environment-variables
-   Render --- Node deployment:
    https://render.com/docs/deploy-node-express-app
-   Render --- Environment variables:
    https://render.com/docs/configure-environment-variables
-   Prisma --- Production migrations:
    https://docs.prisma.io/docs/cli/migrate/deploy
-   Prisma --- Development vs production migrations:
    https://docs.prisma.io/docs/orm/v6/prisma-migrate/workflows/development-and-production

------------------------------------------------------------------------

## Final production architecture

``` text
                     +---------------------+
                     |       Browser       |
                     +----------+----------+
                                |
                                v
                     +---------------------+
                     |       Vercel        |
                     |   Next.js frontend  |
                     +----------+----------+
                                |
                         GraphQL / HTTPS
                                |
                                v
                     +---------------------+
                     |       Render        |
                     |   GraphQL backend   |
                     |   JWT + Prisma      |
                     +----------+----------+
                                |
                                v
                     +---------------------+
                     | PostgreSQL Database |
                     |   Production data   |
                     +---------------------+
```

The finished deployment should allow a new user to register, log in,
play the typing game, save their result, view their history and personal
best, and appear on the global leaderboard.
