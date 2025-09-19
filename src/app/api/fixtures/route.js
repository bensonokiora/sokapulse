import { NextResponse } from 'next/server';
import { fetchFixturesByDatePaginated } from '@/utils/api'; // Updated import

// Example: GET /api/fixtures?date=2023-10-27&perPage=20&nextCursor=1
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const perPageParam = searchParams.get('perPage');
  const nextCursor = searchParams.get('nextCursor') || '1'; // Default to '1' if not provided

  if (!date) {
    return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
  }

  const perPage = parseInt(perPageParam || '20', 10);

  if (isNaN(perPage) || perPage <= 0) {
    return NextResponse.json({ error: 'Invalid perPage parameter' }, { status: 400 });
  }

  try {
    // Call the fetchFixturesByDatePaginated function
    // This function handles the API key and base URL internally
    const paginatedData = await fetchFixturesByDatePaginated(date, perPage, nextCursor);

    // The fetchFixturesByDatePaginated function already returns a structured response:
    // { status: boolean, message: string, fixtures: array, nextCursor: string|null, perPage: number }
    // We can return this directly.
    if (paginatedData.status === true) {
      return NextResponse.json(paginatedData);
    } else {
      // If the underlying API call failed (status: false), return its error message and a 500 status
      // or a more specific status if available from paginatedData.statusCode (if you add it there)
      return NextResponse.json(
        { error: paginatedData.message || 'Failed to fetch fixtures from backend' }, 
        { status: 500 } // Consider using a more specific error code if known
      );
    }

  } catch (error) {
    console.error('[API Route /api/fixtures] Error fetching paginated fixtures:', error);

    let errorMessage = 'Internal Server Error';
    let statusCode = 500;

    // You can add more specific error handling if needed, similar to before
    if (error.message && error.message.includes('timed out')) {
        errorMessage = 'Backend API request timed out';
        statusCode = 504; // Gateway Timeout
    } else if (error.cause?.code === 'ECONNRESET') {
        errorMessage = 'Connection reset while communicating with backend API';
        statusCode = 502; // Bad Gateway
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
