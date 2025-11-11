-- Create webauthn_challenges table for serverless compatibility
CREATE TABLE IF NOT EXISTS "webauthn_challenges" (
	"user_id" text PRIMARY KEY NOT NULL,
	"challenge" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS "webauthn_challenges_expires_at_idx" ON "webauthn_challenges" ("expires_at");
