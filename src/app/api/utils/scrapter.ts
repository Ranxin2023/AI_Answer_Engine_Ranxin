import axios from "axios";
import { load } from "cheerio";
import { Redis } from "@upstash/redis";
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  function getCacheKey(url: string): string {
    const sanitizedUrl = url.substring(0, 200); // Limit key length to 200 characters
    return `scrapes:${sanitizedUrl}`;
  }
export interface ScrapedContent {
    url: string;
    title: string;
    headings: {
      h1: string;
      h2: string;
    };
    metaDescription: string;
    content: string;
    error: string | null;
    cacheAt?: number; // Optional timestamp for cache
}
async function getCachedContent(url: string): Promise<ScrapedContent | null> {
    try {
      // Get the cache key
      const cacheKey = getCacheKey(url);
  
      console.info(`Checking cache for key: ${cacheKey}`);
  
      // Fetch the cached data from Redis
      const cached = await redis.get(cacheKey);
  
      if (!cached) {
        console.info(`Cache miss - No cached content found for: ${url}`);
        return null;
      }
  
      console.info(`Cache hit - Found cached content for: ${url}`);
  
      // Parse and return cached data
      // Redis returns strings, so handle parsing carefully
      const parsed: ScrapedContent =
        typeof cached === "string" ? JSON.parse(cached) : cached;
  
      return parsed;
    } catch (error) {
      console.error(`Error retrieving cache for URL ${url}:`, error);
      return null; // Fallback to null if an error occurs
    }
  }
export async function scrapeUrl(url: string) {
    const cachedContent = await getCachedContent(url);
  if (cachedContent) {
    return cachedContent; // Return cached content if available
  }
  try {
    // Fetch the page content using Axios
    const response = await axios.get(url);
    const html = response.data;

    // Load HTML into Cheerio
    const $ = load(html);

    // Extract specific content
    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const h1 = $("h1").text();
    const h2 = $("h2").text();
    const articleText = $("article").text();
    const mainText = $("main").text();
    const contentParagraphs = $("p")
      .map((_, el) => $(el).text())
      .get()
      .join(" ");
    const listItems = $("li")
      .map((_, el) => $(el).text())
      .get()
      .join(" ");

    // Combine all content
    let combinedContent = [
      title,
      metaDescription,
      articleText,
      mainText,
      contentParagraphs,
      listItems,
    ]
      .join(" ")
      .trim();

    // Truncate combined content to 10,000 characters if necessary
    combinedContent = cleanText(combinedContent.slice(0, 10000));

     // Create the result
     const result: ScrapedContent = {
        url,
        title: cleanText(title),
        headings: {
          h1: cleanText(h1),
          h2: cleanText(h2),
        },
        metaDescription: cleanText(metaDescription),
        content: combinedContent,
        error: null,
        cacheAt: Date.now(),
      };
  
      // Cache the result in Redis with a TTL (e.g., 1 hour = 3600 seconds)
      const cacheKey = getCacheKey(url);
      await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
  
      return result;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {
      url,
      title: null,
      headings: {
        h1: null,
        h2: null,
      },
      metaDescription: null,
      content: null,
      error: "Error scraping the URL.",
    };
  }
}

// Utility function to clean and normalize text
function cleanText(text: string | null): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}
