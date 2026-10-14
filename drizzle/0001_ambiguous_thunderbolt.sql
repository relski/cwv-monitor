CREATE TABLE "checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer NOT NULL,
	"strategy" text NOT NULL,
	"field_source" text,
	"field_lcp" real,
	"field_inp" real,
	"field_cls" real,
	"lab_lcp" real,
	"lab_cls" real,
	"lab_tbt" real,
	"perf_score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "checks" ADD CONSTRAINT "checks_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;