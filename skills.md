---
name: asset-compliance-service
version: "1.0.0"
description: >
  Complete implementation and operating context for the Asset Compliance NEO App service.
  Use this guide whenever creating, reviewing, deploying, or changing this project.
---

# Asset Compliance Service Skill

This file is the normative project context for `Asset-Compliance`. Read it before changing application code, database migrations, Cron configuration, UI behavior, deployment settings, or documentation.

## 1. Product purpose

Asset Compliance is a small inventory service for assets populated automatically by scheduled jobs. It has three pages:

```text
Home (/)
├── Stock Device (/devices)
└── Stock License (/licenses)
```

The Home page contains:

- A Hero section headed `Populate Asset Compliance`.
- One primary button linking to Stock Device.
- One secondary button linking to Stock License.

The service is a working data surface rather than a marketing site. Do not add authentication, manual data-entry forms, editing, deletion, pagination, search, filters, exports, charts, queue integration, or notifications unless explicitly requested.

## 2. Intended runtime architecture

```text
Browser
  │ HTTPS
  ▼
NEO Web Service — Nuxt UI and server API
  │ private PostgreSQL connection via DATABASE_URL
  ▼
NEO DB — PostgreSQL 16

NEO Cron — every 6 hours ──► POST /api/cron/licenses
NEO Cron — every 8 hours ──► POST /api/cron/devices
```

Frontend and API are served by one Nuxt application and one NEO Web Service. Database credentials and Cron credentials remain server-side and must never appear in browser bundles, public runtime configuration, logs, or source control.

## 3. Technology decisions

- Framework: Nuxt 4 with Vue 3 and Nitro's Node server preset.
- Runtime: Node.js 22 or newer.
- Package manager: pnpm 11.19.0.
- Database driver: `pg` connection pool.
- Database: NEO DB PostgreSQL 16 only.
- Deployment: Dockerfile or NEO App Railpack-compatible source build.
- Styling: BGN Web Design System v1.3.22 tokens and rules.
- Font: locally bundled Geist Variable package; no font CDN is required.
- Tests: Vitest.

Keep the Nuxt structure. Do not replace the application with a standalone HTML file. The old `bgn-design-system.html` artifact is reference material only.

## 4. User-visible routes

### `/`

Home page with a centered Hero and the two required route buttons. Shared navigation and footer are application chrome, not additional Home content.

### `/devices`

Displays a table titled `Stock Device` with exactly these data fields:

| UI column | API field | Database field | Rule |
| --- | --- | --- | --- |
| Nomor | `number` | `number` | PostgreSQL identity, increasing integer |
| Asset ID | `assetId` | `asset_id` | `GAD-` plus an increasing number padded to at least three digits |
| Brand | `brand` | `brand` | Asus, HP, Lenovo, Dell, or MSI |
| CPU | `cpu` | `cpu` | Positive integer representing CPU core count |
| RAM | `ram` | `ram_gb` | Stored as an integer; API/UI append ` GB` |
| GPU | `gpu` | `gpu` | Non-empty string from the application list |

The database stores `ram_gb` as a number so sorting and later reporting remain correct. Never store the `GB` presentation suffix in PostgreSQL.

### `/licenses`

Displays a table titled `Stock License` with exactly these data fields:

| UI column | API field | Database field | Rule |
| --- | --- | --- | --- |
| Nomor | `number` | `number` | PostgreSQL identity, increasing integer |
| Asset ID | `assetId` | `asset_id` | `LIC-` plus an increasing number padded to at least three digits |
| Issuer | `issuer` | `issuer` | Open Source, Windows, cPanel, Plesk, GlobalSign, Red Hat, or Adobe |
| SKU | `sku` | `sku` | Uppercase issuer code plus six random digits |
| Expiry Date | `expiryDate` | `expiry_date` | PostgreSQL `date` |

The expiry cell may include an accessible state badge without adding another table column:

- `Active`: expiry is more than 30 days away.
- `Expiring soon`: expiry is today through 30 days away.
- `Expired`: expiry is before the current PostgreSQL date.

## 5. Database model and invariants

All application tables are in the `asset_compliance` schema.

### `stock_devices`

- `number` is `BIGINT GENERATED ALWAYS AS IDENTITY` and the primary key.
- `asset_id` is a stored generated column and unique.
- `brand` is protected by a database `CHECK`, not only application validation.
- `cpu` and `ram_gb` must be positive.
- `created_at` uses `TIMESTAMPTZ` and PostgreSQL server time.

### `stock_licenses`

- `number` is `BIGINT GENERATED ALWAYS AS IDENTITY` and the primary key.
- `asset_id` is a stored generated column and unique.
- `issuer` is protected by a database `CHECK`.
- `expiry_date` uses the native `DATE` type.
- `created_at` uses `TIMESTAMPTZ` and PostgreSQL server time.

### Asset ID scaling

Three digits are a minimum display width. IDs are `GAD-001` through `GAD-999`, followed by `GAD-1000`; licenses follow the same rule with `LIC`. Never truncate identifiers after 999.

### `cron_runs`

This table makes scheduled writes idempotent. `run_key` is unique and combines the job name with a UTC time bucket. A retry in the same six-hour or eight-hour bucket returns success without inserting another asset.

### Migrations

- Migration files live in `migrations/` and run in filename order.
- Startup acquires a PostgreSQL advisory lock before applying migrations so multiple service replicas cannot migrate concurrently.
- `001_schema.sql` rejects databases whose major version is not 16.
- Migrations must remain idempotent and must never contain production seed data.
- Add new numbered migration files for schema changes; do not rewrite a migration already used in production.
- Set `RUN_DB_MIGRATIONS=false` only when migrations are managed by a separate release job.

## 6. HTTP API contracts

### `GET /api/devices`

Returns at most 500 rows ordered by newest `number` first:

```json
{
  "items": [
    {
      "number": 1,
      "assetId": "GAD-001",
      "brand": "Dell",
      "cpu": 16,
      "ram": "32 GB",
      "gpu": "NVIDIA RTX A2000"
    }
  ],
  "count": 1
}
```

### `GET /api/licenses`

Returns at most 500 rows ordered by newest `number` first:

```json
{
  "items": [
    {
      "number": 1,
      "assetId": "LIC-001",
      "issuer": "GlobalSign",
      "sku": "GLOB-498315",
      "expiryDate": "2027-09-25",
      "expiryState": "active"
    }
  ],
  "count": 1
}
```

Both inventory endpoints return `Cache-Control: no-store` because scheduled jobs can change the data independently of browser navigation.

### `POST /api/cron/devices`

- Expected schedule: every 8 hours.
- Creates one randomized device row per UTC eight-hour time bucket.
- Returns HTTP `201` for a newly inserted asset.
- Returns HTTP `200` and `duplicate: true` when the same bucket was already processed.

### `POST /api/cron/licenses`

- Expected schedule: every 6 hours.
- Creates one randomized license row per UTC six-hour time bucket.
- Returns HTTP `201` for a newly inserted asset.
- Returns HTTP `200` and `duplicate: true` when the same bucket was already processed.

### Cron authentication

NEO Cron must send either:

```text
Authorization: Bearer <CRON_SHARED_SECRET>
```

or, if the NEO Cron interface cannot set Authorization:

```text
X-Cron-Secret: <CRON_SHARED_SECRET>
```

The server compares a SHA-256 digest using constant-time comparison. Never put the secret in a query string unless the platform cannot set request headers and the security owner explicitly accepts URL-log exposure.

### Health endpoints

- `GET /api/health/live`: confirms the HTTP process is alive.
- `GET /api/health/ready`: confirms database connectivity and PostgreSQL major version 16.

## 7. Random-data rules

Device generation uses only:

- Brands: Asus, HP, Lenovo, Dell, MSI.
- CPU cores: 4, 6, 8, 12, 16, 24, 32.
- RAM: 8, 16, 32, 64, 128 GB.
- GPU: Integrated, Intel Iris Xe, AMD Radeon 780M, NVIDIA RTX A2000, NVIDIA RTX 4060.

License generation uses only the approved issuers. SKU contains a four-character normalized issuer code and six random digits. Expiry dates range from 45 days in the past through 730 days in the future so all compliance states can be exercised.

Use cryptographic `randomInt` rather than `Math.random` for unbiased bounded selection. Random values are not security tokens.

## 8. BGN Web Design System contract

Source of design rules: `https://ds.biznetgio.com/skills.md`, verified as v1.3.22 when this project was created.

### Visual rules

- Geist is the primary UI font.
- Primary 700 (`#118D62`) is reserved for primary CTAs, links, active navigation, focus, and meaningful interaction.
- Default visible borders use Neutral 300 (`#DCE3EA`).
- Body text uses Neutral 700; lighter neutral colors are for metadata only.
- Cards and tables use the BGN 12px card radius.
- Low-elevation surfaces use borders before shadows.
- Spacing comes from the BGN 4px token scale.
- Do not introduce hardcoded component colors, arbitrary radii, arbitrary shadows, or arbitrary spacing when a token exists.

### Table rules

- Header text is 13px semibold Neutral 900.
- Body cells are 13px regular Neutral 700.
- Cells use 24px horizontal and 16px vertical padding.
- Tables use a Neutral 300 outer border and subtle repeated-row dividers.
- Tables scroll horizontally on narrow viewports.
- Regular resource values remain weight 400; Asset IDs may use monospace semibold as identifiers.

### Interaction and accessibility

- All interactive elements expose visible hover, focus-visible, active, and disabled states as applicable.
- Normal text contrast must meet at least 4.5:1.
- Status labels include text and do not rely on color alone.
- Icon-only controls require `aria-label`; this project currently has none.
- Motion must respect `prefers-reduced-motion: reduce`.
- Navigation uses `aria-current="page"` and stable `data-route` hooks.
- Test responsive layouts at 375px, 768px, 1024px, and 1280px.
- The official wordmark SVG must not be recolored, stretched, redrawn, or regenerated.

## 9. Environment configuration

Required production values:

```dotenv
DATABASE_URL=postgresql://username:password@neo-db-host:5432/asset_compliance?sslmode=verify-full
CRON_SHARED_SECRET=<long-random-secret>
NITRO_HOST=0.0.0.0
NITRO_PORT=3000
RUN_DB_MIGRATIONS=true
DEMO_MODE=false
```

Rules:

- Keep `.env` and `.env.example` keys aligned.
- Never commit `.env`.
- Never use `NUXT_PUBLIC_*` for credentials.
- Use the NEO DB service binding value for `DATABASE_URL`.
- Production must set `DEMO_MODE=false` or omit it.

## 10. Local development

Install and run:

```text
pnpm install
pnpm dev
```

Without a PostgreSQL instance, set `DEMO_MODE=true` in a local `.env` to preview the frontend. Demo mode is explicitly non-persistent and disables startup database migration. It is only a presentation fallback; it is not an alternative production datastore.

Quality checks:

```text
pnpm test
pnpm build
```

## 11. NEO App deployment

1. Provision NEO DB PostgreSQL 16.
2. Create a database/user with permission to create the `asset_compliance` schema and its tables during the first migration.
3. Configure runtime environment variables in the NEO Web Service.
4. Deploy this folder using the Dockerfile or a supported source build.
5. Configure health probes at `/api/health/live` and `/api/health/ready`.
6. Configure the six-hour NEO Cron to call `/api/cron/licenses` with the shared secret header.
7. Configure the eight-hour NEO Cron to call `/api/cron/devices` with the shared secret header.
8. Invoke each Cron endpoint once and verify a new row appears on its page.
9. Invoke each endpoint again in the same schedule bucket and verify no duplicate row is created.

The current `neo_app` MCP can deploy the web service and inspect deployment status, but it does not provision NEO DB or NEO Cron. Those resources and bindings must be configured through the NEO App dashboard or another authorized API.

## 12. Security and reliability requirements

- All SQL values are parameterized.
- Browser code never connects directly to PostgreSQL.
- Cron writes occur inside a transaction.
- Cron retries are idempotent within the appropriate schedule bucket.
- Database pool size stays small by default to avoid exhausting shared PostgreSQL connection limits.
- Logs may contain event names and migration filenames, but never URLs containing credentials, request authorization headers, or row payloads containing future sensitive information.
- Do not expose manual Cron controls in the public frontend.
- Keep the web service stateless; PostgreSQL owns durable state.

## 13. Definition of done

A change is complete only when:

- All three routes compile and retain the requested content.
- PostgreSQL schema constraints match the approved brands and issuers.
- Device RAM remains numeric in storage and formatted with `GB` in the API/UI.
- Both Cron endpoints remain authenticated, transactional, and idempotent.
- Tests pass.
- The production build passes.
- Responsive table behavior and focus states remain intact.
- Design-system-impacting changes are recorded in `changelog.md`.
- `skills.md`, `.env.example`, migrations, and README stay consistent with implementation.

## 14. Non-goals

Unless explicitly requested, do not add:

- NEO Queue or NATS JetStream.
- User accounts or role-based access.
- Manual create, update, or delete operations.
- Asset attachments or image storage.
- External email or chat notifications.
- Browser-local persistence as an authoritative datastore.
- Multiple web services for frontend and backend.

