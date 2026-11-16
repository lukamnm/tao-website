import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "offers" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "banners" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "offers" ADD COLUMN "published" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "offers" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "banners" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "offers" DROP COLUMN "published";`)
}
