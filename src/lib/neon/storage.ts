import 'server-only'
import { Files } from 'files-sdk'
import { neon } from 'files-sdk/neon'

// Neon Object Storage (S3-compatible, branches with the database). The adapter reads
// AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_ENDPOINT_URL_S3 / AWS_REGION written by `neon deploy`.
// Payload's Media and Documents uploads use the same bucket through @payloadcms/storage-s3 (see payload.config.ts);
// this client is for direct reads/writes outside Payload (exports, generated files, health checks).
export const NEON_BUCKET = process.env.NEON_BUCKET || 'assets'

export const isStorageConfigured = () =>
  !!process.env.AWS_ENDPOINT_URL_S3 && !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY

let files: Files | undefined
export function storage() {
  if (!files) files = new Files({ adapter: neon({ bucket: NEON_BUCKET }) })
  return files
}

/** Round-trip check: upload a tiny text object, read it back, presign a URL, delete it. */
export async function storageRoundTrip() {
  const key = `health/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.txt`
  const body = `tao-website storage check ${new Date().toISOString()}`
  const s = storage()
  await s.upload(key, body, { contentType: 'text/plain' })
  const file = await s.download(key)
  const text = await file.text()
  const url = await s.url(key, { expiresIn: 60 })
  await s.delete(key)
  return { key, matches: text === body, presignedHost: new URL(url).host }
}
