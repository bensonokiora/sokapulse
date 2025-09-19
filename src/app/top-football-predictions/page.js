import { Suspense } from 'react';
import Link from 'next/link';
import { fetchTopPredictions } from '@/utils/api';
import { formatDate } from '@/utils/formatDate';
import LoadingAnimation from '@/components/LoadingAnimation';
import '../../styles/custom.css';
import SeoContent from '@/components/SeoContent';
import TopFixturesList from '@/components/TopFixturesList';

export default async function TopFootballPredictionsPage() {
  let initialFixtures = [];
  let initialError = null;
  let initialHasMore = false;
  const today = formatDate();
  let initialNextCursor = null;

  try {
    console.log(`(Server) Fetching initial top predictions for date: ${today}`);
    const data = await fetchTopPredictions(today, 20, '1');
    console.log(`(Server) Initial top predictions response status: ${data?.status}, nextCursor: ${data?.nextCursor}`);

    if (data.status === true && Array.isArray(data.data)) {
      initialFixtures = data.data;
      initialNextCursor = data.nextCursor;
      initialHasMore = !!data.nextCursor;
    } else {
      console.error('(Server) API returned non-success status or invalid data structure for top predictions:', data);
      initialError = data?.message || 'Failed to load top predictions initially';
    }
  } catch (err) {
    console.error("(Server) Error fetching initial top predictions:", err);
    initialError = 'Error loading initial top predictions';
    if (err.cause && err.cause.code === 'ECONNRESET') {
      initialError = 'Connection reset while fetching top predictions (ECONNRESET).';
    } else if (err.name === 'AbortError') {
        initialError = `Top predictions request timed out: ${err.message}`;
    } else if (err.name === 'TypeError' && err.message.includes('fetch failed')) {
        initialError = `Network error fetching top predictions. Cause: ${err.cause ? err.cause.message : 'Unknown'}`;
    } else {
        initialError = `Error loading top predictions: ${err.message}`;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div className="flex justify-center items-center w-full h-64"><LoadingAnimation text="Loading page..." /></div>}>
        <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
          <div className="col-lg-12" style={{ height: 'auto !important' }}>
            
            <div className="responsive-row" style={{
                textAlign: 'center',
                backgroundColor: '#D3D3D3',
                marginLeft: '1px',
                borderRadius: '5px',
                cursor: 'auto'
            }}>
                <div className="table-cell">
                    <h1 style={{fontSize: '18px', fontWeight: 'bold'}}>Top Football Predictions & Tips</h1>
                </div>
            </div>

            <TopFixturesList
              initialFixtures={initialFixtures}
              initialHasMore={initialHasMore}
              initialError={initialError}
              initialDate={new Date()}
              initialNextCursor={initialNextCursor}
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
