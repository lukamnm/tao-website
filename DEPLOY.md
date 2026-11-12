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

## AWS hosting (Lightsail, Stockholm)

The site runs on one AWS Lightsail server in eu-north-1 (Stockholm; this AWS project allows only eu-north-1
and us-east-1). Neon and Vercel are not used by it.

| What | Where |
|---|---|
| Server | Lightsail instance `tao-web`, Ubuntu 24.04, 1 GB RAM + 4 GB swap (largest size the new account allows; move to 2 GB via a snapshot when AWS lifts the limit) |
| Address | static IP `13.62.200.190` (`tao-ip`); test URL `https://13-62-200-190.sslip.io` |
| Web server | Caddy (`/etc/caddy/Caddyfile`): HTTPS certificates automatic, proxies to the site on port 3000 |
| Site | systemd service `tao-web` (`next start`), runs as user `tao` from `/home/tao/app` (symlink to `/home/tao/releases/<sha>-<time>`) |
| Database | PostgreSQL 18 on the same server, database and role `tao`; password in `/home/tao/secrets/dbpass` |
| Settings | `/home/tao/secrets/app.env` (DATABASE_URL, PAYLOAD_SECRET, bucket keys, NEXT_PUBLIC_SITE_URL) |
| Uploads | Lightsail bucket `tao-website-files` (S3 API, `AWS_ENDPOINT_URL_S3=https://s3.eu-north-1.amazonaws.com`) |
| Backups | daily Lightsail snapshot of the whole server (01:00) + nightly `pg_dump` to `/home/tao/backups` (00:30, kept 14 days) |
| Firewall | Lightsail: only 22 (SSH key), 80, 443 open |
| SSH | `ssh -i ~/.ssh/tao_lightsail ubuntu@13.62.200.190` |

### Deploying a change

Commit, then from the project folder in Git Bash:

```bash
bash scripts/deploy-aws.sh
```

1 GB RAM is too little for `next build`, so the script builds on the PC (through an SSH tunnel to the server
database, which also applies pending migrations), uploads the result, fixes the PC paths in it
(`scripts/aws-fix-paths.py`), switches and restarts. A failed build leaves the running site as it was.
Pushing to GitHub still deploys the Vercel copy (on Neon) as before; the two databases are separate now.

### Switching taoinsurance.ge to the server

1. The domain's DNS manager adds A records `taoinsurance.ge` and `www.taoinsurance.ge` -> `13.62.200.190`.
2. In `/etc/caddy/Caddyfile` replace the sslip.io name with `taoinsurance.ge, www.taoinsurance.ge` and
   `sudo systemctl reload caddy` (certificates are issued on the first request).
3. In `app.env` set `NEXT_PUBLIC_SITE_URL=https://taoinsurance.ge` and `NEXT_PUBLIC_INDEXABLE=1`, then deploy
   again (NEXT_PUBLIC values are fixed at build time).

### Maintenance page (until launch)

**Launched 2026-11-12:** the MAINTENANCE block was removed from /etc/caddy/Caddyfile (the version with it is kept as
/etc/caddy/Caddyfile.bak-prelaunch-20261112). To close the site again, put that block back and `sudo systemctl reload caddy`.
Old-site URLs (*_GEO.html, *_ENG.html, root-level PDFs/XLS) are redirected by src/proxy.ts and the legacy-file route.


taoinsurance.ge points to the server since 2026-11-10, but the site is not launched yet. Caddy shows visitors
`scripts/maintenance/index.html`: the first-view loader (white ტ on TAO blue) on a loop. On the server it is
`/srv/maintenance/index.html` (HTTP 503 so search engines wait), next to `lottie_svg.min.js` (from
node_modules/lottie-web) and `tao-loader-symbol.json` (from public/lottie), served at `/maintenance/...`.
The team opens the private preview link once (`/preview-<token>`, the token is in `/etc/caddy/Caddyfile`); a cookie
then shows that browser the real site for 30 days. `/admin`, `/api`, `/_next`, `/fonts` and `/logo` always pass.

To launch: delete the block between `# MAINTENANCE` and `# END MAINTENANCE` in `/etc/caddy/Caddyfile`, then
`sudo systemctl reload caddy`. To change the page: edit `scripts/maintenance/index.html` and copy it to the server again.

### Neon-only extras

Visitor accounts (`/auth`, `/account`), Neon Realtime and the AI gateway (`/neon-status`, `/api/neon/*`) need
Neon variables; without them they are off (`/auth` and `/account` answer 404). The public site does not use them.
