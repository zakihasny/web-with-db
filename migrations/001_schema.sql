BEGIN;

DO $$
DECLARE
  server_major_version integer := current_setting('server_version_num')::integer / 10000;
BEGIN
  IF server_major_version <> 16 THEN
    RAISE EXCEPTION 'Asset Compliance requires PostgreSQL 16; connected major version is %', server_major_version;
  END IF;
END
$$;

CREATE SCHEMA IF NOT EXISTS asset_compliance;

CREATE TABLE IF NOT EXISTS asset_compliance.schema_migrations (
  version varchar(50) PRIMARY KEY,
  description varchar(255) NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS asset_compliance.stock_devices (
  number bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  asset_id varchar(32) GENERATED ALWAYS AS (
    'GAD-' || CASE
      WHEN number < 1000 THEN lpad(number::text, 3, '0')
      ELSE number::text
    END
  ) STORED UNIQUE,
  brand varchar(20) NOT NULL,
  cpu smallint NOT NULL,
  ram_gb smallint NOT NULL,
  gpu varchar(80) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT current_timestamp,
  CONSTRAINT stock_devices_brand_check
    CHECK (brand IN ('Asus', 'HP', 'Lenovo', 'Dell', 'MSI')),
  CONSTRAINT stock_devices_cpu_check CHECK (cpu > 0),
  CONSTRAINT stock_devices_ram_check CHECK (ram_gb > 0)
);

CREATE TABLE IF NOT EXISTS asset_compliance.stock_licenses (
  number bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  asset_id varchar(32) GENERATED ALWAYS AS (
    'LIC-' || CASE
      WHEN number < 1000 THEN lpad(number::text, 3, '0')
      ELSE number::text
    END
  ) STORED UNIQUE,
  issuer varchar(40) NOT NULL,
  sku varchar(80) NOT NULL,
  expiry_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT current_timestamp,
  CONSTRAINT stock_licenses_issuer_check
    CHECK (issuer IN ('Open Source', 'Windows', 'cPanel', 'Plesk', 'GlobalSign', 'Red Hat', 'Adobe'))
);

CREATE TABLE IF NOT EXISTS asset_compliance.cron_runs (
  run_key varchar(100) PRIMARY KEY,
  job_name varchar(40) NOT NULL,
  schedule_bucket bigint NOT NULL,
  inserted_asset_id varchar(32),
  started_at timestamptz NOT NULL DEFAULT current_timestamp,
  completed_at timestamptz,
  CONSTRAINT cron_runs_job_name_check
    CHECK (job_name IN ('populate-device', 'populate-license')),
  CONSTRAINT cron_runs_job_bucket_unique UNIQUE (job_name, schedule_bucket)
);

CREATE INDEX IF NOT EXISTS stock_devices_created_at_idx
  ON asset_compliance.stock_devices (created_at DESC);

CREATE INDEX IF NOT EXISTS stock_licenses_expiry_date_idx
  ON asset_compliance.stock_licenses (expiry_date);

INSERT INTO asset_compliance.schema_migrations (version, description)
VALUES ('001', 'Create Asset Compliance inventory and Cron-run tables')
ON CONFLICT (version) DO NOTHING;

COMMIT;
