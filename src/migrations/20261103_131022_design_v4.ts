import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Design round 4 (2026-11-03): property page, complaint documents section, car insurance phone and email,
   banner links to the merged "other information" page (old /privacy, /terms, /complaints links are moved there). */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_documents_section" ADD VALUE 'complaints';
  ALTER TYPE "public"."enum_products_page_path" ADD VALUE '/property';
  ALTER TABLE "banners" ALTER COLUMN "link_page" SET DATA TYPE text;
  UPDATE "banners" SET "link_page" = CASE "link_page" WHEN '/privacy' THEN '/other' WHEN '/terms' THEN '/other#terms' ELSE '/other#complaints' END
    WHERE "link_page" IN ('/privacy', '/terms', '/complaints');
  DROP TYPE "public"."enum_banners_link_page";
  CREATE TYPE "public"."enum_banners_link_page" AS ENUM('/', '/#products', '/health', '/travel', '/car', '/property', '/offers', '/news', '/about', '/contact', '/legal', '/financial', '/other', '/other#terms', '/other#complaints');
  ALTER TABLE "banners" ALTER COLUMN "link_page" SET DATA TYPE "public"."enum_banners_link_page" USING "link_page"::"public"."enum_banners_link_page";
  ALTER TABLE "settings" ADD COLUMN "car_phone" varchar DEFAULT '+995 32 280 10 01';
  ALTER TABLE "settings" ADD COLUMN "car_email" varchar DEFAULT 'info@taoinsurance.ge';
  ALTER TABLE "settings" ADD COLUMN "car_phone_href" varchar DEFAULT '+995322801001';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "banners" ALTER COLUMN "link_page" SET DATA TYPE text;
  UPDATE "banners" SET "link_page" = CASE "link_page" WHEN '/other' THEN '/privacy' WHEN '/other#terms' THEN '/terms' WHEN '/other#complaints' THEN '/complaints' ELSE '/' END
    WHERE "link_page" IN ('/other', '/other#terms', '/other#complaints', '/property');
  DROP TYPE "public"."enum_banners_link_page";
  CREATE TYPE "public"."enum_banners_link_page" AS ENUM('/', '/#products', '/health', '/travel', '/car', '/offers', '/news', '/about', '/contact', '/legal', '/financial', '/complaints', '/privacy', '/terms');
  ALTER TABLE "banners" ALTER COLUMN "link_page" SET DATA TYPE "public"."enum_banners_link_page" USING "link_page"::"public"."enum_banners_link_page";
  ALTER TABLE "documents" ALTER COLUMN "section" SET DATA TYPE text;
  ALTER TABLE "documents" ALTER COLUMN "section" SET DEFAULT 'legal'::text;
  DROP TYPE "public"."enum_documents_section";
  CREATE TYPE "public"."enum_documents_section" AS ENUM('legal', 'financial');
  ALTER TABLE "documents" ALTER COLUMN "section" SET DEFAULT 'legal'::"public"."enum_documents_section";
  ALTER TABLE "documents" ALTER COLUMN "section" SET DATA TYPE "public"."enum_documents_section" USING "section"::"public"."enum_documents_section";
  ALTER TABLE "products" ALTER COLUMN "page_path" SET DATA TYPE text;
  DROP TYPE "public"."enum_products_page_path";
  CREATE TYPE "public"."enum_products_page_path" AS ENUM('/health', '/travel', '/car');
  ALTER TABLE "products" ALTER COLUMN "page_path" SET DATA TYPE "public"."enum_products_page_path" USING "page_path"::"public"."enum_products_page_path";
  ALTER TABLE "settings" DROP COLUMN "car_phone";
  ALTER TABLE "settings" DROP COLUMN "car_email";
  ALTER TABLE "settings" DROP COLUMN "car_phone_href";`)
}
