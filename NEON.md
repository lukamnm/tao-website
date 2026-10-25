# Neon backend

Project `TAO Insurance` (`delicate-grass-95233928`, org `org-billowing-leaf-90540703`, region `aws-us-east-2`), branch `production`.
Services are declared in `neon.ts` and applied with `neon deploy`, which also pulls the branch env vars into `.env`.

| Service | Where it is wired | Env vars |
|---|---|---|
| Postgres | Payload CMS (`src/payload.config.ts`, `@payloadcms/db-postgres`) and `src/lib/neon/db.ts` (small `pg` pool for raw reads) | `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (migrations only) |
| Neon Auth (Managed Better Auth) | `src/lib/auth/server.ts`, `src/lib/auth/client.ts`, `src/app/api/auth/[...path]/route.ts`, `src/proxy.ts` (guards `/account/*`), pages under `src/app/(frontend)/auth` and `/account` | `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET` (local, 32+ chars) |
| Object Storage (bucket `assets`) | Payload uploads for `media` and `documents` via `@payloadcms/storage-s3`; `src/lib/neon/storage.ts` (Files SDK) for direct access | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3`, `AWS_REGION`, `NEON_BUCKET` |
| Functions (`hello`) | `hello.ts` (JSON health endpoint next to the database); called from `src/app/api/neon/function/route.ts` | `NEON_FUNCTION_HELLO_BASE_URL` |
| Realtime | `src/lib/neon/realtime.ts` (seals the live query), `src/app/api/neon/inbox/live/route.ts` (renewal), `src/components/neon/{RealtimeRoot,LiveInbox}.tsx` | `NEON_REALTIME_URL`, `NEON_REALTIME_SECRET`, `NEXT_PUBLIC_NEON_REALTIME_URL` |
| AI Gateway | `src/lib/neon/ai.ts`, `src/app/api/neon/ai/route.ts` (returns 503 until enabled) | `NEON_AI_GATEWAY_BASE_URL`, `NEON_AI_GATEWAY_TOKEN` |

The AI Gateway is not served on the Free plan, so `aiGateway` is commented out in `neon.ts`. After upgrading the
organisation plan: uncomment it, run `neon deploy`, and the two env vars appear in `.env`.

## Day to day

```bash
neon status              # live config of the linked branch
neon config plan         # what `neon deploy` would change
neon deploy              # apply neon.ts, redeploy hello.ts, pull env vars
neon env pull            # refresh .env from the branch
neon dev                 # run the function locally
neon logs query --source function --since 1h
neon checkout feature-x --create --env .env   # isolated branch (database + storage + function + auth)
```

`/neon-status` renders a per-request check of every service and a live counter of the contact inbox.
Development-only: `POST /api/neon/inbox` inserts a test contact message (refused in production unless `ALLOW_TEST_INBOX=1`).

## Hosting notes

- Vercel: set the same env vars in the project settings (`neon env pull` output). Postgres uses node-postgres through
  Payload; keep the pooled `DATABASE_URL`.
- Realtime `allowedOrigins` in `neon.ts` must list every browser origin (add the Vercel preview/production hosts).
- Neon Auth needs the site's domains in its trusted domains and custom SMTP before launch (Neon Console, Better Auth page).
