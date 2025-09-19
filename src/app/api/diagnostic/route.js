import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

/**
 * Diagnostic API endpoint to help identify potential crawling issues
 * This endpoint can be accessed at /api/diagnostic
 */
export async function GET(request) {
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || 'Unknown';
  const host = headersList.get('host') || 'Unknown';
  const referer = headersList.get('referer') || 'None';
  const accept = headersList.get('accept') || 'Unknown';
  const acceptLanguage = headersList.get('accept-language') || 'Unknown';
  const connection = headersList.get('connection') || 'Unknown';
  const cacheControl = headersList.get('cache-control') || 'None';
  const url = request.url || 'Unknown';
  
  // Check if the request is from a search engine bot
  const isBot = /bot|crawl|spider|slurp|bingpreview|msn|duckduckbot|googlebot|yandex/i.test(userAgent);
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  
  const diagnosticInfo = {
    timestamp: new Date().toISOString(),
    request: {
      url: url,
      userAgent: userAgent,
      host: host,
      referer: referer,
      accept: accept,
      acceptLanguage: acceptLanguage,
      connection: connection,
      cacheControl: cacheControl,
      isBot: isBot,
      ip: request.headers.get('x-forwarded-for') || 'Unknown',
    },
    server: {
      nodejs: process.version,
      memory: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      },
      env: process.env.NODE_ENV,
    },
    headers: Object.fromEntries(headersList.entries()),
  };
  
  // Return response based on format
  if (format === 'html') {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Diagnostic Information</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 2rem; max-width: 800px; margin: 0 auto; }
            pre { background: #f1f1f1; padding: 1rem; overflow: auto; border-radius: 4px; }
            h1 { color: #333; }
            .section { margin-bottom: 2rem; }
            .bot { color: #e00; font-weight: bold; }
            .normal { color: #080; }
          </style>
        </head>
        <body>
          <h1>Diagnostic Information</h1>
          <div class="section">
            <h2>Request Information</h2>
            <p><strong>URL:</strong> ${diagnosticInfo.request.url}</p>
            <p><strong>User Agent:</strong> <span class="${isBot ? 'bot' : 'normal'}">${diagnosticInfo.request.userAgent}</span></p>
            <p><strong>Is Bot:</strong> <span class="${isBot ? 'bot' : 'normal'}">${isBot ? 'Yes' : 'No'}</span></p>
            <p><strong>Host:</strong> ${diagnosticInfo.request.host}</p>
            <p><strong>Referer:</strong> ${diagnosticInfo.request.referer}</p>
            <p><strong>IP:</strong> ${diagnosticInfo.request.ip}</p>
          </div>
          
          <div class="section">
            <h2>Server Information</h2>
            <p><strong>Node.js:</strong> ${diagnosticInfo.server.nodejs}</p>
            <p><strong>Environment:</strong> ${diagnosticInfo.server.env}</p>
            <p><strong>Memory (RSS):</strong> ${diagnosticInfo.server.memory.rss}</p>
          </div>
          
          <div class="section">
            <h2>All Headers</h2>
            <pre>${JSON.stringify(diagnosticInfo.headers, null, 2)}</pre>
          </div>
          
          <div class="section">
            <h2>Full Diagnostic Data</h2>
            <pre>${JSON.stringify(diagnosticInfo, null, 2)}</pre>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  }
  
  // Default JSON response
  return NextResponse.json(diagnosticInfo, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
} 