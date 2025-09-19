/**
 * Caching utility functions for improving website performance
 * These functions can be imported and used in layout.js or page.js files
 */

/**
 * Returns metadata with appropriate caching headers for static pages
 * Use this for pages that don't change frequently (about, terms, etc.)
 * IMPORTANT: Only use in server components (not in files with 'use client')
 */
export function getStaticPageMetadata(metadata = {}) {
  return {
    ...metadata,
    // Cache static pages for 1 day
    metadataBase: new URL('https://sokapulse.com'),
    alternates: {
      canonical: '/',
    },
   
    // Cache control directives
    other: {
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400',
    },
  };
}

/**
 * Returns metadata with appropriate caching headers for dynamic pages
 * Use this for pages that change more frequently (match predictions, live scores)
 * IMPORTANT: Only use in server components (not in files with 'use client')
 */
export function getDynamicPageMetadata(metadata = {}) {
  return {
    ...metadata,
    // Cache dynamic pages for 1 hour
    metadataBase: new URL('https://sokapulse.com'),
    alternates: {
      canonical: '/',
    },
    // Adding other SEO-friendly metadata
    verification: {
      google: 'google-site-verification=your-verification-code', // Replace with your verification code
    },
    // Cache control directives
    other: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600',
    },
  };
}

/**
 * Returns metadata for API routes - no caching
 * Use this for API routes that should not be cached
 * IMPORTANT: Only use in server components (not in files with 'use client')
 */
export function getApiRouteMetadata(metadata = {}) {
  return {
    ...metadata,
    // Prevent caching of API routes
    other: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  };
}

/**
 * Generate route segment config for page.js or layout.js
 * IMPORTANT: Only use in server components (not in files with 'use client')
 * @param {boolean} dynamic - Whether the page is dynamic
 * @returns {Object} Route segment config
 */
export function generateRouteConfig(dynamic = false) {
  if (dynamic) {
    // For dynamic pages like match predictions that change frequently
    return {
      // Revalidate every hour (3600 seconds)
      revalidate: 3600,
      // Dynamic pages should be generated on-demand
      dynamic: 'force-dynamic',
    };
  }
  
  // For static pages like about us, terms, etc.
  return {
    // Cache for 24 hours (86400 seconds)
    revalidate: 86400,
    // Static pages can be generated at build time
    dynamic: 'force-static',
  };
}

/**
 * Client-safe cache helpers that can be used in 'use client' components
 * These don't affect build but can be used for client-side caching
 */

/**
 * Enables browser caching for client-side data fetching
 * Safe to use in client components
 * @param {Object} options - Fetch options
 * @returns {Object} Updated fetch options with cache headers
 */
export function getClientCacheOptions(options = {}) {
  return {
    ...options,
    next: {
      ...options.next,
      revalidate: 3600, // Cache for 1 hour by default
    },
  };
}

/**
 * Prevents caching for client-side data fetching
 * Safe to use in client components
 * @param {Object} options - Fetch options
 * @returns {Object} Updated fetch options with no-cache headers
 */
export function getClientNoCacheOptions(options = {}) {
  return {
    ...options,
    cache: 'no-store',
    next: {
      ...options.next,
      revalidate: 0, // Disable caching
    },
  };
} 