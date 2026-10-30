# TAO website - deployment

Stack: Next.js 16 (App Router) + Payload CMS 3 (admin at `/admin`) + PostgreSQL. Georgian at `/`, English at `/en`.

## Environments

| Variable | What | Test (Vercel + Neon) | Later (AWS) |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Neon pooled URL | RDS PostgreSQL |
| `PAYLOAD_SECRET` | Random secret for admin sessions (32+ chars) | any | any |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for metadata and the sitemap | `https://tao-website.vercel.app` | `https://taoinsurance.ge` |
| `NEXT_PUBLIC_INDEXABLE` | `1` only on the live site (robots.txt) | unset | `1` |
| `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `NEON_BUCKET` | S3-compatible storage for uploads (images, PDFs) | Neon Object Storage (bucket `assets`) | Amazon S3 (drop `AWS_ENDPOINT_URL_S3`, set bucket name) |
| `BLOB_READ_WRITE_TOKEN` | Alternative: Vercel Blob storage (used only when the S3 vars are absent) | optional | - |

Without any storage variables uploads go to the local disk (`media/`, `documents/`), which is fine for a laptop and wrong for a server.

With a `file:` `DATABASE_URL` the site runs on SQLite (local development without Postgres).

## Vercel (test hosting)

1. Push the repository to GitHub (organisation `tao-insurance`).
2. Vercel: "Add New Project" → import the repository. Framework: Next.js (detected). Build command and output stay default.
3. Environment variables: copy the values from `.env` (never commit `.env`). Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL.
4. Deploy. Open `/admin` and create the first administrator.
5. Branches: `main` = live preview for stakeholders, every pull request gets its own preview URL.

## Content

- `npm run seed` loads the sample content (hero slides, promo banners, offers, news, settings) into an empty database. Safe to run again: existing records are skipped.
- Documents (PDF): upload them in the admin ("დოკუმენტები"), choosing section (legal / financial), type and date. The Legal and Financial pages list them automatically.
- Privacy policy, terms of use and complaints procedure: the site shows the designed text until a "ტექსტური გვერდი" with slug `privacy`, `terms` or `complaints` exists; then that text is shown instead.
- Changes made in the admin appear on the site immediately (cache is cleared on every save).

## Database changes (migrations)

The database structure never changes on its own. Every change is a file in `src/migrations/`, kept in git with the code that needs it.

- `npm run build` first runs `scripts/migrate-on-build.mjs`: on Vercel production builds (and on any non-Vercel server) it applies the migrations that are not applied yet. Preview builds never touch the database.
- Each migration runs in a transaction: if it fails, nothing changes and the build stops, so the running site stays as it was.
- New change to the collections: edit the collection, run `npm run migrate:create` (with `DATABASE_URL` pointing to a Neon test branch), review the file, test it on a branch made from production (`npm run migrate`), then commit.
- `npm run migrate:status` shows what has been applied where.
- Before a migration on production, make a Neon backup branch (named `backup-YYYY-MM-DD-...`).

## Editable lists

Products, news categories, partner categories and cities are records in the admin ("კატეგორიები"), not code. Editors add, rename, reorder (drag) and remove them. A list entry still used by offers, news, documents or banners cannot be deleted; the admin says where it is used. Each entry has a hidden `key` (e.g. `health`) that the site code and the product pages rely on; it is made from the name once and never changes.

## Moving to AWS later

Same code, same database structure. Change `DATABASE_URL` to RDS (PostgreSQL), the `AWS_*` variables to a real S3 bucket (remove `AWS_ENDPOINT_URL_S3`), host the Next app on Amplify Hosting or App Runner, run `npm run build && npm start`. Export the Neon database with `pg_dump` and import it into RDS; copy the bucket contents with `aws s3 sync`.

Two ways to fill RDS, both give the same result:

1. **Copy everything (recommended):** `pg_dump` from Neon, `pg_restore` into RDS. All content, users, messages and the `payload_migrations` table come along, so the first build on AWS finds nothing to migrate.
2. **Empty database:** point `DATABASE_URL` to an empty RDS database and build: the migrations create every table and the default lists, then `npm run seed` adds the sample content.
