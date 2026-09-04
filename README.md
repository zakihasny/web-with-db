# Asset Compliance

Asset Compliance is a Nuxt full-stack service for NEO Web Service, NEO DB PostgreSQL 16, and NEO Cron. It shows device and license inventory tables populated by authenticated scheduled API calls.

## Routes

- `/` — Home with links to both inventories.
- `/devices` — Stock Device table.
- `/licenses` — Stock License table.
- `POST /api/cron/devices` — inserts one random device per eight-hour UTC bucket.
- `POST /api/cron/licenses` — inserts one random license per six-hour UTC bucket.
- `/api/health/live` and `/api/health/ready` — service probes.

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Set `DEMO_MODE=true` to preview the frontend without PostgreSQL. Demo mode is non-persistent and must remain disabled in production.

## Validation

```bash
pnpm test
pnpm build
```

## Container image

```bash
docker build -t asset-compliance .
docker run --rm -p 3000:80 \
  -e DATABASE_URL='postgresql://user:password@host:5432/asset_compliance' \
  -e CRON_SHARED_SECRET='replace-with-a-long-random-secret' \
  -e RUN_DB_MIGRATIONS=true \
  asset-compliance
```

The production image listens on port `80` and runs as the non-root `nuxt` user.

## Deployment configuration

Provide `DATABASE_URL`, `CRON_SHARED_SECRET`, `PORT=80`, `NITRO_HOST=0.0.0.0`, `NITRO_PORT=80`, and `DEMO_MODE=false`. The service applies the idempotent migrations in `migrations/` at startup unless `RUN_DB_MIGRATIONS=false`.

Read `skills.md` before modifying the service; it contains the complete product, data, Cron, design, security, and deployment contract.
