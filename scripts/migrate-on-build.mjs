/* Runs before `next build`: brings the database schema up to date with src/migrations.
   Production only: on Vercel that is VERCEL_ENV=production (preview builds never touch the database);
   anywhere else (AWS, a server, CI) it runs whenever DATABASE_URL points to PostgreSQL.
   Already-applied migrations are skipped, so running it on every build is safe. */
import { execSync } from 'node:child_process'

const url = process.env.DATABASE_URL || ''
const vercelEnv = process.env.VERCEL_ENV

if (!/^postgres(ql)?:\/\//.test(url)) {
  console.log('[migrate] no PostgreSQL DATABASE_URL, skipped')
} else if (vercelEnv && vercelEnv !== 'production') {
  console.log(`[migrate] Vercel ${vercelEnv} build, skipped`)
} else {
  console.log('[migrate] applying pending migrations')
  execSync('npx payload migrate', { stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: '--no-deprecation' } })
}
