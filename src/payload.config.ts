import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { Banners } from './collections/Banners'
import { Offers } from './collections/Offers'
import { News } from './collections/News'
import { Pages } from './collections/Pages'
import { ContactMessages } from './collections/ContactMessages'
import { CorporateRequests } from './collections/CorporateRequests'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const dbUrl = process.env.DATABASE_URL || 'file:./tao-website.db'
const isPostgres = /^postgres(ql)?:\/\//.test(dbUrl)

// Local development uses a SQLite file; staging and production use PostgreSQL (Neon now, RDS later).
const db = isPostgres
  ? postgresAdapter({ pool: { connectionString: dbUrl } })
  : sqliteAdapter({ client: { url: dbUrl } })

// Uploads: Neon Object Storage (S3-compatible, branches with the database) when `neon deploy` has written the
// AWS_* vars; otherwise Vercel Blob when a token exists; otherwise local disk. AWS S3 later uses the same plugin.
const plugins = []
if (process.env.AWS_ENDPOINT_URL_S3 && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  plugins.push(
    s3Storage({
      collections: { media: true, documents: true },
      bucket: process.env.NEON_BUCKET || 'assets',
      config: {
        endpoint: process.env.AWS_ENDPOINT_URL_S3,
        region: process.env.AWS_REGION || 'us-east-2',
        forcePathStyle: true, // Neon requires path-style addressing
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      },
    }),
  )
} else if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      collections: { media: true, documents: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · TAO admin' },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Logo#Icon',
      },
    },
  },
  localization: {
    locales: [
      { code: 'ka', label: 'ქართული' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'ka',
    fallback: true,
  },
  collections: [Banners, Offers, News, Pages, Documents, ContactMessages, CorporateRequests, Media, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db,
  sharp,
  plugins,
})
