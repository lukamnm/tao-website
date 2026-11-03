import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Content that follows the fourth design round (2026-11-03). Kept apart from 20261103_131022_design_v4 because the
   new enum values ('/property', 'complaints') can only be used after the transaction that added them has finished.
   Every step only changes rows that still hold the old default values, so editors' own changes are kept,
   and on an empty database (a fresh AWS copy) the steps simply find nothing to change. */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Property insurance gets its own page: "ქონების კორპორატიული დაზღვევა"
  await db.execute(sql`
  UPDATE "products" SET "page_path" = '/property', "show_in_menu" = true WHERE "key" = 'property' AND "page_path" IS NULL;
  UPDATE "products" SET "icon" = 'building' WHERE "key" = 'property' AND "icon" = 'house';
  UPDATE "products_locales" l SET "name" = 'ქონების კორპორატიული დაზღვევა',
      "description" = 'ქონების დაზღვევა დაგეხმარებათ დაიცვათ თქვენი ბიზნესის კუთვნილი ქონება და უზრუნველყოფს თქვენს ფინანსურ სტაბილურობას'
    FROM "products" p WHERE p."id" = l."_parent_id" AND p."key" = 'property' AND l."_locale" = 'ka' AND l."name" = 'ქონების დაზღვევა';
  UPDATE "products_locales" l SET "name" = 'Corporate property insurance',
      "description" = 'Property insurance helps you protect your business property and ensures your financial stability'
    FROM "products" p WHERE p."id" = l."_parent_id" AND p."key" = 'property' AND l."_locale" = 'en' AND l."name" = 'Property insurance';`)

  // 2. Complaint documents move from "legal" to the new "complaints" section (the tab on the "other information" page)
  await db.execute(sql`
  UPDATE "documents" SET "section" = 'complaints'
    WHERE "section" = 'legal' AND "id" IN (SELECT "_parent_id" FROM "documents_locales" WHERE "title" ILIKE '%პრეტენზი%' OR "title" ILIKE '%complaint%');`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  UPDATE "documents" SET "section" = 'legal' WHERE "section" = 'complaints';
  UPDATE "products" SET "page_path" = NULL, "show_in_menu" = false WHERE "key" = 'property' AND "page_path" = '/property';`)
}
