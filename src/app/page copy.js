import { Suspense } from 'react';
import { fetchFixturesByDatePaginated } from '@/utils/api'; 
import '../styles/custom.css';
import SeoContent from '@/components/SeoContent';
import OptimizedTitle from '@/components/OptimizedTitle';
import FixturesList from '@/components/FixturesList';

// Helper function remains the same
const formatDate = (date) => {
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return date;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Server Component to fetch initial data
export default async function Home() {
  const initialDate = new Date();
  const formattedDate = formatDate(initialDate);
  let initialFixtures = [];
  let initialError = null;
  let initialNextCursor = null;
  const perPage = 20; // Define items per page

  // Use fetchFixturesByDatePaginated for today's date
  try {
    console.log(`Fetching initial fixtures for date: ${formattedDate} with pagination`);
    // Fetch initial page of fixtures
    const apiResponse = await fetchFixturesByDatePaginated(formattedDate, perPage, '1');
    console.log(`Initial fixtures paginated response status: ${apiResponse?.status}`); // Log API status

    if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
      initialFixtures = apiResponse.fixtures;
      initialNextCursor = apiResponse.nextCursor;
    } else {
      console.error('API (paginated) returned non-success status or invalid data structure:', apiResponse);
      initialError = apiResponse.message || 'Failed to load fixtures';
    }
  } catch (err) {
    console.error("Error fetching initial fixtures:", err);
    // Handle potential ECONNRESET or other fetch errors from fetchFixturesByDatePaginated
    if (err.cause && err.cause.code === 'ECONNRESET') {
      initialError = 'Connection reset while fetching fixtures (ECONNRESET).';
    } else if (err.name === 'AbortError') {
        initialError = `Fixture request timed out: ${err.message}`;
    } else if (err.name === 'TypeError' && err.message.includes('fetch failed')) { // More specific check for fetch failure
        initialError = `Network error fetching fixtures. Cause: ${err.cause ? err.cause.message : 'Unknown'}`;
    } else {
        initialError = `Error loading fixtures: ${err.message}`;
    }
  }

  // Render the page structure, passing initial data to the Client Component
  return (
    <div className="compact-homepage">
      <Suspense fallback={<div></div>}>
        <div className="compact-title-section">
          <OptimizedTitle title="Free Football Predictions, Tips & Statistics" />
        </div>
        
        <div className="compact-content-container">
          <div className="compact-main-content">
              {/* FixturesList will handle NavigationRow, PredictionNav, Headers, Fixtures, Load More, Errors */}
              <FixturesList
                initialFixtures={initialFixtures}
                initialNextCursor={initialNextCursor}
                perPage={perPage}
                initialDate={initialDate}
                initialError={initialError}
              />
              
              {/* SEO Content can remain here if static or moved to FixturesList if dynamic */}
              <div id="seo-content-priority-wrapper" className="compact-seo-section">
                <SeoContent />
              </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
