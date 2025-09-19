import { NextResponse } from 'next/server';
import { fetchJackpots, fetchJackpotMatches } from '@/utils/api'; // Import functions that talk to the backend

// GET /api/jackpots?date=YYYY-MM-DD                -> Fetches bookmakers
// GET /api/jackpots?date=YYYY-MM-DD&bookmakerId=ID  -> Fetches matches for bookmaker
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const bookmakerId = searchParams.get('bookmakerId'); // Optional

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  try {
    let data;
    if (bookmakerId) {
      // Fetch matches for a specific bookmaker
      console.log(`[API Route /api/jackpots] Fetching matches for date: ${date}, bookmaker: ${bookmakerId}`);
      data = await fetchJackpotMatches(date, bookmakerId);
      // Assuming fetchJackpotMatches returns the array directly or handles errors internally
      // If it wraps response, adjust here: e.g., return NextResponse.json(data.data || []);
    } else {
      // Fetch list of bookmakers (jackpots)
      console.log(`[API Route /api/jackpots] Fetching bookmakers for date: ${date}`);
      data = await fetchJackpots(date);
      // Assuming fetchJackpots returns the array directly or handles errors internally
    }

    // Return the data fetched from the backend API
    return NextResponse.json(data);

  } catch (error) {
    console.error('[API Route /api/jackpots] Error:', error);

    let errorMessage = 'Internal Server Error';
    let statusCode = 500;

    // Add specific error handling if needed (timeout, connection reset etc.)
    if (error.message.includes('timed out')) {
        errorMessage = 'Backend API request timed out';
        statusCode = 504;
    } else if (error.cause?.code === 'ECONNRESET') {
        errorMessage = 'Connection reset while communicating with backend API';
        statusCode = 502;
    }

    // Return an empty array or appropriate error structure based on expected client handling
    return NextResponse.json({ error: errorMessage, data: [] }, { status: statusCode });
  }
} 