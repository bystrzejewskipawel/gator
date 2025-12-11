import { XMLParser } from "fast-xml-parser";
import { Feed, User, feeds } from "src/schema.js";
import { db } from "src/lib/db/index.js";
import { sql, eq } from 'drizzle-orm';
import { date } from "drizzle-orm/mysql-core";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, { headers: {'User-Agent': 'gator'}});
    const responseText = await response.text();
    const parser = new XMLParser();
    const feedObj: RSSFeed = parser.parse(responseText)["rss"];

    //console.log(feedObj);
    if (!("channel" in feedObj)) {
        throw new Error("Channel field is missing");
    }

    return feedObj;
}

export async function addFeed(name: string, url: string, user_id: string) {
    const [result] = await db.insert(feeds).values({ name: name, url: url, user_id: user_id }).returning();
    return result;
}

export async function getFeeds() {
    const result = await db.select().from(feeds);
    return result;
}

export async function getFeedByUrl(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url,url));
    return result;
}

export async function printFeed(feed: Feed, user: User) {
  console.log(feed.name);
  console.log(user.name);
}

export async function markFeedFetched(feed: Feed) {
    const [result] = await db.update(feeds).set({ last_fetched_at: new Date()}).where(eq(feeds.id, feed.id)).returning();
    return result;  
}

export async function getNextFeedToFetch(): Promise<Feed> {
    const [result] = await db.select().from(feeds).orderBy(sql`${feeds.last_fetched_at} NULLS FIRST`);
    return result;  
}

export async function scrapeFeeds() {
  const latestFeed = await getNextFeedToFetch();
  await markFeedFetched(latestFeed);
  const rssFeed = await fetchFeed(latestFeed.url);
  for (let i = 0; i < rssFeed.channel.item.length; i++) {
      console.log(rssFeed.channel.item[i].title);
  }
}