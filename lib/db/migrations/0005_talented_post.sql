CREATE TYPE "public"."attendance_method" AS ENUM('qr_code', 'fingerprint', 'both');--> statement-breakpoint
CREATE TABLE "authenticators" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"credential_id" text NOT NULL,
	"public_key" text NOT NULL,
	"counter" integer NOT NULL,
	"transports" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "authenticators_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "attendance_method" "attendance_method" DEFAULT 'qr_code';--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "fingerprint_match_score" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "preferred_attendance_method" "attendance_method" DEFAULT 'qr_code';--> statement-breakpoint
ALTER TABLE "workers" ADD COLUMN "fingerprint_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;