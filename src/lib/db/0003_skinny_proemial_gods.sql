ALTER TABLE "feed_follows" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feed_follows" ALTER COLUMN "feed_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "feeds" ALTER COLUMN "user_id" SET NOT NULL;