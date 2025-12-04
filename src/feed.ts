import { XMLParser } from "fast-xml-parser";
import { Feed, User, feeds } from "src/schema.js";
import { db } from "src/lib/db/index.js";

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

export async function printFeed(feed: Feed, user: User) {
  console.log(feed);
  console.log(user);
}