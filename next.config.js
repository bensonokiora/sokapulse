/** @type {import('next').NextConfig} */
// Use CommonJS format for better compatibility with Next.js
const bundleAnalyzer = require('@next/bundle-analyzer');
const withBundleAnalyzer = bundleAnalyzer();

// Set default environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const SPORTPESA_API_URL = process.env.NEXT_PUBLIC_SPORTPESA_API_URL;
const SPORTPESA_API_KEY = process.env.NEXT_PUBLIC_SPORTPESA_API_KEY;

// Determine if we're in development mode
const isDev = process.env.NODE_ENV !== 'production';

// CSP Configuration
const getCSPDirectives = (isDevelopment) => {
  // Define base directives for all environments
  const baseDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'", 
      "'unsafe-inline'", 
      "'unsafe-eval'",
      // AdSense
      "https://pagead2.googlesyndication.com",
      "https://ep2.adtrafficquality.google",
      // Analytics and tracking
      "https://www.googletagmanager.com",
      "https://*.google.com", 
      "https://*.googleapis.com", 
      "https://*.gstatic.com",
      "https://static.cloudflareinsights.com",
      // Notification services
      "https://cdn.onesignal.com", 
      "https://onesignal.com",
      "https://api.onesignal.com",
      // CDN services
      "https://cdn.jsdelivr.net",
      // Payment processors
      "https://js.paystack.co", 
      "https://*.paystack.co", 
      "https://checkout.paystack.com", 
      "https://standard.paystack.co",
      // Bing crawler domains
      "https://*.bing.com",
      "https://*.msn.com",
      "https://*.bingpreview.com",
      // Google Search Console domains
      "https://*.googlebot.com",
      "https://googleweblight.com",
      "https://*.googlesearchconsole.com"
    ],
    'style-src': [
      "'self'", 
      "'unsafe-inline'",
      // CDN services
      "https://cdn.jsdelivr.net",
      // Notification services
      "https://onesignal.com", 
      "https://cdn.onesignal.com",
      // Payment processors
      "https://paystack.com", 
      "https://*.paystack.co", 
      "https://checkout.paystack.com", 
      "https://standard.paystack.co",
      // Google services
      "https://*.google.com", 
      "https://*.googleapis.com",
      // Bing services
      "https://*.bing.com",
      "https://*.msn.com"
    ],
    'img-src': ["*", "data:", "blob:", "https://*.bing.com", "https://*.msn.com", "https://*.googleusercontent.com", "https://*.gstatic.com"],
    'font-src': [
      "'self'",
      // CDN services
      "https://cdn.jsdelivr.net",
      // Payment processors
      "https://*.paystack.co", 
      "https://checkout.paystack.com",
      // Google services
      "https://*.gstatic.com"
    ],
    'connect-src': ["*", "'self'", "https://*.bing.com", "https://*.msn.com", "https://*.google.com", "https://*.googleapis.com"],
    'frame-src': [
      "'self'",
      // AdSense & Google Ads
      "https://*.googlesyndication.com",
      "https://googleads.g.doubleclick.net",
      // Payment processors
      "https://checkout.paystack.com", 
      "https://paystack.com", 
      "https://standard.paystack.co", 
      "https://*.paystack.co",
      // Google services
      "https://*.google.com", 
      "https://search.google.com",
      // Bing services
      "https://*.bing.com",
      "https://*.msn.com"
    ],
    'object-src': ["'none'"],
    'worker-src': ["'self'", "blob:", "https://cdn.onesignal.com"],
    'frame-ancestors': [
      "'self'", 
      "https://*.google.com", 
      "https://search.google.com",
      "https://*.bing.com",
      "https://*.msn.com"
    ],
    'form-action': [
      "'self'",
      // Payment processors
      "https://checkout.paystack.com", 
      "https://paystack.com", 
      "https://standard.paystack.co", 
      "https://*.paystack.co"
    ],
    'base-uri': ["'self'"],
    'manifest-src': ["'self'"]
  };
  
  // Add development-specific directives
  if (isDevelopment) {
    // Allow localhost and websockets for development
    baseDirectives['connect-src'].push('ws://localhost:*');
    baseDirectives['connect-src'].push('http://localhost:*');
    
    // Add more permissive settings for development if needed
    baseDirectives['script-src'].push("'unsafe-eval'");
  }
  
  // Convert directive object to CSP string
  return Object.entries(baseDirectives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Generate CSP values
const cspValue = getCSPDirectives(isDev);

// Set up CSP reporting URL - use the app's own endpoint
const reportUri = '/api/csp-report';

// Configuration for production builds with improved caching
const nextConfig = {
  // Add webpack configuration to remove console logs in production
  webpack: (config, { dev, isServer }) => {
    // Only remove console logs in production (when dev is false)
    if (!dev) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.minimizer.options.compress.drop_console = true;
        }
      });
    }
    return config;
  },
  
  images: {
    domains: ['media.api-sports.io', 'media-2.api-sports.io', 'media-3.api-sports.io'],
    // Allow images from any domain, but unoptimized
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Add image optimization and caching
    minimumCacheTTL: 60 * 60 * 24, // 24 hours cache for images
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_BASE_URL: API_BASE_URL,
    NEXT_PUBLIC_API_KEY: API_KEY,
    NEXT_PUBLIC_SPORTPESA_API_URL: SPORTPESA_API_URL,
    NEXT_PUBLIC_SPORTPESA_API_KEY: SPORTPESA_API_KEY,
  },
  // Performance and SEO optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // Configure static generation timeouts
  staticPageGenerationTimeout: 180, // 3 minutes
  // Enable compression
  compress: true,
  // SWC minify is now default in Next.js 15+, no need to specify
  
  // Optimize package imports without experimental CSS feature
  experimental: {
    optimizeServerReact: true, // Optimize server-side React rendering
    optimizePackageImports: [
      'bootstrap', 
      'react-icons',
    ],
  },
  
  // Add security headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          // Security headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
          // Report-Only CSP for monitoring purposes (in production only)
          ...(isDev ? [] : [{
            key: 'Content-Security-Policy-Report-Only',
            value: `${cspValue}; report-uri ${reportUri}; report-to csp-endpoint;`,
          }]),
          // Report-To header for CSP violations (in production only)
          ...(isDev ? [] : [{
            key: 'Report-To',
            value: JSON.stringify({
              'group': 'csp-endpoint',
              'max_age': 10886400,
              'endpoints': [
                { 'url': reportUri }
              ]
            })
          }]),
        ],
      },
      {
        // Add correct MIME type for ads.txt
        source: '/ads.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
      {
        // Add correct MIME type for web manifest
        source: '/site.webmanifest',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        // Add correct MIME type for manifest.json
        source: '/assets/images/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        // Add correct MIME type for OneSignal service worker files
        source: '/OneSignalSDKWorker.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        // Add correct MIME type for OneSignal service worker files
        source: '/OneSignalSDK.sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ];
  },
  
  // Add CORS configuration for API routes and static file redirects
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/robots.txt', 
          destination: '/robots.txt',
        },
        {
          source: '/sitemap.xml',
          destination: '/sitemap.xml',
        },
        // If you have API routes that need CORS
        {
          source: '/api/:path*',
          destination: '/api/:path*',
          has: [
            {
              type: 'header',
              key: 'Origin',
            },
          ],
        },
      ],
    };
  },
};

// Wrap with bundle analyzer when ANALYZE flag is set
module.exports = process.env.ANALYZE === 'true' 
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;