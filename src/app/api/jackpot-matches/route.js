import { NextResponse } from 'next/server';
import { fetchJackpotMatches } from '@/utils/api'; // Import the server-side utility

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const bookmakerId = searchParams.get('bookmakerId');
  const fixturesCount = searchParams.get('fixtures_count') || 20; // Accept fixtures_count parameter

  if (!date || !bookmakerId) {
    return NextResponse.json({ error: 'Missing date or bookmakerId parameter' }, { status: 400 });
  }

  try {
    // Use the utility function with the correct fixtures count
    const matches = await fetchJackpotMatches(date, bookmakerId, parseInt(fixturesCount));
    return NextResponse.json(matches);
  } catch (error) {
    // Return a generic error message to the client
    return NextResponse.json({ error: 'Failed to fetch jackpot matches' }, { status: 500 });
  }
} 