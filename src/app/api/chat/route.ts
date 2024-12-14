// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer
import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
// import cheerio from 'cheerio';
import { load } from 'cheerio';
import puppeteer from 'puppeteer';
import parseBody from '../utils/catch_url';
import { scrapeUrl } from '../utils/scrapter';

export async function POST(req: Request) {
  try {
     // Step 1: Parse the request body
     const body = await req.json();
    //  console.log("message receiveing is ", body)
     console.log("Groq API key is ",process.env.GROQ_API_KEY)
     const { url, query } = await parseBody(body.message);
    //  console.log(`url is ${url}; query is ${query}`)
    // var error_msg="";
    if (!url && !query) {
      const error_msg="Both URL and query are missing. Please write both of them."
      console.warn(error_msg);
      return new NextResponse(JSON.stringify({ result: error_msg }), { status: 200 }); 
    } else if (!url) {
      const error_msg="URL is missing. Please add a url."
      console.warn("URL is missing. Processing with query only.");
      return new NextResponse(JSON.stringify({ result: error_msg }), { status: 200 }); 
    } else if (!query) {
      const error_msg="URL is missing. Please add a query."
      console.warn("Query is missing. Processing with URL only.");
      return new NextResponse(JSON.stringify({ result: error_msg }), { status: 200 }); 
    }

    // Step 2: Use Puppeteer to scrape the webpage
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const htmlContent = await page.content();
    await browser.close();

    // Step 3: Use Cheerio to parse the HTML
    const scraperResponse = await scrapeUrl(url);
    console.log("Scraped content:", scraperResponse);

    const  scrapedContent = scraperResponse.content || "No content available";
    // const $ = load(htmlContent); // Use 'load' from Cheerio
    // const extractedText = $('body').text(); // Extract text from the body tag
    // Step 4: Use the Groq SDK to process the query
    const prompt = `
      Answer my question: "${query}"
      Based on the following content:
      <content>
        ${scrapedContent}
      </content>
    `;
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY, // Replace with your actual API key
    });

    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: `${prompt}` }],
      model: 'llama3-8b-8192',
      // context: extractedText, 
    });
    // for debugging
    console.log("response from chat", chatCompletion.choices[0].message.content );


    // Step 5: Return the result
    return new NextResponse(JSON.stringify({ result: chatCompletion.choices[0].message.content }), { status: 200 });
  } catch (error) {

    console.error('Error in chat API:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
