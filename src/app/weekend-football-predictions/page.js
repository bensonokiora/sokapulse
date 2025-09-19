import { Suspense } from 'react';
import Link from 'next/link';
import { fetchWeekendFixtures } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import '../../styles/custom.css';
import SeoContent from '@/components/SeoContent';
import WeekendFixturesDisplay from '@/components/WeekendFixturesDisplay';
import LoadingAnimation from '@/components/LoadingAnimation';

// Helper to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Convert Home to an async server component
export default async function WeekendPredictionsPage() {
  const currentDate = getCurrentDate();
  let initialFixtures = [];
  let initialError = null;
  let initialHasMore = false;
  let initialNextCursor = null;

  try {
    console.log('SSR Fetching initial weekend fixtures, reference date:', currentDate);
    // Fetch the first page of weekend fixtures
    const response = await fetchWeekendFixtures(currentDate, 20, '1'); // per_page=20, next_cursor='1'
    console.log('API response (server-side weekend):', response);

    if (response.status === true && Array.isArray(response.data)) {
      initialFixtures = response.data;
      initialNextCursor = response.nextCursor;
      initialHasMore = !!response.nextCursor;
      console.log("SSR Weekend Fetch successful:", {
        initialBatchSize: initialFixtures.length,
        hasMore: initialHasMore,
        nextCursor: initialNextCursor
      });
    } else {
      console.error('API error (server-side weekend):', response.message);
      initialError = response.message || 'Failed to load weekend fixtures';
    }
  } catch (err) {
    console.error('Fetch error (server-side weekend):', err);
    initialError = 'Error loading weekend fixtures';
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<LoadingAnimation text="Loading Navigation..." />}>
        <NavigationRow />
      </Suspense>

      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12" style={{ height: 'auto !important' }}>
          <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
            <div className="table-cell">
              <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Weekend Football Predictions for Friday, Saturday and Sunday Fixtures</h1>
            </div>
          </div>

          <Suspense fallback={<LoadingAnimation text="Loading Fixtures..." />}>
            <WeekendFixturesDisplay
              initialFixtures={initialFixtures}
              initialDate={currentDate}
              initialHasMore={initialHasMore}
              initialNextCursor={initialNextCursor}
              initialError={initialError}
            />
          </Suspense>

          {initialError && (
            <div className="text-center p-4 text-red-500">{initialError}</div>
          )}

          <SeoContent pageType="weekend" siteName="SokaPulse" />
        </div>
      </div>
    </div>
  );
}