import { Suspense } from 'react';
import { fetchUpcomingFixtures } from '@/utils/api';
// NavigationRow will be handled by the client component
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../../styles/custom.css';
import UpcomingBttsClient from './UpcomingBttsClient'; // Import the new client component
import SeoContent from '@/components/SeoContent';

// Helper to format date consistently
const formatDate = (date) => {
  if (!date) {
    date = new Date();
  }
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    // Default to tomorrow if parsing fails or date is invalid
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Server Component for fetching data
export default async function BothTeamToScorePredictionsPage({ searchParams }) {
  const selectedDateParam = searchParams?.date; 
  let dateForFixtures;

  if (selectedDateParam) {
    if (selectedDateParam.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = selectedDateParam.split('-').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (parsedDate.getFullYear() === year && parsedDate.getMonth() === month - 1 && parsedDate.getDate() === day) {
            dateForFixtures = parsedDate;
        } else {
            dateForFixtures = new Date();
            dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
        }
    } else {
      dateForFixtures = new Date();
      dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
    }
  } else {
    dateForFixtures = new Date();
    dateForFixtures.setDate(dateForFixtures.getDate() + 1); // tomorrow
  }

  const initialSelectedDate = formatDate(dateForFixtures);

  let initialFixtures = [];
  let initialError = null;
  let initialHasMore = false;
  let initialNextCursor = null;

  try {
    console.log('SSR BTTS Fetching initial fixtures for date:', initialSelectedDate);
    const response = await fetchUpcomingFixtures(initialSelectedDate, 20, '1');

    if (response.status === true && Array.isArray(response.data)) {
      initialFixtures = response.data;
      initialNextCursor = response.nextCursor;
      initialHasMore = !!response.nextCursor;
      console.log("SSR BTTS Fetch successful:", { 
          initialBatchSize: initialFixtures.length,
          hasMore: initialHasMore,
          nextCursor: initialNextCursor
      });
    } else {
      console.error('SSR BTTS API error:', response.message);
      initialError = response.message || 'Failed to load fixtures on server';
    }
  } catch (err) {
    console.error('SSR BTTS Fetch error:', err);
    initialError = 'Error loading fixtures on server';
  }

  return (
    <div className="container container-mob mx-auto px-0 sm:px-4">
      {/* NavigationRow removed, will be in client */}
      <Suspense fallback={<LoadingAnimation text="Loading Predictions..." />}>
        <UpcomingBttsClient
          initialFixtures={initialFixtures}
          initialSelectedDate={initialSelectedDate} // Pass the formatted date string
          initialHasMore={initialHasMore}
          initialNextCursor={initialNextCursor}
          initialError={initialError}
        />
      </Suspense>

      {initialError && <div className="text-center p-4 text-red-600">Server Error: {initialError}</div>} 
      
      <SeoContent pageType="upcoming-btts" siteName="SokaPulse" />
    </div>
  );
} 