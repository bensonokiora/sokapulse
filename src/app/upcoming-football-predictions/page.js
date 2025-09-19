import { Suspense } from 'react';
import { fetchUpcomingFixtures } from '@/utils/api';
import Footer from '@/components/Footer'; // Keep if needed
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../styles/custom.css';
import SeoContent from '@/components/SeoContent';
import UpcomingFixturesClient from '@/components/UpcomingFixturesClient'; // Import the new client component

// Helper to format date consistently
const formatDate = (date) => {
  if (!date) {
    date = new Date(); // Default to today if no date provided
  }
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Fallback
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// This is now an async Server Component
export default async function UpcomingPredictionsPage({ searchParams }) {
  const selectedDateParam = searchParams?.date; // Get date from URL query params
  let dateForFixtures;

  if (selectedDateParam) {
    // Validate YYYY-MM-DD format and ensure it's a real date
    if (selectedDateParam.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = selectedDateParam.split('-').map(Number);
        // Month in JS Date is 0-indexed, so month-1
        const parsedDate = new Date(year, month - 1, day); 

        // Check if the constructed date is valid and matches the input parts
        // This catches invalid dates like 2023-02-30 or 2023-13-01
        if (parsedDate.getFullYear() === year && 
            parsedDate.getMonth() === month - 1 && 
            parsedDate.getDate() === day) {
            dateForFixtures = parsedDate;
        } else {
            // Invalid date components (e.g., month > 12, day > 31 for the month)
            dateForFixtures = new Date(); // today
            dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
        }
    } else {
      // Invalid format, default to tomorrow
      dateForFixtures = new Date(); // today
      dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
    }
  } else {
    // No date param, default to tomorrow
    dateForFixtures = new Date(); // today
    dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
  }

  const selectedDate = formatDate(dateForFixtures); // Use existing helper to format to YYYY-MM-DD

  let initialFixtures = [];
  let initialError = null; // Renamed for clarity
  let initialHasMore = false;
  let initialNextCursor = null; // Added for pagination

  try {
    console.log('SSR Fetching initial upcoming fixtures for date:', selectedDate);

    // Fetch initial batch using pagination
    const response = await fetchUpcomingFixtures(selectedDate, 20, '1'); // per_page=20, next_cursor='1'

    if (response.status === true && Array.isArray(response.data)) {
      initialFixtures = response.data;
      initialNextCursor = response.nextCursor; // Store the next cursor
      initialHasMore = !!response.nextCursor; // Determine if there are more based on nextCursor
      
      console.log("SSR Fetch successful:", { 
          initialBatchSize: initialFixtures.length,
          hasMore: initialHasMore,
          nextCursor: initialNextCursor
      });

    } else {
      console.error('SSR API error while fetching initial upcoming fixtures:', response.message);
      initialError = response.message || 'Failed to load fixtures on server';
       initialFixtures = [];
       initialHasMore = false;
       initialNextCursor = null;
    }
  } catch (err) {
    console.error('SSR Fetch error:', err);
    initialError = 'Error loading fixtures on server';
     initialFixtures = [];
     initialHasMore = false;
     initialNextCursor = null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
       {/* Suspense boundary can wrap client components if needed */}
      <Suspense fallback={<LoadingAnimation text="Loading Page..." />}>

          {/* Pass server-fetched data to the client component */}
          <UpcomingFixturesClient
            initialFixtures={initialFixtures}
            initialDate={selectedDate}
            initialHasMore={initialHasMore}
            initialNextCursor={initialNextCursor} // Pass the next cursor
            // Pass error to client if you want it to handle initial server error display too
            // initialError={initialError} 
          />

        {/* Render server-side components directly */}
        {initialError && <div className="text-center p-4 text-red-600">Server Error: {initialError}</div>} 
        
         {/* SEO Content can be rendered on the server */}
         <SeoContent pageType="upcoming" siteName="SokaPulse" />

        {/* Footer remains outside client component if static */}
        <Footer />

      </Suspense>
    </div>
  );
}