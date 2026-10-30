import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. New lists, tables and link columns
  await db.execute(sql`
   CREATE TYPE "public"."enum_banners_link_type" AS ENUM('page', 'offer', 'news', 'portal', 'url');
  CREATE TYPE "public"."enum_banners_link_page" AS ENUM('/', '/#products', '/health', '/travel', '/offers', '/news', '/about', '/contact', '/legal', '/financial', '/complaints', '/privacy', '/terms');
  CREATE TYPE "public"."enum_pages_slug" AS ENUM('privacy', 'terms', 'complaints');
  CREATE TYPE "public"."enum_products_page_path" AS ENUM('/health', '/travel');
  CREATE TABLE "offers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"cities_id" integer
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"icon" varchar DEFAULT 'shield-tick' NOT NULL,
  	"page_path" "enum_products_page_path",
  	"show_in_menu" boolean DEFAULT false,
  	"portal_url" varchar,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_locales" (
  	"name" varchar NOT NULL,
  	"short_name" varchar,
  	"menu_text" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "offer_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "offer_categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cities_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "documents" ALTER COLUMN "doc_type" SET DATA TYPE text;
  ALTER TABLE "documents" ALTER COLUMN "doc_type" SET DEFAULT 'terms'::text;
  DROP TYPE "public"."enum_documents_doc_type";
  CREATE TYPE "public"."enum_documents_doc_type" AS ENUM('terms', 'sheet', 'sample', 'other', 'annual', 'quarterly');
  ALTER TABLE "documents" ALTER COLUMN "doc_type" SET DEFAULT 'terms'::"public"."enum_documents_doc_type";
  ALTER TABLE "documents" ALTER COLUMN "doc_type" SET DATA TYPE "public"."enum_documents_doc_type" USING "doc_type"::"public"."enum_documents_doc_type";
  ALTER TABLE "pages" ALTER COLUMN "slug" SET DATA TYPE "public"."enum_pages_slug" USING "slug"::"public"."enum_pages_slug";
  ALTER TABLE "banners" ADD COLUMN "_order" varchar;
  ALTER TABLE "banners" ADD COLUMN "link_type" "enum_banners_link_type" DEFAULT 'page';
  ALTER TABLE "banners" ADD COLUMN "link_page" "enum_banners_link_page";
  ALTER TABLE "banners" ADD COLUMN "link_offer_id" integer;
  ALTER TABLE "banners" ADD COLUMN "link_news_id" integer;
  ALTER TABLE "banners" ADD COLUMN "link_product_id" integer;
  ALTER TABLE "banners" ADD COLUMN "link_url" varchar;
  ALTER TABLE "offers" ADD COLUMN "product_id" integer;
  ALTER TABLE "offers" ADD COLUMN "category_id" integer;
  ALTER TABLE "news" ADD COLUMN "category_id" integer;
  ALTER TABLE "news" ADD COLUMN "product_id" integer;
  ALTER TABLE "documents" ADD COLUMN "product_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "offer_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "cities_id" integer;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offers_rels" ADD CONSTRAINT "offers_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_categories_locales" ADD CONSTRAINT "news_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offer_categories_locales" ADD CONSTRAINT "offer_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offer_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cities_locales" ADD CONSTRAINT "cities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "offers_rels_order_idx" ON "offers_rels" USING btree ("order");
  CREATE INDEX "offers_rels_parent_idx" ON "offers_rels" USING btree ("parent_id");
  CREATE INDEX "offers_rels_path_idx" ON "offers_rels" USING btree ("path");
  CREATE INDEX "offers_rels_cities_id_idx" ON "offers_rels" USING btree ("cities_id");
  CREATE INDEX "products__order_idx" ON "products" USING btree ("_order");
  CREATE UNIQUE INDEX "products_key_idx" ON "products" USING btree ("key");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "news_categories__order_idx" ON "news_categories" USING btree ("_order");
  CREATE UNIQUE INDEX "news_categories_key_idx" ON "news_categories" USING btree ("key");
  CREATE INDEX "news_categories_updated_at_idx" ON "news_categories" USING btree ("updated_at");
  CREATE INDEX "news_categories_created_at_idx" ON "news_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_categories_locales_locale_parent_id_unique" ON "news_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "news_categories_locales_parent_id_idx" ON "news_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "offer_categories__order_idx" ON "offer_categories" USING btree ("_order");
  CREATE UNIQUE INDEX "offer_categories_key_idx" ON "offer_categories" USING btree ("key");
  CREATE INDEX "offer_categories_updated_at_idx" ON "offer_categories" USING btree ("updated_at");
  CREATE INDEX "offer_categories_created_at_idx" ON "offer_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "offer_categories_locales_locale_parent_id_unique" ON "offer_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offer_categories_locales_parent_id_idx" ON "offer_categories_locales" USING btree ("_parent_id");
  CREATE INDEX "cities__order_idx" ON "cities" USING btree ("_order");
  CREATE UNIQUE INDEX "cities_key_idx" ON "cities" USING btree ("key");
  CREATE INDEX "cities_updated_at_idx" ON "cities" USING btree ("updated_at");
  CREATE INDEX "cities_created_at_idx" ON "cities" USING btree ("created_at");
  CREATE UNIQUE INDEX "cities_locales_locale_parent_id_unique" ON "cities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cities_locales_parent_id_idx" ON "cities_locales" USING btree ("_parent_id");
  ALTER TABLE "banners" ADD CONSTRAINT "banners_link_offer_id_offers_id_fk" FOREIGN KEY ("link_offer_id") REFERENCES "public"."offers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "banners" ADD CONSTRAINT "banners_link_news_id_news_id_fk" FOREIGN KEY ("link_news_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "banners" ADD CONSTRAINT "banners_link_product_id_products_id_fk" FOREIGN KEY ("link_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "offers" ADD CONSTRAINT "offers_category_id_offer_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."offer_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_category_id_news_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."news_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offer_categories_fk" FOREIGN KEY ("offer_categories_id") REFERENCES "public"."offer_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cities_fk" FOREIGN KEY ("cities_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "banners__order_idx" ON "banners" USING btree ("_order");
  CREATE INDEX "banners_link_link_offer_idx" ON "banners" USING btree ("link_offer_id");
  CREATE INDEX "banners_link_link_news_idx" ON "banners" USING btree ("link_news_id");
  CREATE INDEX "banners_link_link_product_idx" ON "banners" USING btree ("link_product_id");
  CREATE INDEX "offers_product_idx" ON "offers" USING btree ("product_id");
  CREATE INDEX "offers_category_idx" ON "offers" USING btree ("category_id");
  CREATE INDEX "news_category_idx" ON "news" USING btree ("category_id");
  CREATE INDEX "news_product_idx" ON "news" USING btree ("product_id");
  CREATE INDEX "documents_product_idx" ON "documents" USING btree ("product_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_news_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("news_categories_id");
  CREATE INDEX "payload_locked_documents_rels_offer_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("offer_categories_id");
  CREATE INDEX "payload_locked_documents_rels_cities_id_idx" ON "payload_locked_documents_rels" USING btree ("cities_id");`)

  // 2. Default lists + copy of every existing value into the new links
  await db.execute(sql`
  -- Default lists (also created on a fresh database, e.g. AWS RDS)
  INSERT INTO "products" ("_order", "icon", "page_path", "show_in_menu", "key") VALUES
    ('a0', 'health', '/health', true, 'health'),
    ('a1', 'airplane', '/travel', true, 'travel'),
    ('a2', 'car', NULL, false, 'car'),
    ('a3', 'house', NULL, false, 'property');
  INSERT INTO "products_locales" ("name", "short_name", "menu_text", "description", "_locale", "_parent_id")
  SELECT v.name, v.short, v.menu, v.descr, v.loc::"_locales", p.id FROM (VALUES
    ('health', 'ka', 'ჯანმრთელობის დაზღვევა', 'ჯანმრთელობა', 'ექიმი, კვლევები, სტაციონარი', 'ექიმი, კვლევები და სტაციონარი ერთ პოლისში.'),
    ('health', 'en', 'Health insurance', 'Health', 'Doctor, tests, hospital', 'Doctor, tests and hospital in one policy.'),
    ('travel', 'ka', 'სამოგზაურო დაზღვევა', 'მოგზაურობა', 'სამედიცინო დაფარვა საზღვარგარეთ', 'სამედიცინო დაფარვა საზღვარგარეთ.'),
    ('travel', 'en', 'Travel insurance', 'Travel', 'Medical cover abroad', 'Medical cover abroad.'),
    ('car', 'ka', 'ავტოდაზღვევა', 'ავტო', NULL, 'ავტომობილის დაცვა ყოველდღიურად.'),
    ('car', 'en', 'Car insurance', 'Car', NULL, 'Protection for your car, every day.'),
    ('property', 'ka', 'ქონების დაზღვევა', 'ქონება', NULL, 'სახლი და ქონება, დაცული.'),
    ('property', 'en', 'Property insurance', 'Property', NULL, 'Home and property, protected.')
  ) AS v(key, loc, name, short, menu, descr) JOIN "products" p ON p.key = v.key;

  INSERT INTO "news_categories" ("_order", "key") VALUES ('a0', 'company'), ('a1', 'products'), ('a2', 'campaigns'), ('a3', 'partners');
  INSERT INTO "news_categories_locales" ("name", "_locale", "_parent_id")
  SELECT v.name, v.loc::"_locales", c.id FROM (VALUES
    ('company', 'ka', 'კომპანია'), ('company', 'en', 'Company'),
    ('products', 'ka', 'პროდუქტები'), ('products', 'en', 'Products'),
    ('campaigns', 'ka', 'კამპანიები'), ('campaigns', 'en', 'Campaigns'),
    ('partners', 'ka', 'პარტნიორობა'), ('partners', 'en', 'Partnerships')
  ) AS v(key, loc, name) JOIN "news_categories" c ON c.key = v.key;

  INSERT INTO "offer_categories" ("_order", "key") VALUES ('a0', 'medical'), ('a1', 'pharmacy'), ('a2', 'sport'), ('a3', 'trip');
  INSERT INTO "offer_categories_locales" ("name", "_locale", "_parent_id")
  SELECT v.name, v.loc::"_locales", c.id FROM (VALUES
    ('medical', 'ka', 'კლინიკა და ლაბორატორია'), ('medical', 'en', 'Clinic and laboratory'),
    ('pharmacy', 'ka', 'აფთიაქი და ოპტიკა'), ('pharmacy', 'en', 'Pharmacy and optics'),
    ('sport', 'ka', 'სპორტი და ფიტნესი'), ('sport', 'en', 'Sport and fitness'),
    ('trip', 'ka', 'მოგზაურობა'), ('trip', 'en', 'Travel')
  ) AS v(key, loc, name) JOIN "offer_categories" c ON c.key = v.key;

  INSERT INTO "cities" ("_order", "key") VALUES ('a0', 'online'), ('a1', 'tbilisi'), ('a2', 'batumi'), ('a3', 'kutaisi');
  INSERT INTO "cities_locales" ("name", "_locale", "_parent_id")
  SELECT v.name, v.loc::"_locales", c.id FROM (VALUES
    ('online', 'ka', 'ონლაინ'), ('online', 'en', 'Online'),
    ('tbilisi', 'ka', 'თბილისი'), ('tbilisi', 'en', 'Tbilisi'),
    ('batumi', 'ka', 'ბათუმი'), ('batumi', 'en', 'Batumi'),
    ('kutaisi', 'ka', 'ქუთაისი'), ('kutaisi', 'en', 'Kutaisi')
  ) AS v(key, loc, name) JOIN "cities" c ON c.key = v.key;

  -- Copy existing values into the new links
  UPDATE "offers" o SET "product_id" = p.id FROM "products" p WHERE p.key = o."product"::text;
  UPDATE "offers" o SET "category_id" = c.id FROM "offer_categories" c WHERE c.key = o."category"::text;
  INSERT INTO "offers_rels" ("order", "parent_id", "path", "cities_id")
    SELECT oc."order", oc."parent_id", 'cities', c.id FROM "offers_cities" oc JOIN "cities" c ON c.key = oc."value"::text;
  UPDATE "news" n SET "category_id" = c.id FROM "news_categories" c WHERE c.key = n."category"::text;
  UPDATE "news" n SET "product_id" = p.id FROM "products" p WHERE p.key = n."product"::text;
  UPDATE "documents" d SET "product_id" = p.id FROM "products" p WHERE p.key = d."product"::text;

  -- Per-product portal links move from the settings onto the products
  UPDATE "products" p SET "portal_url" = CASE p.key WHEN 'health' THEN s."portal_health_url" WHEN 'travel' THEN s."portal_travel_url" WHEN 'car' THEN s."portal_car_url" WHEN 'property' THEN s."portal_property_url" END FROM "settings" s;

  -- Banners: drag-and-drop order from the old number, and the typed address becomes a link choice
  UPDATE "banners" b SET "_order" = 'a' || s.rn FROM (SELECT id, (row_number() OVER (ORDER BY "order", id) - 1) AS rn FROM "banners") s WHERE s.id = b.id;
  UPDATE "banners" SET "link_type" = 'page', "link_page" = "href"::"enum_banners_link_page"
    WHERE "href" IN ('/', '/#products', '/health', '/travel', '/offers', '/news', '/about', '/contact', '/legal', '/financial', '/complaints', '/privacy', '/terms');
  UPDATE "banners" b SET "link_type" = 'offer', "link_offer_id" = o.id FROM "offers" o WHERE b."href" = '/offers/' || o."slug";
  UPDATE "banners" b SET "link_type" = 'news', "link_news_id" = n.id FROM "news" n WHERE b."href" = '/news/' || n."slug";
  UPDATE "banners" SET "link_type" = 'portal' WHERE "href" = 'portal' OR "href" LIKE 'portal:%';
  UPDATE "banners" SET "link_type" = 'url', "link_url" = "href" WHERE "href" LIKE 'http%';
`)

  // 3. Remove the old columns, tables and types
  await db.execute(sql`  ALTER TABLE "offers_cities" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "offers_cities" CASCADE;
  ALTER TABLE "banners" DROP COLUMN "href";
  ALTER TABLE "banners" DROP COLUMN "order";
  ALTER TABLE "offers" DROP COLUMN "product";
  ALTER TABLE "offers" DROP COLUMN "category";
  ALTER TABLE "offers" DROP COLUMN "order";
  ALTER TABLE "news" DROP COLUMN "category";
  ALTER TABLE "news" DROP COLUMN "product";
  ALTER TABLE "documents" DROP COLUMN "product";
  ALTER TABLE "documents" DROP COLUMN "order";
  ALTER TABLE "settings" DROP COLUMN "portal_health_url";
  ALTER TABLE "settings" DROP COLUMN "portal_travel_url";
  ALTER TABLE "settings" DROP COLUMN "portal_car_url";
  ALTER TABLE "settings" DROP COLUMN "portal_property_url";
  DROP TYPE "public"."enum_offers_cities";
  DROP TYPE "public"."enum_offers_product";
  DROP TYPE "public"."enum_offers_category";
  DROP TYPE "public"."enum_news_category";
  DROP TYPE "public"."enum_news_product";
  DROP TYPE "public"."enum_documents_product";`)

  // 4. Required links: stops (and rolls back) if anything was left without a value
  await db.execute(sql`
  ALTER TABLE "offers" ALTER COLUMN "product_id" SET NOT NULL;
  ALTER TABLE "news" ALTER COLUMN "category_id" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_offers_cities" AS ENUM('online', 'tbilisi', 'batumi', 'kutaisi');
  CREATE TYPE "public"."enum_offers_product" AS ENUM('health', 'travel', 'car', 'property');
  CREATE TYPE "public"."enum_offers_category" AS ENUM('medical', 'pharmacy', 'sport', 'trip');
  CREATE TYPE "public"."enum_news_category" AS ENUM('company', 'products', 'campaigns', 'partners');
  CREATE TYPE "public"."enum_news_product" AS ENUM('health', 'travel', 'car', 'property');
  CREATE TYPE "public"."enum_documents_product" AS ENUM('general', 'health', 'travel', 'car', 'property');
  CREATE TABLE "offers_cities" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_offers_cities",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "offers_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offer_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "offer_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cities_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "offers_rels" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "news_categories" CASCADE;
  DROP TABLE "news_categories_locales" CASCADE;
  DROP TABLE "offer_categories" CASCADE;
  DROP TABLE "offer_categories_locales" CASCADE;
  DROP TABLE "cities" CASCADE;
  DROP TABLE "cities_locales" CASCADE;
  ALTER TABLE "news" DROP CONSTRAINT "news_category_id_news_categories_id_fk";
  
  ALTER TABLE "news" DROP CONSTRAINT "news_product_id_products_id_fk";
  
  ALTER TABLE "offers" DROP CONSTRAINT "offers_product_id_products_id_fk";
  
  ALTER TABLE "offers" DROP CONSTRAINT "offers_category_id_offer_categories_id_fk";
  
  ALTER TABLE "banners" DROP CONSTRAINT "banners_link_offer_id_offers_id_fk";
  
  ALTER TABLE "banners" DROP CONSTRAINT "banners_link_news_id_news_id_fk";
  
  ALTER TABLE "banners" DROP CONSTRAINT "banners_link_product_id_products_id_fk";
  
  ALTER TABLE "documents" DROP CONSTRAINT "documents_product_id_products_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_offer_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_cities_fk";
  
  ALTER TABLE "documents" ALTER COLUMN "doc_type" SET DATA TYPE text;
  ALTER TABLE "documents" ALTER COLUMN "doc_type" SET DEFAULT 'terms'::text;
  DROP TYPE "public"."enum_documents_doc_type";
  CREATE TYPE "public"."enum_documents_doc_type" AS ENUM('terms', 'sheet', 'sample', 'annual', 'quarterly', 'other');
  ALTER TABLE "documents" ALTER COLUMN "doc_type" SET DEFAULT 'terms'::"public"."enum_documents_doc_type";
  ALTER TABLE "documents" ALTER COLUMN "doc_type" SET DATA TYPE "public"."enum_documents_doc_type" USING "doc_type"::"public"."enum_documents_doc_type";
  DROP INDEX "news_category_idx";
  DROP INDEX "news_product_idx";
  DROP INDEX "offers_product_idx";
  DROP INDEX "offers_category_idx";
  DROP INDEX "banners__order_idx";
  DROP INDEX "banners_link_link_offer_idx";
  DROP INDEX "banners_link_link_news_idx";
  DROP INDEX "banners_link_link_product_idx";
  DROP INDEX "documents_product_idx";
  DROP INDEX "payload_locked_documents_rels_products_id_idx";
  DROP INDEX "payload_locked_documents_rels_news_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_offer_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_cities_id_idx";
  ALTER TABLE "pages" ALTER COLUMN "slug" SET DATA TYPE varchar;
  ALTER TABLE "news" ADD COLUMN "category" "enum_news_category" DEFAULT 'company' NOT NULL;
  ALTER TABLE "news" ADD COLUMN "product" "enum_news_product";
  ALTER TABLE "offers" ADD COLUMN "product" "enum_offers_product" NOT NULL;
  ALTER TABLE "offers" ADD COLUMN "category" "enum_offers_category";
  ALTER TABLE "offers" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "banners" ADD COLUMN "href" varchar NOT NULL;
  ALTER TABLE "banners" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "documents" ADD COLUMN "product" "enum_documents_product" DEFAULT 'general';
  ALTER TABLE "documents" ADD COLUMN "order" numeric DEFAULT 0;
  ALTER TABLE "settings" ADD COLUMN "portal_health_url" varchar;
  ALTER TABLE "settings" ADD COLUMN "portal_travel_url" varchar;
  ALTER TABLE "settings" ADD COLUMN "portal_car_url" varchar;
  ALTER TABLE "settings" ADD COLUMN "portal_property_url" varchar;
  ALTER TABLE "offers_cities" ADD CONSTRAINT "offers_cities_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "offers_cities_order_idx" ON "offers_cities" USING btree ("order");
  CREATE INDEX "offers_cities_parent_idx" ON "offers_cities" USING btree ("parent_id");
  ALTER TABLE "news" DROP COLUMN "category_id";
  ALTER TABLE "news" DROP COLUMN "product_id";
  ALTER TABLE "offers" DROP COLUMN "product_id";
  ALTER TABLE "offers" DROP COLUMN "category_id";
  ALTER TABLE "banners" DROP COLUMN "_order";
  ALTER TABLE "banners" DROP COLUMN "link_type";
  ALTER TABLE "banners" DROP COLUMN "link_page";
  ALTER TABLE "banners" DROP COLUMN "link_offer_id";
  ALTER TABLE "banners" DROP COLUMN "link_news_id";
  ALTER TABLE "banners" DROP COLUMN "link_product_id";
  ALTER TABLE "banners" DROP COLUMN "link_url";
  ALTER TABLE "documents" DROP COLUMN "product_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "products_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "offer_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "cities_id";
  DROP TYPE "public"."enum_banners_link_type";
  DROP TYPE "public"."enum_banners_link_page";
  DROP TYPE "public"."enum_pages_slug";
  DROP TYPE "public"."enum_products_page_path";`)
}
