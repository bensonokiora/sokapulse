import { NextResponse } from 'next/server';

// Handle GET requests to /ads.txt
export async function GET() {
  const adsContent = 'google.com, pub-6415640710219864, DIRECT, f08c47fec0942fa0';
  
  return new NextResponse(adsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}