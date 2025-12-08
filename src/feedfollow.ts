import { db } from "src/lib/db/index.js";
import { feed_follows, Feed, users, feeds, User } from "src/schema.js";
import { sql, eq, getTableColumns, and } from 'drizzle-orm';

export async function createFeedFollow(feed: Feed, user: User) {
  const [newFeedFollow] = await db.insert(feed_follows).values({ feed_id: feed.id, user_id: user.id }).returning();
  const result = await db.select({...getTableColumns(feed_follows), userName: users.name, feedName: feeds.name}).from(feed_follows).innerJoin(users, eq(users.id, feed_follows.user_id)).innerJoin(feeds, eq(feeds.id, feed_follows.feed_id));
  return result;
}

export async function getFeedFollowsForUser(user: User) {
  const result = await db.select({...getTableColumns(feed_follows), userName: users.name, feedName: feeds.name}).from(feed_follows).innerJoin(users, eq(users.id, feed_follows.user_id)).innerJoin(feeds, eq(feeds.id, feed_follows.feed_id)).where(eq(users.id, user.id));
  return result;
}

export async function deleteFeedFollow(user: User, feed: Feed) {
  const result = await db.delete(feed_follows).where(and(eq(feed_follows.user_id, user.id), eq(feed_follows.feed_id, feed.id)));
  return result;
}
