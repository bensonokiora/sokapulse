import { fetchWeekendFixtures } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import '../../../styles/custom.css';
import DoubleChancePredictionsClient from './DoubleChancePredictionsClient';
import SeoContent from '@/components/SeoContent';
import { Suspense } from 'react';
import LoadingAnimation from '@/components/LoadingAnimation';

const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export default async function DoubleChancePredictionsPage() {
  const currentDate = getCurrentDate();
  let initialFixtures = [];
  let initialError = null;
  let initialHasMore = false;
  let initialNextCursor = null;

  try {
    console.log(`(Server DC Weekend) Fetching initial weekend fixtures, reference date: ${currentDate}`);
    const response = await fetchWeekendFixtures(currentDate, 20, '1');

    if (response.status === true && Array.isArray(response.data)) {
      initialFixtures = response.data;
      initialNextCursor = response.nextCursor;
      initialHasMore = !!response.nextCursor;
    } else {
      console.error('(Server DC Weekend) API error:', response.message);
      initialError = response.message || 'Failed to load weekend double chance fixtures';
    }
  } catch (err) {
    console.error('(Server DC Weekend) Fetch error:', err);
    initialError = 'Error loading weekend double chance fixtures';
  }

  return (
    <div className="container container-mob">
      <Suspense fallback={<LoadingAnimation text="Loading Navigation..." />}>
        <NavigationRow />
      </Suspense>
      
      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12">
          <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
            <div className="table-cell">
              <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Weekend Double Chance Predictions</h1>
            </div>
          </div>

          <Suspense fallback={<LoadingAnimation text="Loading Predictions..." />}>
            <DoubleChancePredictionsClient
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
          
          <SeoContent pageType="weekend-double-chance" siteName="SokaPulse" />
        </div>
      </div>
    </div>
  );
}
