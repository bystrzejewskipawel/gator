import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';

export type Feed = typeof feeds.$inferSelect; // feeds is the table object in schema.ts
export type User = typeof users.$inferSelect; // feeds is the table object in schema.ts
export type FeedFollows = typeof feed_follows.$inferSelect; // feeds is the table object in schema.ts

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  url: text("url").notNull().unique(),
  user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  last_fetched_at: timestamp("last_fetched_at").default(sql`null`).$type<Date | null>(),
});

export const feed_follows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  user_id: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  feed_id: uuid("feed_id").references(() => feeds.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [
  unique().on(t.user_id, t.feed_id),
  unique('uc_feed_follows').on(t.user_id, t.feed_id)
]);