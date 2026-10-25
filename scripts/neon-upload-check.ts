// Proves Payload's media uploads go to Neon Object Storage through @payloadcms/storage-s3.
// Run: npx payload run scripts/neon-upload-check.ts
import { getPayload } from 'payload'
import sharp from 'sharp'
import { Files } from 'files-sdk'
import { neon } from 'files-sdk/neon'
import config from '../src/payload.config'

// Same adapter as src/lib/neon/storage.ts (that module is `server-only`, so it cannot be imported from a script).
const files = new Files({ adapter: neon({ bucket: process.env.NEON_BUCKET || 'assets' }) })
const storage = () => files

const payload = await getPayload({ config })
const png = await sharp({ create: { width: 64, height: 64, channels: 3, background: '#283DEE' } }).png().toBuffer()
const filename = `neon-upload-check-${Date.now()}.png`

const doc = await payload.create({
  collection: 'media',
  data: { alt: 'Neon upload check' },
  file: { data: png, name: filename, mimetype: 'image/png', size: png.length },
})
console.log('created media', doc.id, doc.filename, doc.url)

const exists = await storage().exists(doc.filename!)
console.log('object in bucket:', exists)
for (const size of Object.values(doc.sizes ?? {})) {
  if (size?.filename) console.log(`  size ${size.filename}: in bucket = ${await storage().exists(size.filename)}`)
}

await payload.delete({ collection: 'media', id: doc.id })
console.log('deleted media; still in bucket:', await storage().exists(doc.filename!))
process.exit(exists ? 0 : 1)
