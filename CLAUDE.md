# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SokaPulse is a Next.js 15+ football predictions website built with React 19, Bootstrap 5, and Tailwind CSS (limited scope). The application provides football predictions, jackpot predictions, match analysis, and team statistics with extensive SEO optimization and caching strategies.

## Development Commands

### Core Development
```bash
npm run dev              # Start development server with Turbopack
npm run build           # Production build with sitemap generation
npm run build:purge    # Production build with CSS purging
npm run start           # Start production server
npm run lint            # Run ESLint checks
npm run build:no-cache  # Build without Next.js cache
```

### Performance & Analysis
```bash
npm run analyze         # Bundle analysis (ANALYZE=true next build)
npm run lighthouse      # Lighthouse audit on localhost:3000
npm run lighthouse:mobile # Mobile Lighthouse audit
npm run audit           # Full audit: build, start server, lighthouse
```

### Security & Maintenance
```bash
npm run security:audit  # Check for dependency vulnerabilities
npm run security:lint   # Run linting for security
npm run security:check  # Custom security configuration check
```

### Sitemap Generation
```bash
npm run update-sitemaps          # Update all sitemaps
npm run update-country-sitemap   # Update country-specific sitemap
```

## Architecture Overview

### API Layer (`src/utils/api.js`)
- Centralized API functions with retry logic and timeout handling
- Dual API configuration: main API and Sportpesa API
- Client/server environment detection with different base URLs
- All API calls include authentication headers and error handling

### Component Structure
- **Server Components**: Used for SEO pages with metadata exports
- **Client Components**: Interactive UI with 'use client' directive  
- **Layout System**: Nested layouts for different page types
- **Context Providers**: Theme, Sidebar, and Translation contexts

### Page Organization
```
src/app/
├── (jackpot)/                    # Route group for jackpot pages
├── [football-prediction-for-date]/ # Dynamic date-based predictions
├── football-predictions/         # Main predictions section
├── predictions/                  # Bookmaker-specific predictions
└── jackpot-predictions/          # Jackpot predictions
```

### Styling Architecture
- **Bootstrap 5**: Main UI framework for components and layout
- **Tailwind CSS**: Limited to `src/components/PaymentForm/` with `tw-` prefix
- **Custom CSS**: Module-based styles in `src/styles/`
- **Theme System**: Dark/light mode with context management

## Key Configuration

### Environment Variables Required
```
NEXT_PUBLIC_API_BASE_URL      # Main API endpoint
NEXT_PUBLIC_API_KEY           # API authentication key
NEXT_PUBLIC_SPORTPESA_API_URL # Sportpesa API endpoint  
NEXT_PUBLIC_SPORTPESA_API_KEY # Sportpesa API key
```

### Security Features
- **CSP Configuration**: Comprehensive Content Security Policy in `next.config.js`
- **Middleware Security**: Cache headers, bot detection, basic auth for `/create-bet`
- **Security Monitoring**: CSP violation reporting to `/api/csp-report`
- **Authentication**: Basic auth middleware for sensitive routes

### Caching Strategy
- **Static Pages**: 24-hour cache for about, terms, contact pages
- **Dynamic Content**: 1-hour cache for predictions and live data
- **Bot Handling**: No cache for search engine crawlers
- **Image Optimization**: 24-hour TTL for external images

## Important Development Notes

### API Usage Patterns
- Always use API functions from `src/utils/api.js`
- Implement proper error handling and loading states
- Use pagination for large datasets (fixtures, predictions)
- Respect rate limits with built-in retry logic

### SEO Implementation
- **Metadata**: Use `src/data/seo/` for page-specific SEO data
- **Structured Data**: JSON-LD schema markup for rich snippets
- **Sitemaps**: Auto-generated for countries, teams, and leagues
- **Dynamic Routes**: SEO-friendly URLs with proper canonicalization

### Component Patterns
- **Lazy Loading**: Use `LazyContentMore.js` and similar patterns
- **Error Boundaries**: Implement graceful error handling
- **Loading States**: Consistent loading animations across components
- **Responsive Design**: Mobile-first approach with Bootstrap breakpoints

### Performance Considerations
- **Bundle Analysis**: Run `npm run analyze` before production deployments
- **CSS Purging**: Use `build:purge` for production to remove unused CSS
- **Image Optimization**: Leverage Next.js Image component with proper sizing
- **Code Splitting**: Implemented at route level for optimal loading

## Deployment Notes

- **Output**: Standalone build for containerized deployments
- **Environment**: Server/client environment detection for API calls
- **Monitoring**: CSP reporting and security headers configured
- **Health Checks**: `/api/diagnostic` endpoint available for monitoring