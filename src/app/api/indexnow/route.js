import { NextResponse } from 'next/server';
import { notifyIndexNow, notifyMultipleUrls } from '@/utils/indexNow';

/**
 * API endpoint to notify IndexNow about updated content
 * 
 * Example POST request:
 * {
 *   "urls": ["https://sokapulse.com/page1", "/page2"],
 *   "apiKey": "your_api_key_for_auth"
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { urls, apiKey, singleUrl } = body;
    
    // Basic API key validation - replace with your actual API key validation
    const validApiKey = process.env.INDEXNOW_API_KEY || 'your-admin-api-key';
    if (apiKey !== validApiKey) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    let result;
    
    // Handle single URL or multiple URLs
    if (singleUrl) {
      result = await notifyIndexNow(singleUrl);
    } else if (urls && Array.isArray(urls) && urls.length > 0) {
      result = await notifyMultipleUrls(urls);
    } else {
      return NextResponse.json(
        { success: false, error: 'No valid URLs provided' },
        { status: 400 }
      );
    }
    
    if (result.success) {
      return NextResponse.json(
        { success: true, message: 'IndexNow notification sent successfully', data: result.data },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in IndexNow API route:', error);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get status of IndexNow setup
 */
export async function GET() {
  return NextResponse.json(
    { 
      success: true, 
      message: 'IndexNow API is operational',
      documentation: 'Send a POST request with URLs to notify search engines'
    },
    { status: 200 }
  );
} 