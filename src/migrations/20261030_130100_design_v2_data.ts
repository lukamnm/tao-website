import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/* Content that follows the second design round (2026-10-30). Kept apart from 20261030_130045_design_v2 because a
   new enum value ('/car') can only be used after the transaction that added it has finished.
   Every step only changes rows that still hold the old default values, so editors' own changes are kept,
   and on an empty database (a fresh AWS copy) the steps simply find nothing to change. */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. "ონლაინ" is no longer a city: it becomes the offer's own "მოქმედებს ონლაინ" switch
  await db.execute(sql`
  UPDATE "offers" SET "online" = true
    WHERE "id" IN (SELECT r."parent_id" FROM "offers_rels" r JOIN "cities" c ON c."id" = r."cities_id" WHERE c."key" = 'online');
  DELETE FROM "offers_rels" WHERE "cities_id" IN (SELECT "id" FROM "cities" WHERE "key" = 'online');
  DELETE FROM "cities" WHERE "key" = 'online';
  UPDATE "cities" SET "_order" = 'a' || s.rn FROM (SELECT "id", (row_number() OVER (ORDER BY "_order") - 1) AS rn FROM "cities") s WHERE s."id" = "cities"."id";`)

  // 2. Car insurance now has its own page: "ავტომობილის კორპორატიული დაზღვევა"
  await db.execute(sql`
  UPDATE "products" SET "page_path" = '/car', "show_in_menu" = true WHERE "key" = 'car' AND "page_path" IS NULL;
  UPDATE "products_locales" l SET "name" = 'ავტომობილის კორპორატიული დაზღვევა',
      "description" = 'კომპანიის ავტოპარკის დაცვა დაზიანების, ქურდობისა და მესამე პირის მიმართ პასუხისმგებლობისგან'
    FROM "products" p WHERE p."id" = l."_parent_id" AND p."key" = 'car' AND l."_locale" = 'ka' AND l."name" = 'ავტოდაზღვევა';
  UPDATE "products_locales" l SET "name" = 'Corporate motor insurance',
      "description" = 'Protection for your company fleet against damage, theft and third-party liability'
    FROM "products" p WHERE p."id" = l."_parent_id" AND p."key" = 'car' AND l."_locale" = 'en' AND l."name" = 'Car insurance';
  UPDATE "products_locales" SET "description" = left("description", -1)
    WHERE "description" IN ('ექიმი, კვლევები და სტაციონარი ერთ პოლისში.', 'სამედიცინო დაფარვა საზღვარგარეთ.', 'Doctor, tests and hospital in one policy.', 'Medical cover abroad.');`)

  // 3. News categories: პროვაიდერები, სერვისები, პორტალი / აპი, კომპანია
  await db.execute(sql`
  UPDATE "news_categories" SET "key" = 'providers', "_order" = 'a0' WHERE "key" = 'partners';
  UPDATE "news_categories" SET "key" = 'services', "_order" = 'a1' WHERE "key" = 'products';
  UPDATE "news_categories" SET "key" = 'portal', "_order" = 'a2' WHERE "key" = 'campaigns';
  UPDATE "news_categories" SET "_order" = 'a3' WHERE "key" = 'company';
  UPDATE "news_categories_locales" l SET "name" = v.name FROM (VALUES
    ('providers', 'ka', 'პარტნიორობა', 'პროვაიდერები'), ('providers', 'en', 'Partnerships', 'Providers'),
    ('services', 'ka', 'პროდუქტები', 'სერვისები'), ('services', 'en', 'Products', 'Services'),
    ('portal', 'ka', 'კამპანიები', 'პორტალი / აპი'), ('portal', 'en', 'Campaigns', 'Portal / app')
  ) AS v(key, loc, old, name), "news_categories" c
    WHERE c."id" = l."_parent_id" AND c."key" = v.key AND l."_locale"::text = v.loc AND l."name" = v.old;
  UPDATE "news" n SET "category_id" = c."id" FROM (VALUES
    ('clinic-network', 'providers'), ('assistance-partner', 'providers'),
    ('before-you-travel', 'services'), ('schengen-policy', 'services'), ('service-standard', 'services'),
    ('family-package', 'services'), ('small-business', 'services'), ('summer-campaign', 'services'),
    ('health-online', 'portal'), ('claims-portal', 'portal'),
    ('new-look', 'company'), ('marathon', 'company'), ('year-results', 'company')
  ) AS v(slug, key), "news_categories" c WHERE n."slug" = v.slug AND c."key" = v.key;`)

  // 4. New hotline and e-mail, and the service centre's opening hours
  await db.execute(sql`
  UPDATE "settings" SET "phone" = '+995 32 219 52 12', "phone_href" = '+995322195212' WHERE "phone" = '+995 32 280 10 01';
  UPDATE "settings" SET "email" = 'contact@taoinsurance.ge' WHERE "email" = 'info@taoinsurance.ge';
  INSERT INTO "settings_service_hours" ("_order", "_parent_id", "id", "time")
    SELECT v.ord, s."id", v.id, v.time FROM "settings" s, (VALUES
      (1, 'svc-hours-weekdays', '9:00 - 18:00'), (2, 'svc-hours-saturday', '9:30 - 14:00')
    ) AS v(ord, id, time)
    WHERE NOT EXISTS (SELECT 1 FROM "settings_service_hours");
  INSERT INTO "settings_service_hours_locales" ("days", "_locale", "_parent_id")
    SELECT v.days, v.loc::"_locales", v.id FROM (VALUES
      ('svc-hours-weekdays', 'ka', 'ორშაბათი - პარასკევი'), ('svc-hours-weekdays', 'en', 'Monday - Friday'),
      ('svc-hours-saturday', 'ka', 'შაბათი'), ('svc-hours-saturday', 'en', 'Saturday')
    ) AS v(id, loc, days)
    WHERE EXISTS (SELECT 1 FROM "settings_service_hours" h WHERE h."id" = v.id)
      AND NOT EXISTS (SELECT 1 FROM "settings_service_hours_locales" x WHERE x."_parent_id" = v.id AND x."_locale"::text = v.loc);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Content changes are not undone; restore from a Neon backup branch if they ever need to be.
  await db.execute(sql`SELECT 1`)
}
