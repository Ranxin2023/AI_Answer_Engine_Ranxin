# AI Answer Engine

## Introduction
This project is focused on building an **AI Answer Engine** using **Next.js** and **TypeScript** that integrates web scraping and intelligent content processing. The AI Answer Engine is designed to fetch and analyze content from websites while mitigating hallucinations by citing reliable sources in its responses.

Inspired by platforms like Perplexity.ai, a company valued at over $9 billion, this project combines cutting-edge web technologies with AI capabilities to create a powerful tool for answering user queries with precision and transparency.

The project’s goal is to deliver accurate and concise answers while providing context by linking to its sources, ensuring users can trust the information provided. For reference, you can explore an example of this kind of application here: https://www.webchat.so/.

## Features
1. **Web Scraping**:
    - The application scrapes content from web pages, extracting key information like titles, headings, and article text.
2. **Caching with Redis**:
    - Scraped data is cached to improve performance and reduce redundant requests.
3. **Rate Limiting**:
    - Using Upstash Redis, the app enforces fair usage by limiting requests to 5 per minute per user.
4. **AI Query Processing**:
    - The AI, powered by the Groq SDK, processes user queries and generates intelligent responses based on the scraped data.
5. **Responsive UI**:
    - The user interface is built with **Tailwind CSS**, offering a clean and responsive design for seamless interaction.
## Technologies Used
- **Next.js**: A React-based framework for building server-rendered and statically generated web applications.
- **TypeScript**: Adds type safety and enhances the development experience.
- **Axios**: A promise-based HTTP client used for fetching web content.
- **Cheerio**: Lightweight and fast library for parsing and extracting HTML content.
- **Redis**: Acts as a high-performance cache layer to store scraped content.
- **Upstash Redis**: A serverless Redis solution for rate limiting and caching.
- **Groq SDK**: An SDK for integrating AI language models to process and respond to user queries.
- **Tailwind CSS**: A utility-first CSS framework for designing a clean and responsive UI.
- **Puppeteer**: A Node.js library for headless browser automation to scrape web pages effectively.

## Cache Principles
Caching is implemented to improve performance and efficiency by reducing redundant network requests. Here are the core principles applied in this project:

1. Key-Based Caching:

    - Each URL is assigned a unique cache key to store its scraped content.
    - Keys are sanitized and truncated to ensure they are valid for Redis storage.
2. Time-to-Live (TTL):

    - Cached content is set with a specific expiration time (e.g., 1 hour) to ensure freshness and avoid stale data.
3. Cache Hit and Miss:

    - Cache Hit: If the requested content exists in Redis, it is retrieved directly, saving time and resources.
    - Cache Miss: If the content is not found, the scraper fetches the content, stores it in the cache, and then serves it to the user.
4. Content Normalization:

    - The scraped content is cleaned and normalized before being stored in the cache, ensuring consistency in responses.
5. Cache Eviction:

    - Expired or unused keys are automatically removed based on the TTL, ensuring optimal memory usage.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Prerequisites
1. Install Node.js (v16 or later).
2. Set up a Redis instance:
    - Use [Upstash Redis](https://upstash.com/) for a serverless solution.
    - Or install Redis locally by following the official Redis installation guide.


## Getting Started

1. First, clone the repository and install the dependencies:
```bash
git clone https://github.com/Ranxin2023/AI_Answer_Engine_Ranxin
```

2. Navigate to the project directory:
```bash
cd ai-answer-engine
```

3. Then, install the dependencies:

```bash
npm install
```

4. Then, run the development server:
```bash
npm run dev
```
5. Set Up Environment Variables: Create a `.env` file in the root directory and add the following variables:
    - Copy the `REST URL` and `TOKEN` provided by Upstash and add them to your `.env` file as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tasks

- Take a look at the TODOs throughout the repo, namely:

    - `src/app/page.tsx`: Update the UI and handle the API response as needed
 
    - `src/app/api/chat/route.ts`: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
 
    - `src/middleware.ts`: Implement the code here to add rate limiting with Redis



## Project Structure
```sh
├── src/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts    # API route for scraping and responding
│   ├── utils/
│   │   ├── scrape.ts       # Logic for web scraping
│   │   ├── cache.ts        # Redis caching functions
│   ├── page.ts             # User Interface of the AI Chat
│   ├── middleware.ts       # Middleware for rate limiting
├── .env.example            # Environment variables template
├── package.json            # Node.js dependencies
└── README.md               # Project documentation

```

## Future Improvements
- Add support for user authentication and request tracking.
- Enhance scraping logic for more structured content (e.g., tables).
- Implement pagination for long articles.
- Allow configurable rate limits based on API keys or user roles.