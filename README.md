# Testing Website With Database

A Nuxt website for exploring and extending the MySQL sample in `database/sample_employee_database.sql`.

## Pages

- `/` — overview and live record counts.
- `/query` — read-only SQL console for `SELECT`, `SHOW`, `DESCRIBE`, and `EXPLAIN`.
- `/input` — validated form for adding employee records.

## Local setup

Requirements: Docker Desktop and pnpm.

```powershell
Copy-Item .env.example .env
docker compose up -d
pnpm install
pnpm tokens:build
pnpm dev
```

Open `http://127.0.0.1:5175`.

The Docker configuration initializes the sample schema and two least-privilege users: one for read-only SQL queries and one for validated inserts. The committed credentials are for local testing only; replace them in every shared or production environment.

## Validation

```powershell
pnpm tokens:check
pnpm build
```

## Deployment note

This application requires a Node.js server and MySQL. GitHub Pages cannot run the server API or MySQL connection. Push the repository to GitHub, then deploy it to a Node-compatible host with the environment variables from `.env.example` and separate least-privilege MySQL users.

## Design system

The repository includes the downloaded `skills.md` from `https://ds.biznetgio.com/skills.md`. Project tokens are generated from `design-tokens/bgn.tokens.json`, and the public brand files are unmodified official SVG assets downloaded from the same design-system host.
