# Typing Speed Game

A full-stack typing speed game built with **Next.js**, **GraphQL Yoga**, **Prisma**, **PostgreSQL**, and **JWT authentication**.

The application supports user authentication, timed typing games, penalties for incorrect input, game history, personal bests, and a global leaderboard.

## Live Deployment

- **Frontend:** Deployed on Vercel
- **Backend / GraphQL API:** https://typing-speed-game-backend.onrender.com
- **GraphQL endpoint:** https://typing-speed-game-backend.onrender.com/graphql
- **Database:** Neon PostgreSQL

> The frontend deployment URL is managed by Vercel and may vary depending on the deployment/project settings.

---

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected application routes
- Logout functionality
- Password hashing

### Typing Game
- Generates exactly **20 random alphabets**
- One character is presented at a time
- Correct input advances the game
- Incorrect input does not advance the current character
- Tracks correct and incorrect characters
- Tracks completion time
- Applies penalty time for incorrect attempts

### Dashboard
- Personal best completion time
- Accuracy information
- Penalty statistics
- Game history
- Quick access to start a new game

### Leaderboard
- Global rankings
- Best completion time per player
- Accuracy statistics
- Penalty statistics
- Supports multiple users and their results

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- GraphQL client
- Next.js App Router

### Backend
- Node.js
- Bun
- TypeScript
- GraphQL Yoga
- Prisma ORM
- PostgreSQL
- JWT
- Password hashing

### Production Infrastructure
- **Vercel** — Next.js frontend
- **Render** — GraphQL backend
- **Neon** — PostgreSQL database
- **GitHub** — source control and deployment integration

---

## Project Structure

```text
typing_speed_game/
├── frontend/                 # Next.js application
│   ├── app/
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── backend/                  # GraphQL API
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── db/
│   │   ├── game/
│   │   ├── graphql/
│   │   └── middleware/
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

# Local Development

## Prerequisites

Install:

- Node.js
- Bun
- Git
- PostgreSQL, or use a hosted PostgreSQL database such as Neon

---

## 1. Clone the repository

```bash
git clone https://github.com/HJ-ANAND/Typing_Speed_Game.git
cd Typing_Speed_Game
```

---

## 2. Configure the backend

Go to the backend:

```bash
cd backend
```

Create your local environment file from the example:

```bash
cp .env.example .env
```

Configure the required backend variables:

```env
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-local-jwt-secret
```

Use your own local/development database and secret.

---

## 3. Install backend dependencies

```bash
bun install
```

Generate the Prisma client:

```bash
bunx prisma generate
```

Apply development migrations:

```bash
bunx prisma migrate dev
```

Start the backend:

```bash
bun run dev
```

The local GraphQL API runs on:

```text
http://localhost:4000/graphql
```

---

## 4. Configure the frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
bun install
```

Create the local environment file:

```bash
cp .env.example .env.local
```

Set the GraphQL API URL:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

Start the frontend:

```bash
bun run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

# Environment Variables

## Backend

The backend uses private environment variables such as:

```env
DATABASE_URL=...
JWT_SECRET=...
```

These values must **never** be committed to GitHub.

## Frontend

The frontend uses:

```env
NEXT_PUBLIC_GRAPHQL_URL=...
```

For local development:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

For production:

```env
NEXT_PUBLIC_GRAPHQL_URL=https://typing-speed-game-backend.onrender.com/graphql
```

Only values intended to be available in browser-side code should use the `NEXT_PUBLIC_` prefix.

---

# Database & Prisma

The project uses Prisma migrations to manage the PostgreSQL schema.

Migration files are committed to the repository:

```text
backend/prisma/migrations/
```

### Development

Use:

```bash
bunx prisma migrate dev
```

### Production

Use:

```bash
bunx prisma migrate deploy
```

Do **not** use `prisma migrate dev` against the production database.

The production database is hosted on **Neon PostgreSQL**.

---

# Production Deployment

The production architecture is:

```text
                         Browser
                            |
                            v
                    +---------------+
                    |    Vercel     |
                    | Next.js App   |
                    +-------+-------+
                            |
                       GraphQL/HTTPS
                            |
                            v
                    +---------------+
                    |    Render     |
                    | GraphQL API   |
                    | JWT + Prisma  |
                    +-------+-------+
                            |
                            v
                    +---------------+
                    |     Neon      |
                    |  PostgreSQL   |
                    +---------------+
```

## Backend — Render

The backend is deployed as a Render Web Service.

Configuration:

```text
Root Directory: backend
```

The backend requires production environment variables in Render:

```text
DATABASE_URL
JWT_SECRET
```

The backend listens on the hosting provider's `PORT` environment variable and falls back to port `4000` for local development.

The production GraphQL API is:

```text
https://typing-speed-game-backend.onrender.com/graphql
```

### Production build

The backend build generates the Prisma client and compiles the TypeScript source into `dist/`.

The production server starts from:

```text
dist/src/server.js
```

Prisma migrations should be applied with:

```bash
bunx prisma migrate deploy
```

---

## Frontend — Vercel

The frontend is deployed to Vercel.

Because this is a monorepo, the Vercel project uses:

```text
Root Directory: frontend
```

Vercel automatically detects the Next.js application.

Set the following production environment variable in Vercel:

```text
NEXT_PUBLIC_GRAPHQL_URL=https://typing-speed-game-backend.onrender.com/graphql
```

Do not upload or commit your local `.env` or `.env.local` files.

---

# Deployment Checklist

Before considering a deployment complete, verify the following.

### Backend

- [x] Render service is running
- [x] Production database is connected
- [x] Prisma migrations are applied
- [x] GraphQL endpoint is available
- [x] JWT secret is configured through environment variables
- [x] Backend uses the provider-assigned `PORT`

### Frontend

- [x] Vercel deployment succeeds
- [x] Production GraphQL URL is configured
- [x] Frontend can communicate with the Render backend
- [x] Authentication works
- [x] Game works
- [x] Game results are saved

### Application

- [x] Registration works
- [x] Login works
- [x] Logout works
- [x] Protected routes work
- [x] Typing game generates 20 characters
- [x] Correct characters advance the game
- [x] Wrong characters do not advance the game
- [x] Wrong attempts are tracked
- [x] Penalty time is tracked
- [x] Completion time is recorded
- [x] Game history updates after a completed game
- [x] Personal best updates correctly
- [x] Leaderboard updates correctly
- [x] Multiple users can use the application

---

# Production Testing

After deployment, test the complete user flow from the live frontend.

## Authentication

1. Register a new user.
2. Log in.
3. Refresh the page.
4. Navigate between protected pages.
5. Log out.
6. Confirm protected pages require authentication.

## Game

1. Start a game.
2. Enter correct characters.
3. Enter incorrect characters.
4. Confirm incorrect input does not advance the game.
5. Complete all 20 characters.
6. Confirm the final result is displayed.

## History & Personal Best

After completing a game:

1. Open the dashboard.
2. Confirm the new result appears in game history.
3. Confirm the personal best is updated when appropriate.
4. Complete another game and verify history changes.

## Leaderboard

Create multiple accounts and complete games.

Verify that:

```text
User A -> sees User A's history
User B -> sees User B's history
Leaderboard -> contains both users
```

Verify that rankings and statistics update after new games are completed.

---

# Security Notes

Never commit:

```text
.env
.env.local
.env.production
```

Never commit secrets such as:

```text
DATABASE_URL=...
JWT_SECRET=...
```

Production secrets should be stored in the environment-variable settings of Render/Vercel.

The frontend must never receive private backend secrets such as:

```text
DATABASE_URL
JWT_SECRET
```

---

# Useful Commands

## Frontend

```bash
cd frontend

bun run dev
bun run lint
bunx tsc --noEmit
```

## Backend

```bash
cd backend

bun run dev
bun run build
bun run start
bunx tsc --noEmit
```

## Prisma

```bash
cd backend

bunx prisma generate
bunx prisma migrate dev
bunx prisma migrate deploy
```

---

# Troubleshooting

### Frontend cannot connect to the backend

Check:

```text
NEXT_PUBLIC_GRAPHQL_URL
```

For production it should point to:

```text
https://typing-speed-game-backend.onrender.com/graphql
```

After changing a Vercel environment variable, redeploy the frontend.

### CORS error

Check the backend CORS configuration and make sure the production Vercel origin is allowed.

Keep the local development origin available when needed:

```text
http://localhost:3000
```

### Prisma cannot connect

Check the Render:

```text
DATABASE_URL
```

Make sure it points to the production Neon PostgreSQL database.

### Prisma tables are missing

Run the production migration command:

```bash
bunx prisma migrate deploy
```

### Backend fails to start on Render

Check:

- Render deployment logs
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- Prisma client generation
- Prisma migrations
- backend build output
- production start command

---

# Repository

GitHub:

https://github.com/HJ-ANAND/Typing_Speed_Game

---

## Final Architecture

```text
                         +------------------+
                         |     Browser      |
                         +--------+---------+
                                  |
                                  v
                         +------------------+
                         |      Vercel      |
                         |  Next.js + React |
                         +--------+---------+
                                  |
                           GraphQL / HTTPS
                                  |
                                  v
                         +------------------+
                         |      Render      |
                         |  GraphQL Yoga    |
                         |      + JWT       |
                         |     + Prisma     |
                         +--------+---------+
                                  |
                                  v
                         +------------------+
                         |       Neon       |
                         |    PostgreSQL    |
                         +------------------+
```

The deployed application provides a complete flow from registration and authentication through gameplay, result persistence, personal history, personal bests, and global leaderboard rankings.
