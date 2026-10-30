import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_banners_link_page" ADD VALUE '/car' BEFORE '/offers';
  ALTER TYPE "public"."enum_products_page_path" ADD VALUE '/car';
  CREATE TABLE "settings_service_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" varchar NOT NULL
  );
  
  CREATE TABLE "settings_service_hours_locales" (
  	"days" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "settings" ALTER COLUMN "phone" SET DEFAULT '+995 32 219 52 12';
  ALTER TABLE "settings" ALTER COLUMN "email" SET DEFAULT 'contact@taoinsurance.ge';
  ALTER TABLE "settings" ALTER COLUMN "phone_href" SET DEFAULT '+995322195212';
  ALTER TABLE "offers" ADD COLUMN "online" boolean DEFAULT false;
  ALTER TABLE "settings" ADD COLUMN "service_map_url" varchar;
  ALTER TABLE "settings_locales" ADD COLUMN "service_address" varchar DEFAULT 'შალვა ნუცუბიძის ქ. 72, 0186 თბილისი';
  ALTER TABLE "settings_locales" ADD COLUMN "service_address_short" varchar DEFAULT 'შალვა ნუცუბიძის ქ. 72';
  ALTER TABLE "settings_locales" ADD COLUMN "service_city" varchar DEFAULT '0186 თბილისი';
  ALTER TABLE "settings_service_hours" ADD CONSTRAINT "settings_service_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_service_hours_locales" ADD CONSTRAINT "settings_service_hours_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings_service_hours"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "settings_service_hours_order_idx" ON "settings_service_hours" USING btree ("_order");
  CREATE INDEX "settings_service_hours_parent_id_idx" ON "settings_service_hours" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "settings_service_hours_locales_locale_parent_id_unique" ON "settings_service_hours_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "settings_service_hours_locales_parent_id_idx" ON "settings_service_hours_locales" USING btree ("_parent_id");
  ALTER TABLE "banners_locales" DROP COLUMN "kicker";
  ALTER TABLE "settings" DROP COLUMN "instagram";
  ALTER TABLE "settings" DROP COLUMN "linkedin";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_service_hours" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_service_hours_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "settings_service_hours" CASCADE;
  DROP TABLE "settings_service_hours_locales" CASCADE;
  ALTER TABLE "banners" ALTER COLUMN "link_page" SET DATA TYPE text;
  DROP TYPE "public"."enum_banners_link_page";
  CREATE TYPE "public"."enum_banners_link_page" AS ENUM('/', '/#products', '/health', '/travel', '/offers', '/news', '/about', '/contact', '/legal', '/financial', '/complaints', '/privacy', '/terms');
  ALTER TABLE "banners" ALTER COLUMN "link_page" SET DATA TYPE "public"."enum_banners_link_page" USING "link_page"::"public"."enum_banners_link_page";
  ALTER TABLE "products" ALTER COLUMN "page_path" SET DATA TYPE text;
  DROP TYPE "public"."enum_products_page_path";
  CREATE TYPE "public"."enum_products_page_path" AS ENUM('/health', '/travel');
  ALTER TABLE "products" ALTER COLUMN "page_path" SET DATA TYPE "public"."enum_products_page_path" USING "page_path"::"public"."enum_products_page_path";
  ALTER TABLE "settings" ALTER COLUMN "phone" SET DEFAULT '+995 32 280 10 01';
  ALTER TABLE "settings" ALTER COLUMN "email" SET DEFAULT 'info@taoinsurance.ge';
  ALTER TABLE "settings" ALTER COLUMN "phone_href" SET DEFAULT '+995322801001';
  ALTER TABLE "banners_locales" ADD COLUMN "kicker" varchar;
  ALTER TABLE "settings" ADD COLUMN "instagram" varchar;
  ALTER TABLE "settings" ADD COLUMN "linkedin" varchar;
  ALTER TABLE "offers" DROP COLUMN "online";
  ALTER TABLE "settings" DROP COLUMN "service_map_url";
  ALTER TABLE "settings_locales" DROP COLUMN "service_address";
  ALTER TABLE "settings_locales" DROP COLUMN "service_address_short";
  ALTER TABLE "settings_locales" DROP COLUMN "service_city";`)
}
