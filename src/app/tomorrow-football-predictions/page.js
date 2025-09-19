import { Suspense } from 'react';
import Link from 'next/link';
import { fetchFixturesByDatePaginated } from '@/utils/api';
import NavigationRow from '@/components/NavigationRow';
import '../../styles/custom.css';
import SeoContent from '@/components/SeoContent';
import TomorrowFixturesDisplay from '@/components/TomorrowFixturesDisplay';

const getTomorrowDate = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

export default async function Home() {
  const tomorrowDate = getTomorrowDate();
  let initialFixtures = [];
  let error = null;
  let initialNextCursor = null;
  const perPage = 20;

  try {
    console.log('Fetching fixtures server-side for date:', tomorrowDate, 'perPage:', perPage, 'cursor: 1');
    const initialData = await fetchFixturesByDatePaginated(tomorrowDate, perPage, '1');
    console.log('API response (server-side):', initialData);

    if (initialData.status === true && Array.isArray(initialData.fixtures)) {
      initialFixtures = initialData.fixtures;
      initialNextCursor = initialData.nextCursor;
    } else {
      console.error('API error (server-side):', initialData.message);
      error = initialData.message || 'Failed to load fixtures';
    }
  } catch (err) {
    console.error('Fetch error (server-side):', err);
    error = 'Error loading fixtures';
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div>Loading Navigation...</div>}>
        <NavigationRow selectedDate={tomorrowDate} />
      </Suspense>

      <div className="row" style={{ marginLeft: '0px', height: 'auto !important' }}>
        <div className="col-lg-12" style={{ height: 'auto !important' }}>
          <div className="responsive-row" style={{ textAlign: 'center', backgroundColor: 'rgb(211, 211, 211)', marginLeft: '1px', borderRadius: '5px', cursor: 'auto' }}>
            <div className="table-cell">
              <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Free Football Predictions, Tips & Statistics for Tomorrow</h1>
            </div>
          </div>

          {error ? (
            <div className="text-center p-4 text-red-500">{error}</div>
          ) : (
            <Suspense fallback={<div>Loading Fixtures...</div>}>
              <TomorrowFixturesDisplay 
                initialFixtures={initialFixtures} 
                initialDate={tomorrowDate}
                initialNextCursor={initialNextCursor}
                perPage={perPage}
              />
            </Suspense>
          )}

          <SeoContent pageType="tomorrow" siteName="SokaPulse" />
        </div>
      </div>
    </div>
  );
}