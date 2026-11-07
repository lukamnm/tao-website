import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "offers" ALTER COLUMN "until" DROP NOT NULL;
  ALTER TABLE "offers" ADD COLUMN "unlimited" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "offers" ALTER COLUMN "until" SET NOT NULL;
  ALTER TABLE "offers" DROP COLUMN "unlimited";`)
}
