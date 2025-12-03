import { XMLParser } from "fast-xml-parser";


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