This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Environment Variables Setup

This project requires certain environment variables to function correctly. Follow these steps to set them up:

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in the appropriate values:
   - `NEXT_PUBLIC_API_BASE_URL`: The base URL for the API
   - `NEXT_PUBLIC_API_KEY`: Your API key

Note: `.env.local` is gitignored and won't be committed to the repository, keeping your secrets safe.

### Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Caching Implementation

The website uses a comprehensive caching strategy to improve performance and SEO:

### Configuration Files

- **next.config.mjs**: Contains image caching configuration, compression settings, and performance optimizations.
- **middleware.js**: Adds cache control headers for non-API routes while ensuring API routes remain uncached.
- **robots.js**: Guides search engine crawlers and prevents crawling of API routes.
- **sitemap.js**: Dynamically generates a sitemap with appropriate change frequencies.

### Caching Utility

The `src/utils/caching.js` file provides utilities for different caching strategies:

- **Static Page Caching**: For pages that rarely change (about-us, terms, etc.)
- **Dynamic Page Caching**: For frequently updated pages (match predictions, live scores)
- **API Route Protection**: Prevents caching of API routes
- **Client-side Utilities**: Safe methods for client component caching

### Implementation Rules

1. **Server Components**: Use metadata exports and route segment config only in server components.
   ```javascript
   export const metadata = getStaticPageMetadata({...});
   export const dynamic = 'force-static';
   export const revalidate = 86400; // daily
   ```

2. **Client Components**: Don't use metadata exports in files with 'use client' directive.

3. **Layout Files**: Use layout files for adding metadata to client component pages.

4. **Static vs Dynamic**: Choose the appropriate caching strategy based on content:
   - Static: About, Terms, Contact (86400 seconds / 24 hours)
   - Dynamic: Predictions, Live Scores (3600 seconds / 1 hour)

### Browser Cache Headers

The middleware adds appropriate cache headers:
- `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400`
- `Vary: User-Agent`

These settings ensure that browsers and CDNs cache content appropriately while maintaining freshness.
