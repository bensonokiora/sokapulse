import { Suspense } from 'react';
import Link from 'next/link';
import { fetchGroupedFixtures } from '@/utils/api';
import { formatDate } from '@/utils/formatDate';
import '../../styles/custom.css';
import LoadingAnimation from '@/components/LoadingAnimation';
import SeoContent from '@/components/SeoContent';
import GroupedFixturesList from '@/components/GroupedFixturesList';

// Helper function for grouping (can stay on server)
const groupFixturesByLeague = (fixtures) => {
  if (!Array.isArray(fixtures)) return {};
  return fixtures.reduce((acc, fixture) => {
    const key = `${fixture.country_name}:${fixture.league_name}:${fixture.league_id}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(fixture);
    return acc;
  }, {});
};

// Make the component async
export default async function FootballPredictionsGroupedPage() {
  let initialFixturesRaw = []; // Store the raw initial fetch
  let initialGroupedFixtures = {};
  let initialError = null;
  let initialHasMore = false;
  const today = formatDate();
  const initialDate = new Date(); // For passing to client component
  const initialLimit = 20; // Define initial fetch limit

  try {
    console.log(`(Server) Fetching initial ${initialLimit} grouped fixtures for date: ${today}`);
    // Update fetch call to use proper endIndex calculation
    const data = await fetchGroupedFixtures(today, 0, initialLimit); 
    console.log(`(Server) Initial grouped fixtures response status: ${data?.status}`);

    if (data.status === true && Array.isArray(data.data)) {
      initialFixturesRaw = data.data;
      initialGroupedFixtures = groupFixturesByLeague(initialFixturesRaw);
      // Determine if more might exist based on initial fetch count
      initialHasMore = initialFixturesRaw.length >= initialLimit;
      console.log(`(Server) Initial fixtures loaded: ${initialFixturesRaw.length}, hasMore: ${initialHasMore}`);
    } else {
      console.error('(Server) API returned non-success status or invalid data for grouped fixtures:', data);
      initialError = data?.message || 'Failed to load grouped fixtures initially';
    }
  } catch (err) {
    console.error("(Server) Error fetching initial grouped fixtures:", err);
    initialError = 'Error loading initial grouped fixtures';
     if (err.cause && err.cause.code === 'ECONNRESET') {
      initialError = 'Connection reset while fetching grouped fixtures (ECONNRESET).';
    } else if (err.name === 'AbortError') {
        initialError = `Grouped fixtures request timed out: ${err.message}`;
    } else if (err.name === 'TypeError' && err.message.includes('fetch failed')) {
        initialError = `Network error fetching grouped fixtures. Cause: ${err.cause ? err.cause.message : 'Unknown'}`;
    } else {
        initialError = `Error loading grouped fixtures: ${err.message}`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div className="flex justify-center items-center w-full h-64"><LoadingAnimation text="Loading page..." /></div>}>
        <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
          <div className="col-lg-12" style={{ height: 'auto !important' }}>
            {/* Keep static elements */}
            
             <div className="responsive-row" style={{
                  textAlign: 'center',
                  backgroundColor: '#D3D3D3',
                  marginLeft: '1px',
                  borderRadius: '5px',
                  cursor: 'auto'
             }}>
                <div className="table-cell">
                    <h1 style={{fontSize: '18px', fontWeight: 'bold'}}>Predictions Grouped By League</h1>
                </div>
             </div>

            {/* Delegate to Client Component */}
            <GroupedFixturesList
              initialGroupedFixtures={initialGroupedFixtures}
              initialFixturesRaw={initialFixturesRaw}
              initialError={initialError}
              initialDate={initialDate}
              initialHasMore={initialHasMore}
            />
             <div
              id="seo-content-priority-wrapper"
              style={{
                display: 'block',
                visibility: 'visible',
                contentVisibility: 'visible',
                contain: 'layout style',
                minHeight: '60px'
              }}
             >
               <SeoContent />
             </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
