// src/app/(jackpot)/jackpot-predictions/page.js
import { fetchJackpots, fetchJackpotMatches } from '@/utils/api';
import JackpotListSimple from '@/components/JackpotListSimple';

// Helper function to format date for API calls (YYYY-MM-DD)
// Duplicated here as this is a Server Component
const formatDateForApi = (date) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    // Fallback to today if the date is invalid
    return new Date().toISOString().split('T')[0];
  }
  return dateObj.toISOString().split('T')[0];
};

export default async function JackpotPredictionsPage() {
  // Restore fetching initial data
  let initialBookmakers = [];
  let initialMatches = [];
  let initialSelectedBookmakerId = null;
  let initialError = null;
  const initialDate = new Date();
  const dateString = initialDate.toISOString(); // Pass consistent date string
  const formattedDate = formatDateForApi(initialDate); // Restore date formatting

  console.log(`[Server Component] Fetching initial jackpot data for date: ${formattedDate} (No Suspense).`);

  // Restore fetching logic
  try {
    // Fetch bookmakers first
    initialBookmakers = await fetchJackpots(formattedDate);
    console.log(`[Server Component] Fetched ${initialBookmakers?.length ?? 0} bookmakers.`);

    if (initialBookmakers && initialBookmakers.length > 0) {
      initialSelectedBookmakerId = initialBookmakers[0].id; // Select the first one
      console.log(`[Server Component] Selected initial bookmaker ID: ${initialSelectedBookmakerId}`);

      // Fetch matches for the selected bookmaker
      try {
        initialMatches = await fetchJackpotMatches(formattedDate, initialSelectedBookmakerId);
        console.log(`[Server Component] Fetched ${initialMatches?.length ?? 0} matches for bookmaker ${initialSelectedBookmakerId}.`);
      } catch (matchError) {
        console.error(`[Server Component] Error fetching initial matches for bookmaker ${initialSelectedBookmakerId}:`, matchError);
        // Don't necessarily kill the page, let the client try, but clear matches
        initialError = `Failed to load initial matches for ${initialBookmakers[0].bookmaker}. The list might be empty initially.`;
        initialMatches = [];
      }
    } else {
      console.log('[Server Component] No bookmakers found for the initial date.');
      // No bookmakers found, set state accordingly
      initialBookmakers = [];
      initialMatches = [];
      initialSelectedBookmakerId = null;
      // Optionally set an error, or let the client component show "No jackpots"
      // initialError = 'No jackpots available for today.'; 
    }
  } catch (error) {
    console.error('[Server Component] Error fetching initial jackpots:', error);
    initialError = `Failed to load initial jackpot data: ${error.message || 'Unknown error'}`;
    // Ensure defaults on error
    initialBookmakers = [];
    initialMatches = [];
    initialSelectedBookmakerId = null;
  }

  return (
      <JackpotListSimple
        initialBookmakers={initialBookmakers} 
        initialMatches={initialMatches} 
        initialSelectedBookmakerId={initialSelectedBookmakerId}
        initialDateString={dateString} 
        initialError={initialError} 
      />
  );
} 