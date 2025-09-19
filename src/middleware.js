import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Handle basic authentication for /create-bet route first
  if (request.nextUrl.pathname.startsWith('/create-bet')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const user = auth[0];
      const pass = auth[1];

      const basicUser = process.env.BASIC_AUTH_USER || 'okiora';
      const basicPass = process.env.BASIC_AUTH_PASS || '@_b_e_n_b_e_n_';

      // If credentials do not match, send 401 response
      if (user !== basicUser || pass !== basicPass) {
        return new NextResponse('Authentication required', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
          },
        });
      }
      // If authentication is successful, we fall through to the rest of the middleware logic
    } else {
      // If no authorization header is present, demand credentials
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      });
    }
  }

  // Continue with existing middleware logic for all other requests,
  // and for authenticated /create-bet requests.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // Get the response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Check if the request is from a search engine bot
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /bot|crawl|spider|slurp|bingpreview|msn|duckduckbot|googlebot|yandex/i.test(userAgent);
  
  // Don't add cache headers for API routes
  if (!request.nextUrl.pathname.includes('/api/')) {
    if (isBot) {
      // No caching for bots to ensure fresh content is always crawled
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      // Add header to explicitly allow indexing
      response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    } else {
      // Regular caching for users
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400');
    }
    
    response.headers.set('Vary', 'User-Agent');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - ads.txt (handled separately)
     * This already covers /create-bet, but we keep it clean.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|ads.txt).*)',
  ],
}; 