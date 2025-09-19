import { Suspense } from 'react';
import { fetchFixturesByDatePaginated } from '@/utils/api';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../../styles/custom.css';
import { formatDate } from '@/utils/dateUtils';
import SeoContent from '@/components/SeoContent';
import DoubleChancePredictionsClient from '@/components/DoubleChancePredictionsClient';

export default async function DoubleChancePredictions() {
  const initialDate = new Date();
  const formattedDate = formatDate(initialDate);
  let initialFixtures = [];
  let initialError = null;
  let initialNextCursor = null;
  const perPage = 20;

  try {
    console.log(`(Server) Fetching initial double chance fixtures for date: ${formattedDate}`);
    const apiResponse = await fetchFixturesByDatePaginated(formattedDate, perPage, '1');
    console.log(`(Server) Initial double chance fixtures response status: ${apiResponse?.status}`);

    if (apiResponse.status === true && Array.isArray(apiResponse.fixtures)) {
      initialFixtures = apiResponse.fixtures;
      initialNextCursor = apiResponse.nextCursor;
    } else {
      console.error('(Server) Double chance API returned non-success status or invalid data structure:', apiResponse);
      initialError = apiResponse?.message || 'Failed to load fixtures';
    }
  } catch (err) {
    console.error("(Server) Error fetching initial double chance fixtures:", err);
    if (err.cause && err.cause.code === 'ECONNRESET') {
      initialError = 'Connection reset while fetching fixtures (ECONNRESET).';
    } else if (err.name === 'AbortError') {
      initialError = `Fixture request timed out: ${err.message}`;
    } else if (err.name === 'TypeError' && err.message.includes('fetch failed')) {
      initialError = `Network error fetching fixtures. Cause: ${err.cause ? err.cause.message : 'Unknown'}`;
    } else {
      initialError = `Error loading fixtures: ${err.message}`;
    }
  }

  return (
    <div className="compact-homepage">
      <Suspense fallback={<div></div>}>
        <div className="compact-content-container">
          <div className="compact-main-content">
            <DoubleChancePredictionsClient 
              initialFixtures={initialFixtures} 
              initialError={initialError}
              initialNextCursor={initialNextCursor}
              perPage={perPage}
              initialDate={initialDate}
            />
            
            <div id="seo-content-priority-wrapper" className="compact-seo-section">
              <SeoContent />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
