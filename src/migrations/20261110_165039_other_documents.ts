import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_documents_section" ADD VALUE 'privacy' BEFORE 'complaints';
  ALTER TYPE "public"."enum_documents_section" ADD VALUE 'other';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "documents" ALTER COLUMN "section" SET DATA TYPE text;
  ALTER TABLE "documents" ALTER COLUMN "section" SET DEFAULT 'legal'::text;
  DROP TYPE "public"."enum_documents_section";
  CREATE TYPE "public"."enum_documents_section" AS ENUM('legal', 'financial', 'complaints');
  ALTER TABLE "documents" ALTER COLUMN "section" SET DEFAULT 'legal'::"public"."enum_documents_section";
  ALTER TABLE "documents" ALTER COLUMN "section" SET DATA TYPE "public"."enum_documents_section" USING "section"::"public"."enum_documents_section";`)
}
